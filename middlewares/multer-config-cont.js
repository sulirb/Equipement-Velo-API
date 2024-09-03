const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const isValid = !!MIME_TYPES[file.mimetype];
  let error = isValid ? null : new Error("Invalid mime type!");
  callback(error, isValid);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // limite à 5MB par exemple
  },
}).single("image");

module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Si le fichier est valide, ajoutez les informations nécessaires à req.file
    if (req.file) {
      const title = req.body.title;
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-");
      const extension = MIME_TYPES[req.file.mimetype];
      req.file.filename = `${slug}-${Date.now()}.${extension}`;
    }

    next();
  });
};
