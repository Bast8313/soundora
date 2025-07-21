/* require("dotenv").config(); // Charger les variables d'environnement depuis le fichier .env

const bcrypt = require("bcrypt");
// Import du module bcrypt pour hasher (chiffrer) les mots de passe

const jwt = require("jsonwebtoken");
// Import du module jsonwebtoken pour créer et vérifier les tokens JWT

const db = require("../config/db");
// Import de la connexion à la base de données MySQL configurée dans config/db.js

const secret = process.env.JWT_SECRET || "votre_clé_secrète";
// Clé secrète utilisée pour signer les tokens JWT
// On essaie d'abord de la récupérer depuis une variable d'environnement (plus sûr en production)
// Sinon on utilise une clé par défaut (à changer avant mise en prod)

// Fonction d'enregistrement d'un nouvel utilisateur
exports.register = (req, res) => {
  const { email, password } = req.body;
  // On récupère l'email et le mot de passe envoyés dans le corps de la requête HTTP

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
    // Si l'un des champs est manquant, on renvoie une erreur 400 (bad request)
  }

  // Vérification si l'email existe déjà dans la base
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    // En cas d'erreur SQL, on renvoie une erreur 500 (serveur)

    if (results.length > 0) {
      return res.status(400).json({ message: "Email déjà existant" });
      // Si l'email existe déjà, on refuse l'inscription avec une erreur 400
    }

    // Hachage du mot de passe avec bcrypt, 10 tours de salage (salt rounds)
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err });
      // En cas d'erreur lors du hashage, on renvoie une erreur 500

      // Insertion dans la table users avec l'email et le mot de passe haché
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          // Erreur SQL sur l'insertion -> erreur 500

          // Succès, on confirme la création de l'utilisateur
          res.status(201).json({ message: "Utilisateur créé avec succès" });
        }
      );
    });
  });
};

// Fonction de connexion d'un utilisateur
exports.login = (req, res) => {
  const { email, password } = req.body;
  // Récupération des champs email et password envoyés dans la requête

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
    // Vérification qu'ils soient bien fournis sinon erreur 400
  }

  // Recherche de l'utilisateur dans la base par email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    // Erreur serveur si problème base de données

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
      // Si aucun utilisateur trouvé avec cet email, on renvoie une erreur 401 (Unauthorized)
    }

    const user = results[0];
    // Récupération des données utilisateur depuis la base

    // Comparaison entre le mot de passe fourni et le hash stocké en base
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err });
      // Erreur serveur si problème dans la comparaison

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
        // Si les mots de passe ne correspondent pas, erreur 401
      }

      // Génération du token JWT signé avec la clé secrète
      // Payload contient l'id et email de l'utilisateur
      // Expiration du token fixée à 1 heure
      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: "1h",
      });

      // Envoi du token au client (front-end) pour qu'il l'utilise dans les prochaines requêtes
      res.json({ token });
    });
  });
};

*/
