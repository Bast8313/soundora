/**
 * =====================================
 * EXPLICATIONS DÉTAILLÉES - angular.json
 * =====================================
 * 
 * FICHIER : soundora-frontend/angular.json
 * RÔLE : Configuration globale du projet Angular
 * IMPORTANCE : ⭐⭐⭐ (TRÈS IMPORTANT)
 * 
 * =====================================
 * STRUCTURE DU FICHIER
 * =====================================
 * 
 * 1. "$schema"
 *    Fichier de schéma JSON pour la validation
 *    Permet à VS Code d'autocomplétage et validation
 *    Valeur : "./node_modules/@angular/cli/lib/config/schema.json"
 * 
 * 2. "version"
 *    Numéro de version du schéma de configuration
 *    Actuellement : 1
 * 
 * 3. "newProjectRoot"
 *    Dossier par défaut pour les nouveaux projets Angular
 *    Utilisé quand on crée un workspace multi-projets
 * 
 * =====================================
 * SECTION "projects"
 * =====================================
 * 
 * Contient la configuration du projet
 * Clé : "soundora-frontend" (nom du projet)
 * 
 * a) "projectType": "application"
 *    Type de projet : "application" (app web) ou "library" (bibliothèque)
 *    Détermine la structure et la compilation
 * 
 * b) "schematics"
 *    Configuration des générateurs (ng generate)
 *    "@schematics/angular:application" : Schéma pour générer des apps
 *    "strict": true : Mode strict (plus de vérifications TypeScript)
 * 
 * c) "root": ""
 *    Dossier racine du projet (vide = racine du workspace)
 * 
 * d) "sourceRoot": "src"
 *    Dossier où se trouve le code source
 *    Chemin : soundora-frontend/src/
 * 
 * e) "prefix": "app"
 *    Préfixe pour les nouveaux composants générés
 *    Exemple : ng generate component test
 *    Crée : <app-test></app-test>
 * 
 * =====================================
 * SECTION "architect"
 * =====================================
 * 
 * Définit les tâches/commandes (build, serve, test, etc.)
 * Chaque tâche a une "builder" et des "options"
 * 
 * 1. "build" - Compilation pour production
 *    ========================================
 * 
 *    Builder : "@angular-devkit/build-angular:browser"
 *    Compile TypeScript → JavaScript
 *    Minifie le code
 *    Crée les assets statiques
 * 
 *    Options principales :
 * 
 *    a) "outputPath": "dist/soundora-frontend"
 *       Dossier de sortie des fichiers compilés
 *       Chemin : soundora-frontend/dist/soundora-frontend/
 *       Ce dossier est déployé sur le serveur web
 * 
 *    b) "index": "src/index.html"
 *       Fichier HTML principal
 *       Angular remplace <app-root> par l'application
 * 
 *    c) "main": "src/main.ts"
 *       Fichier TypeScript d'entrée
 *       Point de démarrage de l'application
 * 
 *    d) "polyfills": ["zone.js"]
 *       Polyfills pour compatibilité navigateur
 *       zone.js : Patch pour Angular
 * 
 *    e) "tsConfig": "tsconfig.app.json"
 *       Configuration TypeScript pour la build
 * 
 *    f) "assets": ["src/favicon.ico", "src/assets"]
 *       Fichiers statiques à copier dans dist/
 *       Images, icônes, fichiers de configuration, etc.
 * 
 *    g) "styles": ["src/styles.css"]
 *       Fichiers CSS globaux (appliqués à toute l'app)
 * 
 *    h) "scripts": []
 *       Scripts JavaScript externes
 *       Exemple : Bibliothèques jQuery, Bootstrap, etc.
 * 
 *    Configurations de build :
 * 
 *    "production" :
 *      - Optimisé pour la performance
 *      - Minification maximale
 *      - Tree-shaking (supprime code inutilisé)
 *      - Output hashing (ajoute hash aux noms pour cache)
 *      - Limites de taille : 500kb initial, 2kb components
 * 
 *    "development" :
 *      - Optimisé pour la rapidité de compilation
 *      - Pas de minification
 *      - Sourcemaps : permet de déboguer
 *      - Plus rapide à compiler
 * 
 * 2. "serve" - Serveur de développement
 *    ====================================
 * 
 *    Builder : "@angular-devkit/build-angular:dev-server"
 *    Lance un serveur local avec hot-reload
 *    Écoute les changements et recompile
 * 
 *    Configurations :
 * 
 *    "production" :
 *      buildTarget : soundora-frontend:build:production
 *      Build optimisée pour production
 *      (peu utilisée avec ng serve)
 * 
 *    "development" :
 *      buildTarget : soundora-frontend:build:development
 *      Build pour dev (recompile rapide)
 *      Configuration par défaut
 *      Port : 4200
 * 
 * 3. "extract-i18n" - Internationalisation
 *    =======================================
 * 
 *    Extracte les chaînes de texte traduisibles
 *    Pour ajouter support multi-langues
 *    (Non utilisé pour Soundora actuellement)
 * 
 * 4. "test" - Tests unitaires
 *    =========================
 * 
 *    Builder : "@angular-devkit/build-angular:karma"
 *    Lance les tests avec Jasmine + Karma
 *    Exécute les fichiers *.spec.ts
 * 
 *    Options :
 * 
 *    "polyfills" : ["zone.js", "zone.js/testing"]
 *    Inclut zone.js et zone.js pour tests
 * 
 *    "tsConfig": "tsconfig.spec.json"
 *    Configuration TypeScript pour tests
 * 
 * =====================================
 * SECTION "cli"
 * =====================================
 * 
 * "analytics": false
 * Désactive les données analytiques envoyées à Google
 * Respecte la vie privée
 * 
 * =====================================
 * UTILISATION COURANTE
 * =====================================
 * 
 * 1. ng serve
 *    Lance le serveur de développement (build:development)
 *    Port : http://localhost:4200
 * 
 * 2. ng build
 *    Compile en production (build:production)
 *    Crée dist/soundora-frontend/
 * 
 * 3. ng build --configuration=production
 *    Compilation explicite en production
 * 
 * 4. ng build --configuration=development
 *    Compilation explicite en développement
 * 
 * 5. ng test
 *    Lance les tests
 * 
 * 6. ng generate component mon-composant
 *    Crée un nouveau composant
 *    Utilise la clé "prefix": "app"
 *    Résultat : <app-mon-composant></app-mon-composant>
 * 
 * =====================================
 * MODIFICATION COURANTE
 * =====================================
 * 
 * Changer le port du serveur :
 * Configuration : "serve" → "options"
 * Ajouter : "port": 3000
 * Commande : ng serve --port 3000
 * 
 * Inclure une nouvelle bibliothèque CSS globale :
 * "styles": ["src/styles.css", "node_modules/bootstrap/dist/css/bootstrap.css"]
 * 
 * Ajouter des scripts externes :
 * "scripts": ["node_modules/jquery/dist/jquery.min.js"]
 */
