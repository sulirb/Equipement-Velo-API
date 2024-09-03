const sharp = require("sharp");
const { HttpError } = require("./error");

const optimizeImage = async (req, res, next) => {
  try {
    if (req.method === "PUT" && !req.file) {
      return next();
    }

    if (!req.file) {
      throw new HttpError(400, "Aucun fichier image téléchargé");
    }

    const maxImageWidth = 1500;
    const maxImageHeight = 1200;

    // Utiliser le buffer au lieu du chemin du fichier
    const buffer = await sharp(req.file.buffer)
      .resize(maxImageWidth, maxImageHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();

    // Remplacer le buffer original par le buffer optimisé
    req.file.buffer = buffer;

    next();
  } catch (error) {
    console.error(error);
    next(
      new HttpError(
        400,
        "Une erreur s'est produite lors de l'optimisation de l'image"
      )
    );
  }
};

module.exports = optimizeImage;
