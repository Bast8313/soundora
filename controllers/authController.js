import dotenv from "dotenv"; // Pour charger les variables d'environnement
import bcrypt from "bcrypt"; // Pour hasher les mots de passe
import jwt from "jsonwebtoken"; // Pour créer et vérifier les tokens JWT
import db from "../config/db.js"; // Import du pool MySQL

dotenv.config(); // Charge les variables d'environnement depuis .env

const secret = process.env.JWT_SECRET || "votre_clé_secrète";

// Fonction d'enregistrement d'un nouvel utilisateur
export const register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  // Vérification si l'email existe déjà
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email déjà existant" });
    }

    // Hachage du mot de passe
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err });

      // Insertion dans la table users
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

// Fonction de connexion d'un utilisateur
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  // Recherche de l'utilisateur dans la base
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const user = results[0];

    // Comparaison du mot de passe fourni avec le hash stocké
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

      // Envoi du token au client
      res.json({ token });
    });
  });
};
