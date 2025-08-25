Soundora

Soundora est une application e-commerce dédiée à la vente d’instruments de musique, développée dans le cadre d’un projet de fin d’année. Elle propose une expérience utilisateur moderne, un design responsive, et intègre un système de paiement sécurisé avec Stripe.

Fonctionnalités principales :

- Catalogue de produits (guitares, accessoires, etc.)
- Recherche, filtres par catégories et marques
- Panier d’achat et gestion des commandes
- Authentification (inscription, connexion, JWT)
- Paiement en ligne sécurisé via Stripe
- Interface responsive (mobile & desktop)
- Menu burger mobile, dark mode


Stack technique :

- Frontend : Angular 19 (TypeScript, HTML, CSS)
- Backend : Node.js (Express)
- Base de données : Supabase (PostgreSQL)
- Paiement : Stripe API
- Authentification : Supabase Auth + JWT
- Déploiement : Docker, Docker Compose

Structure du projet :

soundora-back/
  server.js
  controllers/
  routes/
  config/
  ...
  soundora-frontend/
    src/
      app/
      assets/
      environments/
    ...
docker-compose.yml

Installation & lancement

1. Cloner le dépôt :
git clone https://github.com/Bast8313/soundora.git
cd soundora

2. Installer les dépendances :
cd soundora-back
npm install
cd soundora-frontend
npm install

3. Lancer les serveurs (backend & frontend) :
# Backend
cd soundora-back
node server.js
# Frontend
cd soundora-frontend
ng serve --port 4200

4. Accéder à l’application :

- Frontend : http://localhost:4200
- Backend : http://localhost:3010
  

Paiement Stripe (en cours de mise en prod.) :

- Utilise l’API Stripe pour les paiements réels et en test.
- Webhooks configurés pour la gestion des commandes.

  
Auteur :
- Bastien BRUNET (Bast8313)
- Projet de fin d’année 2025
