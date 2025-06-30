// Importe le module Express pour créer une application serveur web
const express = require("express");

// Initialise une application Express
const app = express();

// Importe dotenv pour charger les variables d'environnement depuis un fichier .env
const dotenv = require("dotenv");
dotenv.config(); // Charge les variables d’environnement (.env) dans process.env

// Middleware Express pour parser automatiquement les requêtes JSON entrantes
app.use(express.json());

// === ROUTES ===

// Importe le fichier de routes unifiées (authentification, produits, catégories, etc.)
const apiRoutes = require("./routes/api.js");

// Utilise ces routes avec un préfixe "/api" → toutes les routes seront accessibles via /api/*
app.use("/api", apiRoutes);

// === LANCEMENT DU SERVEUR ===

// Détermine le port : d'abord celui défini dans .env, sinon 3000 par défaut
const PORT = process.env.PORT || 3000;

// Démarre le serveur sur le port défini
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`); // Affiche un message dans la console pour indiquer que le serveur est en marche
});
