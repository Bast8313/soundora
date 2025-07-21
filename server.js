// Importe le module Express pour créer une application serveur web
import express from "express";

// Initialise une application Express
import dotenv from "dotenv"; // Importe dotenv pour charger les variables d'environnement depuis un fichier .env

import cors from "cors"; // Importe CORS pour gérer les requêtes cross-origin

// Importe dotenv pour charger les variables d'environnement depuis un fichier .env
import apiRoutes from "./routes/api.js"; // Importe les routes API
dotenv.config(); // Charge les variables d’environnement (.env) dans process.env

const app = express(); // Crée l initialisation d'express

// Middleware Express pour parser automatiquement les requêtes JSON entrantes
app.use(express.json());
app.use(cors()); // Utilise CORS pour permettre les requêtes cross-origin

// === ROUTES ===

app.get("/test", (req, res) => {
  res.send("Bienvenue sur l'API de Mini Shop !");
});

// Utilise ces routes avec un préfixe "/api" → toutes les routes seront accessibles via /api/*
app.use("/api", apiRoutes);

// === LANCEMENT DU SERVEUR ===

// Détermine le port : d'abord celui défini dans .env, sinon 3000 par défaut
const PORT = process.env.PORT || 3010;

// Démarre le serveur sur le port défini
app.listen(PORT, "localhost", () => {
  console.log(`Serveur démarré sur le port ` + PORT); // Affiche un message dans la console pour indiquer que le serveur est en marche
});
