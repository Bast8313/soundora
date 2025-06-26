const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Import de la configuration de la base de données

const secret = "votre_clé_secrète"; // À remplacer par une variable d'environnement en production

// Enregistremengt d'un nouvel utilisateur
exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
};

// Vérification si l'utilisateur existe déjà
db.query("SELECT * FROM users WHERE email = ?"),
  [email],
  (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "email déjà existant" });
    }
  }

  // Hashage du mot de passe
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err });

    // Insertion du nouvel utilisateur dans la base de données
    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",[email, hashedPassword],
      if (err) return res.status(500).json({ error: err });
      
      res.status(201).json({ message: "Utilisateur créé avec succès" });
  });
    
    // Connexiion d'un utilisateur 
    exports.login = (req, res) => {
        const{ email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }}

        // Vérification de l'existence de l'utilisateur
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
            if (err) return res.status(500).json({ error: err });

            if (results.length === 0) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const user = results[0];

            // Vérification & comparaison du mot de passe
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: err });

                if (!isMatch) {
                    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
                }
            
                // Création du token JWT
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    secret,
                    { expiresIn: "1h" } // Le token expire dans 1 heure
                );

                res.json({ token }); // Envoi du token au client
            }
        });
    

