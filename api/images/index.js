const express = require("express");
const { HttpError } = require("../../middlewares/error.js");
const multer = require("../../middlewares/multer-config-cont.js");
const optimizeImage = require("../../middlewares/multer-sharp-cont.js");
const auth = require("../../middlewares/auth.js");
const {
  uploadFileContent,
  getFileStream,
  uploadFileImages,
} = require("../../managers/s3.js");
const fs = require("fs");
const util = require("util");
const { getMimeTypeFromKey } = require("../../managers/getMimeTypeFromKey.js");
const unlinkFile = util.promisify(fs.unlink);

let route = express.Router({ mergeParams: true });

route.post("/", auth, multerConfig, optimizeImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const selectedFolder = req.body.folder;

  let result;
  if (selectedFolder === "titre-images") {
    result = await uploadFileImages(req.file.buffer, req.file.filename);
  } else if (selectedFolder === "content") {
    result = await uploadFileContent(req.file.buffer, req.file.filename);
  } else {
    return res.status(401).json({ error: "Erreur dans le dossier" });
  }

  res.send({ link: result.Location });
});

route.get("/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.on("error", function (err) {
    res.status(500).send("Erreur lors de la lecture du fichier");
  });

  // Déterminez le type MIME de l'image en fonction de l'extension du fichier
  const mimeType = getMimeTypeFromKey(key);
  if (mimeType) {
    res.setHeader("Content-Type", mimeType);
  } else {
    // Si le type MIME n'est pas déterminé, définissez un type MIME par défaut
    res.setHeader("Content-Type", "application/octet-stream");
  }

  readStream.pipe(res);
});

module.exports = route;
