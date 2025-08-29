# Cahier des charges – Projet Soundora

## 1. Présentation du projet

Soundora est une plateforme e-commerce dédiée à la vente d’instruments de musique et d’accessoires. L’objectif est de proposer une expérience utilisateur moderne, sécurisée et responsive, intégrant un système de paiement en ligne, une gestion de comptes utilisateurs, et un backoffice simple.

## 2. Objectifs

- Permettre à tout utilisateur de consulter un catalogue d’instruments et d’accessoires.
- Offrir une navigation fluide, et un design responsive.
- Gérer l’inscription, la connexion et la sécurité des utilisateurs.
- Proposer un panier d’achat, la gestion des commandes et le paiement en ligne sécurisé (Stripe).
- Fournir un backoffice simple pour la gestion des produits, catégories et commandes.

## 3. Fonctionnalités attendues

### 3.1. Frontend (Angular)

- Affichage du catalogue produits (listing, détails, recherche, filtres par catégorie/marque)
- Panier d’achat (ajout, suppression, modification de quantité)
- Processus de commande (checkout, récapitulatif, validation)
- Paiement en ligne via Stripe (mode test et réel)
- Authentification (inscription, connexion, déconnexion, gestion du JWT)
  (- Gestion de l’état utilisateur (profil, historique de commandes))
- Navbar responsive avec menu burger sur mobile
- Mode sombre (dark mode)
- Affichage des notifications (succès, erreur)
- Pages d’administration accessibles uniquement aux admins

### 3.2. Backend (Node.js/Express)

- API RESTful pour :
  - Authentification (inscription, connexion, déconnexion, vérification du token)
  - Gestion des produits, catégories, marques
  - Gestion du panier et des commandes
  - Intégration Stripe (création de session, webhooks)
- Sécurisation des routes (middleware JWT)
- Connexion à la base de données Supabase (PostgreSQL)
- Gestion des erreurs et des statuts HTTP

### 3.3. Base de données (Supabase)

- Table utilisateurs (auth, profils)
- Table produits, catégories, marques
- Table commandes, paniers, lignes de commande

## 4. Contraintes techniques

- Frontend : Angular 19+, TypeScript, HTML, CSS (responsive, dark mode)
- Backend : Node.js, Express, Supabase JS SDK, Stripe SDK
- Base de données : Supabase (PostgreSQL)
- Déploiement : Plesk (Docker, Docker Compose si Plesk non fonctionnel)
- Hébergement : GitHub, possibilité de déploiement sur un VPS ou service cloud

## 5. Sécurité

- Authentification sécurisée (Supabase Auth, JWT)
- Chiffrement des mots de passe (géré par Supabase)
- Protection des routes sensibles (middleware)
- Validation des entrées côté serveur et client

## 6. Livrables

- Code source complet (frontend, backend)
- Scripts d’installation et de lancement (README, Docker)
- Jeu de données de test (SQL, JSON)
- Documentation utilisateur et technique
- Captures d’écran des principaux cas d’usage

## 7. Planning (exemple)

- Semaine 1-2 : Maquettage, structure du projet, base de données
- Semaine 3-4 : Développement backend (API, auth, Stripe)
- Semaine 5-6 : Développement frontend (UI, navigation, panier)
- Semaine 7 : Intégration, tests, débogage
- Semaine 8 : Documentation, livraison, soutenance

## 8. Critères de validation

- Toutes les fonctionnalités listées sont opérationnelles
- L’application est responsive et utilisable sur mobile
- Les paiements Stripe fonctionnent en test et en réel
- L’authentification et la sécurité sont effectives
- Le code est documenté et versionné sur GitHub
