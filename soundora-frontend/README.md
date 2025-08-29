
# SoundoraFrontend

Front-end Angular du projet **Soundora**, une boutique en ligne spécialisée dans la vente d’instruments de musique et d’accessoires. Ce projet s’inscrit dans le cadre d’un projet de fin d’année et met en œuvre une architecture moderne : Angular 19, API Node.js/Express, base de données Supabase (PostgreSQL), intégration Stripe, et authentification sécurisée.

## Présentation

SoundoraFrontend propose une interface utilisateur responsive, moderne et accessible :
- Navigation par catégories et marques
- Recherche et filtrage de produits
- Gestion du panier et du tunnel de commande
- Authentification sécurisée (JWT, Supabase)
- Paiement en ligne via Stripe
- Espace utilisateur (commandes, profil)

## Prérequis

- Node.js >= 18.x
- npm >= 9.x
- Accès à l’API back-end Soundora (voir README du back)

## Installation

```bash
git clone https://github.com/Bast8313/soundora.git
cd soundora/soundora-frontend
npm install
```

## Lancement en développement

```bash
npm start
```
Ouvre ensuite [http://localhost:4200](http://localhost:4200) dans ton navigateur.

## Scripts utiles

- `npm start` : lance le serveur de développement
- `ng build` : build de production dans `dist/`
- `ng test` : lance les tests unitaires

## Dépendances principales

- Angular 19
- RxJS
- Stripe (paiement sécurisé)
- Supabase (authentification, base de données)
- Bootstrap (UI responsive)

## Structure du projet

- `src/app/components/` : composants Angular (navbar, produits, panier, etc.)
- `src/app/services/` : services (API, auth, panier…)
- `src/environments/` : variables d’environnement

## Documentation

- [Cahier des charges](../docs/cahier-des-charges.md)
- [README back-end](../README.md)

## Auteur

Bastien (Bast8313)

---
*Projet réalisé dans le cadre du projet de fin d’année 2025 – IUT* 
