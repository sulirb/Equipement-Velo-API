const express = require("express");
const { HttpError } = require("../../middlewares/error.js");
const Article = require("../../models/Article.js");
const multer = require("../../middlewares/multer-config.js");
const optimizeImage = require("../../middlewares/multer-sharp.js");
const auth = require("../../middlewares/auth.js");

let route = express.Router({ mergeParams: true });

route.get("/all", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/perPage", async (req, res) => {
  const page = req.query.page || 1; // Récupérez le numéro de la page depuis la requête (par défaut à la page 1)
  const perPage = req.query.perPage || 20; // Récupérez le nombre d'articles par page depuis la requête (par défaut à 20)

  const skip = (page - 1) * perPage; // Calculez combien d'articles à sauter en fonction de la page
  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/latest", async (req, res) => {
  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .catch(() => {
      throw new HttpError(401, {
        message: "Erreur dans la récuperation des articles",
      });
    });
  res.status(200).json(articles);
});

route.post("/", auth, multer, optimizeImage, async (req, res) => {
  const articleObject = req.body;
  const article = new Article({
    ...articleObject,
    file: `https://${req.get("host")}/images/title/${req.file.filename}`,
  });
  await article.save().catch(() => {
    throw new HttpError(400, { message: "Livre non enregistré !" });
  });
  res.status(201).json({ message: "Livre enregistré !" });
});

module.exports = route;
