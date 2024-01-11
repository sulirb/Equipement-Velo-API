const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/title/");
  },
  filename: (req, file, callback) => {
    const title = req.body.title;
    // Remplacez les espaces par des tirets et supprimez les caractères non alphanumériques
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, slug + "-" + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
