# Documentation de l’API Soundora

Base URL : `https://bastien-brunet.students-laplateforme.io/api/`

## Authentification
- `POST /api/auth/login` : Connexion utilisateur (email, mot de passe)
- `POST /api/auth/register` : Création de compte
- `POST /api/auth/logout` : Déconnexion

## Utilisateurs
- `GET /api/users/me` : Infos du compte connecté
- `PUT /api/users/me` : Modifier ses infos

## Produits
- `GET /api/products` : Liste des produits
- `GET /api/products/:id` : Détail d’un produit
- `POST /api/products` : Ajouter un produit (admin)
- `PUT /api/products/:id` : Modifier un produit (admin)
- `DELETE /api/products/:id` : Supprimer un produit (admin)

## Catégories
- `GET /api/categories` : Liste des catégories
- `GET /api/categories/:id` : Détail d’une catégorie

## Panier
- `GET /api/cart` : Voir le panier
- `POST /api/cart` : Ajouter/modifier un article
- `DELETE /api/cart/:id` : Supprimer un article du panier

## Commandes
- `GET /api/orders` : Liste des commandes de l’utilisateur
- `POST /api/orders` : Passer une commande
- `GET /api/orders/:id` : Détail d’une commande

## Paiement
- `POST /api/checkout` : Créer une session de paiement Stripe
- `POST /api/webhook` : Webhook Stripe (réservé au serveur)

---

Toutes les routes nécessitant une authentification doivent inclure un token JWT dans l’en-tête `Authorization`.
Pour plus de détails sur les paramètres et réponses, voir le code source ou contacter l’équipe technique.
