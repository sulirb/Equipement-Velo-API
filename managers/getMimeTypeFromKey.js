// Fonction pour obtenir le type MIME à partir de la clé du fichier
function getMimeTypeFromKey(key) {
  const extension = key.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    // Ajoutez d'autres types MIME au besoin
    default:
      return null; // Retourne null si le type MIME n'est pas défini pour cette extension
  }
}
exports.getMimeTypeFromKey = getMimeTypeFromKey;
