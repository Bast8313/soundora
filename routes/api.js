const express = require("express");
const router = express.Router(); // mini-routeur pour regrouper les routes liées aux produits

const productController = require("../controllers/productController"); // contrôleur qui contiendra la logique métier (productController)

const authController = require("../controllers/authController"); // contrôleur pour l'authentification (si besoin)

const checkJwt = require("../middleware/checkJwt"); // middleware JWT qui protège certaines routes

// === ROUTES AUTHENTIFICATION ===

router.post("/", authController.login); // route pour se connecter (login) et obtenir un token JWT
router.post("/", authController.register); // route pour s'inscrire (register) et créer un compte utilisateur

// === ROUTES PRODUITS ===

router.get("/", productController.getAllProducts); // retourne tout les produits
router.get("/:id", productController.getProductById); // retourne un produit par son ID
// Routes protégées (token JWT obligatoire)
router.post("/", checkJwt, productController.createProduct); // crée un nouveau produit (necessite un token)
router.put("/:id", checkJwt, productController.updateProduct); // modifie un produit existant
router.delete("/:id", checkJwt, productController.deleteProduct); // supprime un produit existant
// Le middleware checkJwt vérifie le token avant de laisser passer.

module.exports = router; // exporte le routeur pour l'utiliser dans le serveur principal
