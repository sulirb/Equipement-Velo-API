const express = require("express");
const { HttpError } = require("../../middlewares/error.js");
const Image = require("../../models/Images.js");
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

route.post("/", auth, multer, optimizeImage, async (req, res) => {
  const file = req.file;
  const selectedFolder = req.body.folder;
  console.log(file);
  console.log(selectedFolder);

  let result;
  if (selectedFolder === "titre-images") {
    result = await uploadFileImages(file);
  } else if (selectedFolder === "content") {
    result = await uploadFileContent(file);
  } else {
    throw new HttpError(401, {
      message: "Erreur dans le dossier",
    });
  }

  // apply filter
  // resize
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
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
