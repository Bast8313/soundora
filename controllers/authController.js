require("dotenv").config(); // Charger les variables d'environnement depuis le fichier .env
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Connexion BDD

const secret = process.env.JWT_SECRET || "votre_clé_secrète"; // En prod : via .env

// 👉 Enregistrement d'un nouvel utilisateur
exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  // Vérifier si l'utilisateur existe déjà
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email déjà existant" });
    }

    // Hashage du mot de passe
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err });

      // Insertion dans la BDD
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });

          res.status(201).json({ message: "Utilisateur créé avec succès" });
        }
      );
    });
  });
};

// Connexion d'un utilisateur
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  // Vérification de l'utilisateur
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const user = results[0];

    // Vérification du mot de passe
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err });

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Génération du token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: "1h",
      });

      res.json({ token });
    });
  });
};
