import jwt from "jsonwebtoken"; // Importe la librairie jsonwebtoken pour manipuler les tokens JWT

const secret = process.env.JWT_SECRET; // Clé secrète pour signer et vérifier les tokens JWT

/**
 * Middleware Express pour vérifier le token JWT dans l'en-tête Authorization.
 * Si le token est valide, ajoute le payload décodé dans req.user et passe au middleware suivant.
 * Sinon, renvoie une erreur 401 Unauthorized.
 */
const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization; // Récupère l'en-tête Authorization

  if (!authHeader) {
    // Si aucun header Authorization n'est présent, bloque la requête
    return res.status(401).json({ message: "Token manquant" });
  }

  // Récupère le token au format "Bearer <token>"
  const token = authHeader.split(" ")[1];

  // Vérifie la validité du token (signature + expiration)
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // Si la vérification échoue (ex : token expiré ou falsifié), bloque la requête
      return res.status(401).json({ message: "Token invalide" });
    }

    req.user = decoded; // Ajoute le payload décodé dans req.user pour les routes suivantes
    next(); // Passe au middleware ou contrôleur suivant
  });
};

export default checkJwt; // Export du middleware pour utilisation dans les routes
