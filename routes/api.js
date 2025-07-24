import express from "express"; // Importe Express pour créer le routeur
import * as authController from "../controllers/authController.js"; // Contrôleur d'authentification
import * as productController from "../controllers/productController.js"; // Contrôleur produits
import * as categoryController from "../controllers/categoryController.js"; // Contrôleur catégories
import * as cartController from "../controllers/cartController.js"; // Contrôleur panier
import * as orderController from "../controllers/orderController.js"; // Contrôleur commandes
import * as testController from "../controllers/testController.js"; // Contrôleur de test
import checkJwt from "../middleware/checkJwt.js"; // Middleware JWT pour protéger les routes
import jwt from "jsonwebtoken"; // Import de jsonwebtoken pour la gestion des tokens JWT

const router = express.Router(); // Crée un routeur Express

// === ROUTES DE TEST ===
router.get("/test/connection", testController.testConnection); // Test connexion Supabase
router.get("/test/tables", testController.listTables); // Liste des tables disponibles

// === ROUTES D'AUTHENTIFICATION ===
router.post("/auth/register", authController.register); // Inscription d’un utilisateur
router.post("/auth/login", authController.login); // Connexion et obtention du token JWT

// === ROUTES POUR LES PRODUITS ===
router.get("/products", productController.getAllProducts); // Liste tous les produits
router.get("/products/:id", productController.getProductById); // Récupère un produit spécifique par ID
router.post("/products", checkJwt, productController.addProduct); // Création d’un produit (protégé)
router.put("/products/:id", checkJwt, productController.updateProduct); // Modification d’un produit (protégé)
router.delete("/products/:id", checkJwt, productController.deleteProduct); // Suppression d’un produit (protégé)

// === ROUTES POUR LES CATÉGORIES ===
router.get("/categories", categoryController.getAllCategories); // Liste toutes les catégories
router.get("/categories/:id", categoryController.getCategoryById); // Récupère une catégorie spécifique
router.post("/categories", checkJwt, categoryController.createCategory); // Création d’une catégorie (protégé)
router.put("/categories/:id", checkJwt, categoryController.updateCategory); // Mise à jour (protégé)
router.delete("/categories/:id", checkJwt, categoryController.deleteCategory); // Suppression (protégé)

// === ROUTES POUR LE PANIER ===
router.get("/cart", checkJwt, cartController.getCart); // Récupère le panier de l'utilisateur (protégé)
router.post("/cart/items", checkJwt, cartController.addToCart); // Ajoute un article au panier (protégé)
router.put("/cart/items/:id", checkJwt, cartController.updateCartItem); // Met à jour un article du panier (protégé)
router.delete("/cart/items/:id", checkJwt, cartController.removeFromCart); // Supprime un article du panier (protégé)
router.get("/cart/count", checkJwt, cartController.getCartCount); // Récupère le nombre d'articles dans le panier (protégé)

// === ROUTES POUR LES COMMANDES ===
router.post("/orders", checkJwt, orderController.createOrder); // Création d'une commande (protégé)
router.get("/orders", checkJwt, orderController.getUserOrders); // Récupère les commandes de l'utilisateur (protégé)
router.get("/orders/:order_id", checkJwt, orderController.getOrderDetails); // Récupère une commande spécifique (protégé)

// route de connexion (login) pour les utilisateurs
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // à remplacer par la logique réelle pplus tard
  if (username === "admin" && password === "admin") {
    // Génération d'un token JWT
    const token = jwt.sign({ username }, "votre_clé_secrète_jwt", {
      expiresIn: "1h",
    });
    res.json({ token }); // Envoie le token au client
  } else {
    res.status(401).json({ message: "Identifiants invalides" }); // En cas d'échec
  }
});
// === EXPORT DU ROUTEUR POUR L’UTILISER DANS server.js ===
export default router;
