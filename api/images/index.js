const express = require("express");
const { HttpError } = require("../../middlewares/error.js");
const Image = require("../../models/Images.js");
const multer = require("../../middlewares/multer-config-cont.js");
const optimizeImage = require("../../middlewares/multer-sharp-cont.js");
const auth = require("../../middlewares/auth.js");

let route = express.Router({ mergeParams: true });

route.post("/", auth, multer, optimizeImage, async (req, res) => {
  const imageObject = req.body;
  const image = new Image({
    ...imageObject,
    file: `${req.protocol}://${req.get("host")}/images/content/${
      req.file.filename
    }`,
  });
  await image.save().catch(() => {
    throw new HttpError(400, { message: "Image non enregistré !" });
  });
  res.status(201).json({ message: "Image enregistré !" });
});

route.get("/", async (req, res) => {
  const articles = await Image.find()
    .sort({ createdAt: -1 })
    .limit(1)
    .catch(() => {
      throw new HttpError(401, {
        message: "Erreur dans la récuperation des images",
      });
    });
  res.status(200).json(articles);
});

module.exports = route;
