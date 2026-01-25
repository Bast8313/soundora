# 🎵 Guide de Démarrage Rapide - Soundora

**Date de création :** 24 janvier 2026  
**Pour :** Découverte et prise en main du projet

---

## 📌 QU'EST-CE QUE SOUNDORA ?

**Soundora** est une **plateforme e-commerce full-stack** dédiée à la vente d'**instruments de musique et accessoires**. 

Projet de fin d'année 2025 par **Bastien BRUNET** (Bast8313).

---

## 🏗️ ARCHITECTURE TECHNIQUE

### **Stack Technologique**
- **Frontend** : Angular 17 (TypeScript, HTML, CSS)
- **Backend** : Node.js + Express
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth + JWT
- **Paiement** : Stripe API
- **Déploiement** : Docker + Docker Compose

### **Structure du Projet**
```
soundora/
├── soundora-frontend/          → Application Angular (port 4200)
├── soundora-backend/           → API Node.js/Express (port 3010)
└── documentation/              → Docs, diagrammes, guides
    ├── diagrammes/            → Architecture visuelle
    ├── docs/                  → Documentation API et utilisateur
    ├── dataWorkbench/         → Scripts SQL
    └── explications/          → Guides techniques détaillés
```

---

## 🚀 PAR OÙ COMMENCER ? (Parcours d'apprentissage)

### **ÉTAPE 1 : Comprendre le projet (30 min)**

**Fichiers à lire dans cet ordre :**

1. **`README.md`** - Vue d'ensemble et installation
2. **`documentation/diagrammes/diagramme-architecture-soundora.md`** - Architecture complète avec schémas
3. **`documentation/docs/documentation_api.md`** - Liste des routes API disponibles

### **ÉTAPE 2 : Explorer le Backend (1h)**

**📂 Point d'entrée principal :**
- **`soundora-backend/server.js`** - Serveur Express, middleware, configuration

**📂 Routes et logique métier :**
- **`soundora-backend/routes/api.js`** - Toutes les routes API définies ici
- **`soundora-backend/controllers/`** - Logique métier par fonctionnalité :
  - `authController.js` → Inscription, connexion, JWT
  - `productSupabaseController.js` → CRUD des produits
  - `cartController.js` → Gestion du panier
  - `orderController.js` → Gestion des commandes
  - `stripeController.js` → Intégration paiement Stripe
  - `categoryController.js` → Catégories et filtres
  - `brandController.js` → Marques

**📂 Configuration :**
- **`soundora-backend/config/supabase.js`** - Connexion à Supabase
- **`soundora-backend/config/db.js`** - Configuration base de données
- **`soundora-backend/config/email.js`** - Configuration emails (Nodemailer)

**📂 Middlewares :**
- **`soundora-backend/middleware/checkJwt.js`** - Vérification des tokens JWT
- **`soundora-backend/middleware/checkSupabaseAuth.js`** - Authentification Supabase

### **ÉTAPE 3 : Explorer le Frontend Angular (1-2h)**

**📂 Point d'entrée :**
- **`soundora-frontend/src/main.ts`** - Bootstrap de l'application Angular
- **`soundora-frontend/src/app/app.component.ts`** - Composant racine
- **`soundora-frontend/src/app/app.routes.ts`** - Configuration du routing

**📂 Composants principaux :**
- **`src/app/components/navbar/`** - Navigation principale
- **`src/app/components/top-navbar/`** - Navbar supérieure (compte, panier)
- **`src/app/components/product-list/`** - Affichage du catalogue de produits
- **`src/app/components/categories/`** - Système de filtres par catégories
- **`src/app/components/banner-images/`** - Images promotionnelles

**📂 Services Angular :**
- Chercher les fichiers `*.service.ts` dans `src/app/`
  - Auth Service → Authentification
  - Product Service → Gestion des produits
  - Cart Service → Panier

**📂 Documentation spécifique frontend :**
- **`documentation/RESUME-NavbarComponent.md`** - Détails de la navbar
- **`documentation/RESUME-ProductListComponent.md`** - Détails du catalogue
- **`documentation/GUIDE-double-navbar.md`** - Système de double navigation

### **ÉTAPE 4 : Base de Données (30 min)**

**📂 Scripts SQL Supabase :**
- **`documentation/dataWorkbench/supabase_init.sql`** - Initialisation complète de la BDD
- **`documentation/dataWorkbench/complete_products.sql`** - Données produits
- **`documentation/docs/MCD SQL.sql`** - Modèle conceptuel de données

**Tables principales :**
- `products` - Catalogue de produits
- `categories` - Catégories d'instruments
- `brands` - Marques
- `cart` - Paniers des utilisateurs
- `orders` - Commandes
- `auth.users` - Utilisateurs (gérée par Supabase Auth)

---

## 📋 FONCTIONNALITÉS IMPLÉMENTÉES

✅ **Catalogue de produits** avec filtres (catégories, marques, recherche)  
✅ **Authentification utilisateur** (Supabase Auth + JWT)  
✅ **Gestion du panier** (ajout, modification, suppression)  
✅ **Paiement Stripe** (mode test et production)  
✅ **Interface responsive** (desktop + mobile)  
✅ **Menu burger mobile**  
✅ **Dark mode**  
✅ **Double navbar** (top-navbar + navbar principale)  
✅ **Système de commandes** avec historique  

---

## 🔑 CONCEPTS CLÉS À MAÎTRISER

### **Frontend Angular**
- **Composants standalone** : Nouvelle approche Angular (sans modules)
- **Services** : Injection de dépendances pour logique réutilisable
- **Routing** : Navigation entre les pages
- **RxJS** : Gestion asynchrone (Observables)
- **HttpClient** : Communication avec le backend

### **Backend Node.js**
- **Architecture MVC** : Routes → Controllers → Supabase
- **Middlewares Express** : Authentification, validation
- **API REST** : Toutes les routes préfixées par `/api/`
- **Supabase Client** : Accès à la base de données PostgreSQL
- **JWT** : Tokens d'authentification

### **Supabase**
- **PostgreSQL** : Base de données relationnelle
- **Auth** : Système d'authentification intégré
- **RLS (Row Level Security)** : Sécurité au niveau des lignes
- **API auto-générée** : Endpoints REST automatiques

---

## 🎯 ORDRE D'APPRENTISSAGE RECOMMANDÉ

```
1. Lire README.md (contexte général)
   └─ Comprendre l'objectif du projet

2. Voir diagramme d'architecture (vue d'ensemble technique)
   └─ documentation/diagrammes/diagramme-architecture-soundora.md

3. Lancer l'application localement (backend + frontend)
   └─ Installer dépendances et démarrer les serveurs

4. Tester les routes API (Postman / Thunder Client / Bruno)
   └─ documentation/docs/documentation_api.md

5. Explorer un flux complet utilisateur :
   └─ Inscription → Connexion → Parcourir produits → Ajouter au panier → Payer

6. Lire le code dans cet ordre :
   Backend:
   └─ server.js → routes/api.js → controllers (un par un)
   
   Frontend:
   └─ main.ts → app.component.ts → navbar → product-list

7. Comprendre la base de données :
   └─ Lire supabase_init.sql et tester des requêtes

8. Approfondir les parties complexes :
   └─ Authentification JWT
   └─ Intégration Stripe
   └─ Gestion du panier côté frontend
```

---

## 🛠️ COMMANDES UTILES

### **Installation et Démarrage**

```bash
# Cloner le projet
git clone https://github.com/Bast8313/soundora.git
cd soundora

# Backend (port 3010)
cd soundora-backend
npm install
node server.js

# Frontend (port 4200)
cd soundora-frontend
npm install
ng serve
```

### **Accès à l'Application**
- Frontend : http://localhost:4200
- Backend : http://localhost:3010
- API : http://localhost:3010/api

---

## 📖 DOCUMENTATION COMPLÉMENTAIRE

### **Explications techniques détaillées :**
- **`documentation/explications/EXPLICATIONS-NavbarComponent.js`** - Fonctionnement de la navbar
- **`documentation/explications/EXPLICATIONS-ProductListComponent.js`** - Fonctionnement du catalogue
- **`documentation/explications/EXPLICATIONS-angular.json.js`** - Configuration Angular
- **`documentation/explications/EXPLICATIONS-package.json.js`** - Dépendances

### **Guides spécifiques :**
- **`documentation/GUIDE-COMPLET.js`** - Guide général du projet
- **`documentation/GUIDE-double-navbar.md`** - Système de double navigation
- **`documentation/EXPLICATIONS-systeme-categories.md`** - Système de catégories

### **Dossier projet (documentation métier) :**
- **`Dossier projet/api-test-results.md`** - Résultats des tests API
- **`Dossier projet/categories-structure.md`** - Structure des catégories

---

## 🐛 FICHIERS DE DÉBUG / NOTES

- **`documentation/problemeSupabase.txt`** - Problèmes rencontrés avec Supabase
- **`Dossier projet/dropdown-css-fix.md`** - Fix du menu déroulant
- **`Dossier projet/css-layout-optimization.md`** - Optimisations CSS

---

## 🎨 RESSOURCES

### **Images du projet :**
- **`soundora Images dossier projet !!/`** - Captures d'écran de toutes les fonctionnalités
  - `accueil/` - Page d'accueil
  - `connexion/` - Authentification
  - `details produits/` - Fiche produit
  - `panier-filtres/` - Panier et filtres
  - `stripe/` - Intégration paiement

---

## ✅ CHECKLIST DE PRISE EN MAIN

- [ ] Lire le README.md
- [ ] Consulter le diagramme d'architecture
- [ ] Installer les dépendances (backend + frontend)
- [ ] Lancer l'application en local
- [ ] Tester l'inscription et la connexion
- [ ] Explorer le catalogue de produits
- [ ] Tester l'ajout au panier
- [ ] Comprendre le fonctionnement des controllers backend
- [ ] Explorer les composants Angular du frontend
- [ ] Consulter la base de données Supabase
- [ ] Tester les routes API avec Postman
- [ ] Comprendre le flow d'authentification JWT
- [ ] Explorer l'intégration Stripe

---

## 🎯 PROCHAINES ÉTAPES POSSIBLES

### **Fonctionnalités à développer :**
- [ ] Page de profil utilisateur complète
- [ ] Historique des commandes détaillé
- [ ] Système de favoris/wishlist
- [ ] Filtres avancés (prix, note, disponibilité)
- [ ] Système d'avis clients
- [ ] Back-office admin complet
- [ ] Système de recherche amélioré
- [ ] Notifications (email, push)

### **Optimisations techniques :**
- [ ] Tests unitaires (Jest, Jasmine)
- [ ] Tests E2E (Cypress, Playwright)
- [ ] Optimisation des performances
- [ ] SEO (Server-Side Rendering avec Angular Universal)
- [ ] PWA (Progressive Web App)
- [ ] CI/CD (GitHub Actions)

---

## 📞 CONTACT

**Auteur :** Bastien BRUNET (Bast8313)  
**GitHub :** https://github.com/Bast8313/soundora  
**Projet :** Fin d'année 2025

---

## 🎓 NOTES PERSONNELLES

_Espace réservé pour tes notes lors de l'apprentissage du projet :_

```
[Tes notes ici...]




```

---

**Dernière mise à jour :** 24 janvier 2026  
**Version du guide :** 1.0
