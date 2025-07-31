// ===================================
// SERVEUR SOUNDORA - BACKEND API
// ===================================
// Serveur Express avec intégration Stripe pour les paiements

// Importe le module Express pour créer une application serveur web
import express from "express";
import dotenv from "dotenv"; // Variables d'environnement
import cors from "cors"; // CORS pour les requêtes cross-origin
import apiRoutes from "./routes/api.js"; // Routes API

// Charge les variables d'environnement (.env)
dotenv.config();

// Initialise l'application Express
const app = express();

// ===================================
// MIDDLEWARE SPÉCIAL STRIPE WEBHOOK
// IMPORTANT : Le webhook Stripe DOIT recevoir le raw body
// On traite cette route AVANT les autres middlewares JSON
// ===================================
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

// ===================================
// MIDDLEWARES GÉNÉRAUX
// ===================================
app.use(express.json()); // Parser JSON pour les requêtes normales
app.use(cors()); // Autorise les requêtes cross-origin

// ===================================
// ROUTES
// ===================================
app.get("/test", (req, res) => {
  res.send(" Bienvenue sur l'API de Soundora ! ");
});

// Utilise les routes API avec le préfixe "/api"
app.use("/api", apiRoutes);

// ===================================
// LANCEMENT DU SERVEUR
// ===================================
const PORT = process.env.PORT || 3010;

app.listen(PORT, "localhost", () => {
  console.log(` Serveur Soundora démarré sur le port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});
