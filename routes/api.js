import express from "express"; // Importe Express pour créer le routeur
import * as authController from "../controllers/authController.js"; // Contrôleur d'authentification
import * as productSupabaseController from "../controllers/productSupabaseController.js"; //  NOUVEAU : Contrôleur produits Supabase (remplace productController)
import * as categoryController from "../controllers/categoryController.js"; // Contrôleur catégories
import * as cartController from "../controllers/cartController.js"; // Contrôleur panier
import * as orderController from "../controllers/orderController.js"; // Contrôleur commandes
import * as testController from "../controllers/testController.js"; // Contrôleur de test
import checkJwt from "../middleware/checkJwt.js"; // Middleware JWT pour protéger les routes

const router = express.Router(); // Crée un routeur Express

// ===================================
// ROUTES DE TEST
// Permettent de vérifier le bon fonctionnement de Supabase
// ===================================
router.get("/test/connection", testController.testConnection); // Test connexion Supabase
router.get("/test/tables", testController.listTables); // Liste des tables disponibles

// ===================================
// ROUTES D'AUTHENTIFICATION
// Gestion des utilisateurs avec Supabase Auth
// ===================================
router.post("/auth/register", authController.register); // Inscription d'un utilisateur
router.post("/auth/login", authController.login); // Connexion et obtention du token JWT
router.post("/auth/logout", authController.logout); // Déconnexion utilisateur
router.get("/auth/me", authController.getCurrentUser); // Récupération de l'utilisateur actuel

// ===================================
// ROUTES POUR LES PRODUITS - Version Supabase Avancée
// Remplace l'ancien productController par productSupabaseController
// Nouvelles fonctionnalités : pagination, filtres, recherche, slugs SEO
// ===================================

//  ROUTE PRINCIPALE : Liste des produits avec filtres et pagination
// Exemples d'utilisation :
// GET /api/products                                    → Tous les produits (page 1, 10 par page)
// GET /api/products?page=2&limit=20                    → Page 2, 20 produits par page
// GET /api/products?category=guitares                  → Seulement les guitares
// GET /api/products?brand=fender&min_price=500         → Marque Fender, prix min 500€
// GET /api/products?search=stratocaster                → Recherche "stratocaster"
router.get("/products", productSupabaseController.getAllProducts);

// ROUTE PRODUITS FEATURED : Produits mis en avant
// GET /api/products/featured?limit=6                   → 6 produits featured (défaut)
// GET /api/products/featured?limit=12                  → 12 produits featured
router.get("/products/featured", productSupabaseController.getFeaturedProducts);

// ROUTE RECHERCHE : Recherche textuelle rapide
// GET /api/products/search?q=guitare&limit=10          → Recherche "guitare", max 10 résultats
// GET /api/products/search?q=gibson                    → Recherche "gibson"
router.get("/products/search", productSupabaseController.searchProducts);

//  ROUTE PRODUIT INDIVIDUEL : Récupération par slug (SEO-friendly)
// GET /api/products/gibson-les-paul-standard-2024      → Produit via slug
// GET /api/products/fender-stratocaster-american       → Autre exemple
// IMPORTANT : Cette route doit être EN DERNIER pour éviter les conflits avec "featured" et "search"
router.get("/products/:slug", productSupabaseController.getProductBySlug);

// ===================================
// ROUTES POUR LES CATÉGORIES
// Gestion des catégories de produits (guitares, basses, etc.)
// ===================================
router.get("/categories", categoryController.getAllCategories); // Liste toutes les catégories
router.get("/categories/:id", categoryController.getCategoryById); // Récupère une catégorie spécifique
router.post("/categories", checkJwt, categoryController.createCategory); // Création d'une catégorie (protégé)
router.put("/categories/:id", checkJwt, categoryController.updateCategory); // Mise à jour (protégé)
router.delete("/categories/:id", checkJwt, categoryController.deleteCategory); // Suppression (protégé)

// ===================================
// ROUTES POUR LE PANIER
// Gestion du panier d'achat de l'utilisateur connecté
// ===================================
router.get("/cart", checkJwt, cartController.getCart); // Récupère le panier de l'utilisateur (protégé)
router.post("/cart/items", checkJwt, cartController.addToCart); // Ajoute un article au panier (protégé)
router.put("/cart/items/:id", checkJwt, cartController.updateCartItem); // Met à jour un article du panier (protégé)
router.delete("/cart/items/:id", checkJwt, cartController.removeFromCart); // Supprime un article du panier (protégé)
router.get("/cart/count", checkJwt, cartController.getCartCount); // Récupère le nombre d'articles dans le panier (protégé)

// ===================================
//  ROUTES POUR LES COMMANDES
// Gestion des commandes et historique d'achat
// ===================================
router.post("/orders", checkJwt, orderController.createOrder); // Création d'une commande (protégé)
router.get("/orders", checkJwt, orderController.getUserOrders); // Récupère les commandes de l'utilisateur (protégé)
router.get("/orders/:order_id", checkJwt, orderController.getOrderDetails); // Récupère une commande spécifique (protégé)

// === EXPORT DU ROUTEUR POUR L'UTILISER DANS server.js ===
export default router;
