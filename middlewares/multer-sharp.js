const sharp = require("sharp");
const { HttpError } = require("./error");

const optimizeImage = async (req, res, next) => {
  try {
    if (req.method === "PUT" && !req.file) {
      return next();
    }

    if (!req.file) {
      throw new HttpError("Aucun fichier image téléchargé");
    }

    const maxImageWidth = 1500;
    const maxImageHeight = 1200;

    const buffer = await sharp(req.file.buffer)
      .resize(maxImageWidth, maxImageHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();

    req.file.buffer = buffer;

    next();
  } catch (error) {
    console.error(error);
    throw new HttpError(400, {
      message: "Une erreur s'est produite lors de l'optimisation de l'image",
    });
  }
};

module.exports = optimizeImage;
