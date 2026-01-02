/**
 * =====================================
 * GUIDE COMPLET - Soundora Frontend
 * =====================================
 * 
 * Ce document récapitule TOUT ce qui a été créé pour le frontend Angular
 * et explique chaque fichier en détail.
 * 
 * =====================================
 * STRUCTURE CRÉÉE
 * =====================================
 * 
 * soundora-frontend/
 * ├── src/                           Dossier source (code TypeScript/HTML/CSS)
 * │   ├── app/
 * │   │   ├── app.component.ts       Composant racine (classe TypeScript)
 * │   │   ├── app.component.html     Template HTML (vue)
 * │   │   ├── app.component.css      Styles CSS
 * │   │   ├── app.routes.ts          Configuration du routage (pages)
 * │   │   ├── services/              Dossier pour les services (API, etc.)
 * │   │   └── components/            Dossier pour les composants réutilisables
 * │   └── main.ts                    Point d'entrée Angular
 * ├── index.html                     Fichier HTML principal du navigateur
 * ├── package.json                   Dépendances et scripts npm
 * ├── angular.json                   Configuration globale Angular
 * ├── tsconfig.json                  Configuration TypeScript
 * └── README.md                      Documentation du projet
 * 
 * =====================================
 * FICHIERS D'EXPLICATIONS
 * =====================================
 * 
 * J'ai créé des fichiers d'explication supplémentaires :
 * 
 * - EXPLICATIONS-package.json.js
 * - EXPLICATIONS-angular.json.js
 * - EXPLICATIONS-tsconfig.json.js
 * - CE FICHIER
 * 
 * Lisez-les pour comprendre chaque configuration !
 * 
 * =====================================
 * DESCRIPTION DE CHAQUE FICHIER
 * =====================================
 * 
 * 📦 1. package.json
 * ==================
 * 
 * RÔLE : Gestionnaire de dépendances (comme requirements.txt en Python)
 * 
 * CONTIENT :
 * - Nom et version du projet
 * - Scripts npm (npm start, npm build, npm test)
 * - Dépendances (Angular, RxJS, etc.)
 * - DevDependencies (outils de dev)
 * 
 * COMMANDES IMPORTANTES :
 * - npm install        : Installe toutes les dépendances
 * - npm start          : Lance le serveur local (http://localhost:4200)
 * - npm run build      : Compile pour production (crée dist/)
 * - npm run test       : Lance les tests automatiques
 * - npm run lint       : Analyse le code
 * 
 * 📋 2. angular.json
 * ==================
 * 
 * RÔLE : Configuration globale du projet Angular
 * 
 * CONTIENT :
 * - Chemins des fichiers (src/, dist/, etc.)
 * - Configuration du serveur de dev
 * - Options de compilation (build)
 * - Options des tests
 * - Préfixe des composants (app-)
 * 
 * SECTIONS PRINCIPALES :
 * - "projects" : Configuration du projet soundora-frontend
 * - "architect" : Tâches (build, serve, test, extract-i18n)
 * 
 * ⚙️ 3. tsconfig.json
 * ==================
 * 
 * RÔLE : Configuration du compilateur TypeScript
 * 
 * CONTIENT :
 * - Version JavaScript cible (ES2022)
 * - Niveau de rigueur (strict: true)
 * - Options des décorateurs (@Component, @Injectable)
 * - Sourcemaps pour le débogage
 * 
 * IMPORTANT :
 * - "experimentalDecorators": true → ESSENTIEL pour Angular
 * - "strict": true → Vérifie les types strictement
 * - "sourceMap": true → Permet de déboguer en TypeScript
 * 
 * 📄 4. index.html
 * ================
 * 
 * RÔLE : Fichier HTML principal du navigateur
 * 
 * CONTIENT :
 * - Balise <html> et <head>
 * - Meta tags (charset, viewport, description)
 * - Balise <app-root> → Où Angular injecte l'application
 * - Fichiers CSS globaux
 * 
 * PROCESSUS :
 * 1. Navigateur charge index.html
 * 2. Voit <app-root></app-root>
 * 3. JavaScript Angular remplace <app-root> par l'application
 * 
 * 🚀 5. src/main.ts
 * =================
 * 
 * RÔLE : Point d'entrée de l'application Angular
 * 
 * CONTIENT :
 * - bootstrapApplication() : Démarre Angular
 * - Charge le composant racine (AppComponent)
 * - Configure les services globaux (routeur, HttpClient)
 * 
 * PROCESSUS D'INITIALISATION :
 * 1. main.ts s'exécute
 * 2. bootstrapApplication(AppComponent) démarre
 * 3. AppComponent se monte dans <app-root>
 * 4. Les routes se chargent
 * 5. L'application est prête
 * 
 * 🏗️ 6. src/app/app.component.ts
 * ===============================
 * 
 * RÔLE : Composant racine de l'application
 * 
 * CONTIENT :
 * - @Component() : Configuration du composant
 * - Class AppComponent : Logique du composant
 * - Propriétés : title, isLoading, etc.
 * - Méthodes : ngOnInit(), loadInitialData()
 * 
 * DÉCORATEURS IMPORTANTS :
 * - selector: 'app-root' → Balise HTML <app-root>
 * - templateUrl: './app.component.html' → Vue (HTML)
 * - styleUrl: './app.component.css' → Styles
 * - standalone: true → Composant standalone (moderne)
 * 
 * LIFECYCLE HOOK :
 * - ngOnInit() : Appelée une fois après la création du composant
 *   Idéal pour initialiser les données
 * 
 * 📝 7. src/app/app.component.html
 * =================================
 * 
 * RÔLE : Template HTML du composant racine
 * 
 * CONTIENT :
 * - <header> : En-tête de la page
 * - <main> avec <router-outlet> : Zone de contenu principal
 * - <footer> : Pied de page
 * 
 * <router-outlet> :
 * - Élément spécial Angular
 * - Affiche le composant correspondant à la route active
 * - Exemple :
 *   - Route /products → ProductListComponent
 *   - Route /cart → CartComponent
 *   - Route /product/:slug → ProductDetailComponent
 * 
 * 🎨 8. src/app/app.component.css
 * ================================
 * 
 * RÔLE : Styles CSS du composant racine
 * 
 * CONTIENT :
 * - Variables CSS (--couleur-primaire, etc.)
 * - Styles du header
 * - Styles du main
 * - Styles du footer
 * 
 * PORTÉE :
 * - Ne s'applique qu'à ce composant (encapsulation)
 * - Les composants enfants ont leurs propres styles
 * 
 * 🗺️ 9. src/app/app.routes.ts
 * ============================
 * 
 * RÔLE : Configuration du système de routage (navigation)
 * 
 * CONTIENT :
 * - Array "routes" : Liste de toutes les routes de l'app
 * - Chaque route : { path: '...', component: ... }
 * 
 * EXEMPLES DE ROUTES À AJOUTER :
 * 
 * {
 *   path: 'products',
 *   component: ProductListComponent
 * }
 * 
 * {
 *   path: 'product/:slug',
 *   component: ProductDetailComponent
 *   // :slug = paramètre dynamique
 * }
 * 
 * {
 *   path: 'cart',
 *   component: CartComponent
 * }
 * 
 * Route par défaut :
 * {
 *   path: '',
 *   redirectTo: 'products',
 *   pathMatch: 'full'
 * }
 * 
 * Route 404 (DOIT être la dernière !) :
 * {
 *   path: '**',
 *   redirectTo: ''
 * }
 * 
 * =====================================
 * FLUX D'INITIALISATION COMPLET
 * =====================================
 * 
 * 1. CHARGEMENT PAGE
 *    Utilisateur accède à http://localhost:4200
 * 
 * 2. NAVIGATEUR CHARGE INDEX.HTML
 *    - Parse le HTML
 *    - Charge le CSS global (s'il y en a)
 *    - Exécute JavaScript
 * 
 * 3. ANGULAR DÉMARRE (main.ts)
 *    - bootstrapApplication(AppComponent)
 *    - Crée une instance de AppComponent
 * 
 * 4. APP COMPONENT SE MONTE
 *    - Remplace <app-root> par le template app.component.html
 *    - Applique les styles app.component.css
 *    - Exécute ngOnInit()
 * 
 * 5. ROUTEUR SE CONFIGURE
 *    - Lit app.routes.ts
 *    - Détecte la route actuelle (/) 
 *    - Crée le composant approprié
 * 
 * 6. ROUTER-OUTLET AFFICHE LE COMPOSANT
 *    - <router-outlet> affiche ProductListComponent
 *    - (car route / redirige vers /products)
 * 
 * 7. APPLICATION PRÊTE
 *    - Utilisateur voit la page
 *    - Peut naviguer, cliquer, etc.
 * 
 * =====================================
 * DÉVELOPPEMENT TYPIQUE
 * =====================================
 * 
 * 1. Lancer le serveur de dev :
 *    $ npm start
 *    → http://localhost:4200
 * 
 * 2. Créer un nouveau composant :
 *    $ ng generate component components/product-list
 *    Crée :
 *    - product-list.component.ts
 *    - product-list.component.html
 *    - product-list.component.css
 *    - product-list.component.spec.ts
 * 
 * 3. Créer un service :
 *    $ ng generate service services/product
 *    Crée :
 *    - product.service.ts
 *    - product.service.spec.ts
 * 
 * 4. Ajouter la route dans app.routes.ts :
 *    {
 *      path: 'products',
 *      component: ProductListComponent
 *    }
 * 
 * 5. Naviguer vers la route :
 *    this.router.navigate(['/products'])
 * 
 * 6. Appeler l'API backend :
 *    constructor(private http: HttpClient) {}
 *    
 *    getProducts() {
 *      return this.http.get('http://localhost:3010/api/products');
 *    }
 * 
 * =====================================
 * TECHNOLOGIES PRINCIPALES
 * =====================================
 * 
 * 1. TYPESCRIPT
 *    Langage fortement typé (JS amélioré)
 *    Compilation TS → JS
 *    Détecte les erreurs à la compilation
 * 
 * 2. ANGULAR 17
 *    Framework web moderne
 *    Composants réutilisables
 *    Injection de dépendances
 *    Routage intégré
 * 
 * 3. RXJS
 *    Programmation réactive
 *    Observables pour les flux asynchrones
 *    Gestion des événements
 * 
 * 4. ANGULAR ROUTER
 *    Navigation entre pages
 *    Paramètres d'URL (:id, :slug)
 *    Guards d'authentification
 * 
 * 5. HTTPCLIENT
 *    Requêtes HTTP vers le backend
 *    Gestion des réponses
 *    Gestion des erreurs
 * 
 * =====================================
 * PROCHAINES ÉTAPES
 * =====================================
 * 
 * ✅ FAIT :
 * - Structure minimale créée
 * - Configurations expliquées
 * 
 * ❌ À FAIRE :
 * - [ ] Créer les composants (ProductList, ProductDetail, Cart, etc.)
 * - [ ] Créer les services (ProductService, CartService, AuthService)
 * - [ ] Implémenter les routes
 * - [ ] Ajouter les styles (CSS/Bootstrap/Tailwind)
 * - [ ] Intégrer Stripe pour les paiements
 * - [ ] Ajouter l'authentification
 * - [ ] Tester l'intégration avec le backend
 * 
 * =====================================
 * RESSOURCES UTILES
 * =====================================
 * 
 * - Angular Docs : https://angular.io/docs
 * - TypeScript Docs : https://www.typescriptlang.org/
 * - RxJS Docs : https://rxjs.dev/
 * - MDN (HTML/CSS/JS) : https://developer.mozilla.org/
 */
