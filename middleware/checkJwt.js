const jwt = require("jsonwebtoken");
// On importe la librairie jsonwebtoken pour manipuler les tokens JWT.

const secret = "votre_clé_secrète";
// La clé secrète utilisée pour signer et vérifier les tokens JWT.
// À remplacer par une variable d'environnement (.env) en production.

module.exports = (req, res, next) => {
  // On exporte une fonction middleware qui intercepte les requêtes protégées.

  const authHeader = req.headers.authorization;
  // On récupère l'en-tête Authorization où le token doit se trouver.

  if (!authHeader) {
    // Si aucun header Authorization n'est présent,
    return res.status(401).json({ message: "Token manquant" });
    // On bloque la requête avec un code 401 Unauthorized.
  }

  const token = authHeader.split(" ")[1];
  // On récupère le token dans l'en-tête au format : "Bearer <token>"
  // On split sur l'espace pour extraire le token pur.

  jwt.verify(token, secret, (err, decoded) => {
    // On vérifie que le token est bien valide (signature correcte + pas expiré).

    if (err) {
      // Si la vérification échoue (ex : token expiré ou falsifié),
      return res.status(401).json({ message: "Token invalide" });
      // On bloque la requête avec un 401 Unauthorized.
    }

    req.user = decoded;
    // Si le token est valide, on ajoute les données décodées (payload) dans req.user.
    // Les routes suivantes pourront y accéder.

    next();
    // On passe au middleware ou contrôleur suivant.
  });
};
