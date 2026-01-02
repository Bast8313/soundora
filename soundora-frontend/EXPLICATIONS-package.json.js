/**
 * =====================================
 * EXPLICATIONS DÉTAILLÉES - package.json
 * =====================================
 * 
 * FICHIER : soundora-frontend/package.json
 * RÔLE : Configuration du projet Node.js et gestionnaire de dépendances
 * 
 * =====================================
 * STRUCTURE DU FICHIER
 * =====================================
 * 
 * 1. MÉTADONNÉES DU PROJET
 *    - name: "soundora-frontend"
 *      Identifiant unique du projet
 *      Format : minuscules avec tirets (jamais d'espaces)
 *      Utilisé pour npm publish et npm install
 * 
 *    - version: "1.0.0"
 *      Numéro de version suivant Semantic Versioning (SemVer)
 *      Format : MAJEUR.MINEUR.PATCH
 *      Ex : 1.2.3
 *      - 1 (MAJEUR) : Changements non compatibles
 *      - 2 (MINEUR) : Nouvelles fonctionnalités compatibles
 *      - 3 (PATCH) : Corrections de bugs
 * 
 *    - description: "..."
 *      Description courte du projet
 *      Affichée sur npm.js
 * 
 * =====================================
 * 2. SCRIPTS NPM
 * =====================================
 * 
 * Les scripts définis dans "scripts" peuvent être exécutés via :
 *   npm run <nom-du-script>
 * 
 * Certains scripts ont des raccourcis :
 *   npm start   ← racourci pour "npm run start"
 *   npm test    ← raccourci pour "npm run test"
 * 
 * SCRIPTS DISPONIBLES :
 * 
 * a) "ng": "ng"
 *    Permet d'utiliser Angular CLI directement
 *    Utilisation : npm run ng -- <commande>
 *    Exemple : npm run ng -- generate component products
 * 
 * b) "start": "ng serve"
 *    Lance le serveur de développement
 *    Exécution : npm start
 *    Résultat :
 *    - Démarre un serveur local sur http://localhost:4200
 *    - Recompile automatiquement lors des modifications
 *    - Hot reload : rafraîchit le navigateur automatiquement
 *    - Affiche les erreurs de compilation en temps réel
 *    - Reste actif jusqu'à Ctrl+C
 * 
 * c) "build": "ng build"
 *    Compile l'application pour la production
 *    Exécution : npm run build
 *    Résultat :
 *    - Crée le dossier dist/soundora-frontend/
 *    - Minification du code (réduit la taille)
 *    - Minification des CSS
 *    - Minification du HTML
 *    - Optimisations de performance
 *    - Tree-shaking : supprime le code inutilisé
 *    Prêt à être déployé sur un serveur web
 * 
 * d) "test": "ng test"
 *    Lance les tests unitaires du projet
 *    Exécution : npm run test
 *    Framework : Jasmine (tests) + Karma (runner)
 *    Teste tous les fichiers *.spec.ts
 *    Résultat :
 *    - Lance un navigateur automatiquement
 *    - Exécute tous les tests
 *    - Affiche les résultats et couverture de code
 *    - Mode watch : relance les tests à chaque modification
 * 
 * e) "lint": "ng lint"
 *    Analyse statique du code (linting)
 *    Exécution : npm run lint
 *    Outil : ESLint
 *    Détecte :
 *    - Erreurs de syntaxe
 *    - Mauvaises pratiques
 *    - Code inutilisé
 *    - Incohérences de formatage
 * 
 * =====================================
 * 3. DÉPENDANCES (dependencies)
 * =====================================
 * 
 * Packages ESSENTIELS pour exécuter l'application en production
 * Installés dans node_modules/ via npm install
 * Inclus dans la build finale
 * 
 * Format : "nom-package": "version"
 * Exemples de versions :
 *   "^17.0.0" : Accepte 17.0.0 et versions mineures >= 17.0.0
 *   "~17.0.0" : Accepte 17.0.0 et patches >= 17.0.0
 *   "17.0.0"  : Exactement 17.0.0 (strict)
 * 
 * DÉPENDANCES PRINCIPALES :
 * 
 * a) "@angular/animations": "^17.0.0"
 *    Animations Angular (transitions, effets)
 * 
 * b) "@angular/common": "^17.0.0"
 *    Directives Angular courantes
 *    *ngIf, *ngFor, *ngSwitch, etc.
 * 
 * c) "@angular/compiler": "^17.0.0"
 *    Compilateur Angular (TS → JS)
 * 
 * d) "@angular/core": "^17.0.0"
 *    Cœur d'Angular (composants, services, injection)
 * 
 * e) "@angular/forms": "^17.0.0"
 *    Gestion des formulaires
 *    Validation de données
 * 
 * f) "@angular/platform-browser": "^17.0.0"
 *    Utilise le DOM du navigateur
 * 
 * g) "@angular/router": "^17.0.0"
 *    Système de routage (navigation entre pages)
 * 
 * h) "rxjs": "^7.8.0"
 *    Programmation réactive (Observables)
 *    Gestion des flux asynchrones
 * 
 * i) "zone.js": "^0.14.0"
 *    Patch du navigateur pour Angular
 *    Détecte les changements automatiquement
 * 
 * =====================================
 * 4. DEV DÉPENDANCES (devDependencies)
 * =====================================
 * 
 * Packages pour développement SEULEMENT
 * Utiles pour développer, tester, compiler
 * N'sont PAS inclus dans la build production
 * Réduit la taille du bundle en production
 * 
 * CONTENU :
 * 
 * a) "@angular-devkit/build-angular"
 *    Outil de build pour Angular
 * 
 * b) "@angular/cli"
 *    Interface de commande Angular
 *    Commandes : ng serve, ng build, ng generate, etc.
 * 
 * c) "@angular/compiler-cli"
 *    Compilateur Angular en ligne de commande
 * 
 * d) Jasmine, Karma
 *    Framework de test
 * 
 * e) TypeScript
 *    Compilateur TypeScript (TS → JS)
 * 
 * =====================================
 * UTILISATION COURANTE
 * =====================================
 * 
 * 1. Lors du clonage du repo :
 *    $ npm install
 *    → Installe TOUS les packages (dependencies + devDependencies)
 *    → Crée node_modules/ avec tout le code
 *    → Crée package-lock.json (versions exactes)
 * 
 * 2. Pour développer localement :
 *    $ npm start
 *    → Lance http://localhost:4200
 *    → Développement avec hot reload
 * 
 * 3. Pour déployer en production :
 *    $ npm run build
 *    → Crée dist/soundora-frontend/
 *    → Déployer le contenu de dist/ sur un serveur web
 * 
 * 4. Pour tester :
 *    $ npm run test
 *    → Lance les tests automatiques
 * 
 * =====================================
 * IMPORTANT : .gitignore et node_modules/
 * =====================================
 * 
 * node_modules/ est très volumineux (100+ Mo)
 * Ne doit PAS être commité dans Git
 * Doit être dans .gitignore
 * 
 * Pour redistribuer le projet :
 * - Partager package.json et package-lock.json
 * - Quelqu'un fait : npm install
 * - npm réinstalle les mêmes versions
 */
