const { HttpError } = require("../../../middlewares/error");
const Article = require("../../../models/Article");
const express = require("express");
const auth = require("../../../middlewares/auth.js");
const fs = require("fs");

let route = express.Router({ mergeParams: true });

route.get("/", async (req, res) => {
  try {
    const article = await Article.aggregate([
      {
        $match: {
          slug: req.params.id,
        },
      },
      {
        $project: {
          title: 1,
          file: 1,
          content: 1,
          createdAt: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdAt",
            },
          },
          slug: 1,
          tag: 1,
          __v: 1,
        },
      },
    ]);

    if (!article || article.length === 0) {
      throw new HttpError(404, {
        message: "Article non trouvé",
      });
    }

    res.status(200).json(article[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'article" });
  }
});

route.delete("/", auth, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.id });

  const filename = article.file.split("/images/title/")[1];
  fs.unlinkSync(`images/title/${filename}`);
  await Article.deleteOne({ slug: req.params.id }).catch(() => {
    throw new HttpError(400, { message: "La suppression a échoué" });
  });
  res.status(200).json({ message: "Article supprimé" });
});

/*route.put("/", auth, multer, optimizeImage, async (req, res) => {
  const bookObject = bookObjectById(req);
  bookObject.userId = req.auth.userId;
  const book = await Book.findOne({ _id: req.params.id });
  if (book.userId !== req.auth.userId)
    throw new HttpError(401, { message: "Non Autorisé" });

  await Book.updateOne(
    { _id: req.params.id },
    { ...bookObject, _id: req.params.id }
  ).catch(() => {
    throw new HttpError(400, { message: "La modification a échoué" });
  });
  res.status(200).json({ message: "Modification réussie" });
});*/

module.exports = route;
