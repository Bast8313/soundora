// importation des fonctions de validation
const { body } = require("express-validator");

// === IMPORT DES MODULES ET MIDDLEWARES ===
const express = require("express"); // Importe Express
const router = express.Router(); // Crée un mini-routeur Express

// === IMPORT DES CONTRÔLEURS ===
const authController = require("../controllers/authController"); // Gère l'authentification (login/register)
const productController = require("../controllers/productController"); // Gère la logique produits
const categoryController = require("../controllers/categoryController"); // Gère la logique des catégories

// === IMPORT DU MIDDLEWARE JWT POUR PROTÉGER CERTAINES ROUTES ===
const checkJwt = require("../middleware/checkJwt"); // Vérifie la validité du token JWT

// === ROUTES D'AUTHENTIFICATION ===
router.post("/auth/register", authController.register); // Inscription d’un utilisateur
router.post("/auth/login", authController.login); // Connexion et obtention du token JWT

// === ROUTES POUR LES PRODUITS ===
router.get("/products", productController.getAllProducts); // Liste tous les produits
router.get("/products/:id", productController.getProductById); // Récupère un produit spécifique par ID
router.post("/products", checkJwt, productController.createProduct); // Création d’un produit (protégé)
router.put("/products/:id", checkJwt, productController.updateProduct); // Modification d’un produit (protégé)
router.delete("/products/:id", checkJwt, productController.deleteProduct); // Suppression d’un produit (protégé)

// === ROUTES POUR LES CATÉGORIES ===
router.get("/categories", categoryController.getAllCategories); // Liste toutes les catégories
router.get("/categories/:id", categoryController.getCategoryById); // Récupère une catégorie spécifique
router.post("/categories", checkJwt, categoryController.createCategory); // Création d’une catégorie (protégé)
router.put("/categories/:id", checkJwt, categoryController.updateCategory); // Mise à jour (protégé)
router.delete("/categories/:id", checkJwt, categoryController.deleteCategory); // Suppression (protégé)

// === EXPORT DU ROUTEUR POUR L’UTILISER DANS server.js ===
module.exports = router;
