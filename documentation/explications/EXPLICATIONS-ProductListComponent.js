/**
 * ============================================================================
 * 📦 EXPLICATIONS DÉTAILLÉES - ProductListComponent & ProductService
 * ============================================================================
 *
 * Ce fichier explique en détail le fonctionnement du composant ProductList
 * et du service Product pour l'affichage de la liste des produits.
 */

/**
 * ============================================================================
 * 1️⃣ PRODUCTSERVICE - src/app/services/product.service.ts
 * ============================================================================
 *
 * Le ProductService est un SERVICE Angular qui gère toutes les communications
 * avec l'API backend pour les produits.
 *
 * POURQUOI UN SERVICE ?
 * ----------------------
 * - Sépare la logique métier (appels API) de la présentation (composants)
 * - Réutilisable dans plusieurs composants
 * - Facilite les tests unitaires
 * - Centralise la gestion des erreurs
 *
 * @Injectable({ providedIn: 'root' })
 * --------------------------------------
 * Cette décoration fait plusieurs choses :
 * - Indique qu'Angular peut "injecter" ce service dans d'autres classes
 * - providedIn: 'root' = le service est un SINGLETON (une seule instance
 *   partagée dans toute l'application)
 * - Angular gère automatiquement la création et la destruction du service
 */

/**
 * INTERFACES TYPESCRIPT
 * ----------------------
 *
 * export interface Product { ... }
 * - Définit la STRUCTURE d'un objet produit
 * - TypeScript vérifie que les objets respectent cette structure
 * - Autocomplétion dans l'IDE
 * - Détection d'erreurs à la compilation
 *
 * Exemple :
 * const produit: Product = {
 *   id: 1,
 *   name: "Guitare",
 *   price: 500
 * }; // ✅ Valide
 *
 * const mauvais: Product = {
 *   name: "Test"
 * }; // ❌ Erreur : manque 'id' et 'price'
 *
 * export interface ProductsResponse { ... }
 * - Structure pour la RÉPONSE de l'API avec pagination
 * - Contient : products[] + métadonnées (total, page, limit)
 */

/**
 * CONSTRUCTEUR - constructor(private http: HttpClient)
 * -----------------------------------------------------
 *
 * Le constructeur reçoit HttpClient via l'INJECTION DE DÉPENDANCES :
 *
 * private http: HttpClient
 * -------------------------
 * - 'private' crée automatiquement une propriété de classe this.http
 * - HttpClient : service Angular pour les requêtes HTTP (GET, POST, etc.)
 * - Angular injecte automatiquement une instance de HttpClient
 *
 * POURQUOI INJECTION DE DÉPENDANCES ?
 * - Pas besoin de faire : this.http = new HttpClient(...)
 * - Angular gère le cycle de vie des dépendances
 * - Facilite les tests (on peut injecter des mocks)
 */

/**
 * MÉTHODE : getProducts(page, limit, filters)
 * --------------------------------------------
 *
 * But : Récupère la liste paginée des produits avec filtres optionnels
 *
 * PARAMÈTRES :
 * - page : numéro de la page (défaut = 1)
 * - limit : nombre de produits par page (défaut = 12)
 * - filters : objet optionnel avec category_id, brand_id, search, etc.
 *
 * RETOUR : Observable<ProductsResponse>
 * --------------------------------------
 * Observable = flux de données asynchrone (RxJS)
 * - Comme une Promise mais plus puissant
 * - Permet d'annuler la requête
 * - Permet de transformer les données avec des opérateurs
 *
 * CONSTRUCTION DE L'URL :
 * -----------------------
 * let params = new HttpParams()
 *   .set('page', '1')
 *   .set('limit', '12');
 *
 * Crée les paramètres d'URL : ?page=1&limit=12
 *
 * if (filters) { ... }
 * Ajoute les filtres optionnels s'ils existent :
 * ?page=1&limit=12&category_id=5&search=guitare
 *
 * REQUÊTE HTTP :
 * --------------
 * return this.http.get<ProductsResponse>(this.apiUrl, { params });
 *
 * - GET vers http://localhost:3010/api/products?page=1&limit=12
 * - <ProductsResponse> indique le type de réponse attendue
 * - { params } passe les paramètres d'URL
 * - Retourne un Observable que le composant va "subscribe"
 */

/**
 * MÉTHODE : getProductBySlug(slug)
 * ---------------------------------
 *
 * But : Récupère UN produit spécifique via son slug
 *
 * PARAMÈTRE :
 * - slug : identifiant unique lisible (ex: "guitare-stratocaster")
 *
 * RETOUR : Observable<Product>
 *
 * URL GÉNÉRÉE :
 * http://localhost:3010/api/products/guitare-stratocaster
 *
 * UTILISATION :
 * Sera utilisé dans ProductDetailComponent pour afficher
 * les détails d'un produit quand on clique dessus
 */

/**
 * MÉTHODE : getFeaturedProducts()
 * --------------------------------
 *
 * But : Récupère les produits "mis en avant" (featured = true)
 *
 * RETOUR : Observable<Product[]>
 * - Retourne directement un tableau de produits
 * - Pas de pagination (généralement 4-6 produits vedettes)
 *
 * URL : http://localhost:3010/api/products/featured
 *
 * UTILISATION :
 * Sera utilisé sur la page d'accueil pour afficher
 * les produits en promotion ou nouveautés
 */

/**
 * MÉTHODE : searchProducts(query)
 * --------------------------------
 *
 * But : Recherche des produits par mot-clé
 *
 * PARAMÈTRE :
 * - query : terme de recherche (ex: "guitare électrique")
 *
 * URL GÉNÉRÉE :
 * http://localhost:3010/api/products/search?search=guitare+électrique
 *
 * UTILISATION :
 * Sera utilisé avec une barre de recherche pour filtrer
 * les produits en temps réel
 */

/**
 * ============================================================================
 * 2️⃣ PRODUCTLISTCOMPONENT - src/app/components/product-list/...
 * ============================================================================
 *
 * Le ProductListComponent est un COMPOSANT Angular qui affiche
 * la liste des produits avec pagination.
 */

/**
 * @Component({ ... })
 * ------------------
 *
 * DÉCORATEUR qui définit les métadonnées du composant :
 *
 * selector: 'app-product-list'
 * - Nom du tag HTML pour utiliser ce composant : <app-product-list></app-product-list>
 *
 * standalone: true
 * - Composant autonome (nouvelle approche Angular 17)
 * - Pas besoin de NgModule
 * - Importe directement ses dépendances
 *
 * imports: [CommonModule, RouterModule]
 * - CommonModule : directives Angular de base (*ngIf, *ngFor, pipes, etc.)
 * - RouterModule : pour utiliser [routerLink] dans le template
 *
 * templateUrl: './product-list.component.html'
 * - Chemin vers le fichier HTML du template
 *
 * styleUrl: './product-list.component.css'
 * - Chemin vers les styles CSS (scopés au composant uniquement)
 */

/**
 * PROPRIÉTÉS DE CLASSE
 * ---------------------
 *
 * products: Product[] = []
 * - Tableau qui contiendra les produits à afficher
 * - Initialisé vide, sera rempli par l'API
 * - Utilisé dans le template avec *ngFor
 *
 * total: number = 0
 * - Nombre TOTAL de produits (toutes pages confondues)
 * - Exemple : 150 produits au total
 *
 * currentPage: number = 1
 * - Numéro de la page actuelle
 * - Commence à 1 (pas 0)
 *
 * limit: number = 12
 * - Nombre de produits par page
 * - Avec 150 produits et limit=12 → 13 pages
 *
 * totalPages: number = 0
 * - Nombre total de pages
 * - Calculé : Math.ceil(total / limit)
 * - Exemple : Math.ceil(150 / 12) = 13 pages
 *
 * isLoading: boolean = false
 * - Indicateur de chargement
 * - true pendant la requête API
 * - false quand les données sont reçues
 * - Utilisé pour afficher un spinner
 *
 * error: string = ''
 * - Message d'erreur en cas d'échec
 * - Vide si tout va bien
 * - Affiché à l'utilisateur si l'API échoue
 */

/**
 * MÉTHODE : ngOnInit()
 * --------------------
 *
 * LIFECYCLE HOOK (méthode du cycle de vie d'Angular)
 *
 * QUAND S'EXÉCUTE-T-ELLE ?
 * - Après la création du composant
 * - Après l'initialisation des propriétés
 * - AVANT l'affichage du template
 *
 * BUT : Effectuer les initialisations nécessaires
 * - Charger les données depuis l'API
 * - S'abonner à des observables
 * - Configurer le composant
 *
 * DANS NOTRE CAS :
 * ngOnInit(): void {
 *   this.loadProducts(); // Charge les produits au démarrage
 * }
 *
 * FLUX D'EXÉCUTION :
 * 1. Angular crée ProductListComponent
 * 2. Angular appelle ngOnInit()
 * 3. ngOnInit() appelle loadProducts()
 * 4. loadProducts() fait la requête API
 * 5. Quand l'API répond, products[] est rempli
 * 6. Angular met à jour le template automatiquement
 */

/**
 * MÉTHODE : loadProducts()
 * ------------------------
 *
 * But : Charge les produits depuis l'API
 *
 * ÉTAPE 1 : Préparer l'interface
 * -------------------------------
 * this.isLoading = true;
 * - Active le spinner de chargement
 * - Le template affiche "Chargement..."
 *
 * this.error = '';
 * - Réinitialise les erreurs précédentes
 *
 * ÉTAPE 2 : Appeler le service
 * ----------------------------
 * this.productService.getProducts(this.currentPage, this.limit)
 * - Appelle la méthode du service
 * - Passe la page actuelle et le nombre par page
 * - Retourne un Observable<ProductsResponse>
 *
 * ÉTAPE 3 : S'abonner à l'Observable
 * -----------------------------------
 * .subscribe({ next, error })
 *
 * subscribe() = "écouter" l'Observable
 * - next : fonction appelée quand l'API répond avec succès
 * - error : fonction appelée en cas d'erreur
 *
 * CALLBACKS :
 * -----------
 * next: (response: ProductsResponse) => { ... }
 * - Reçoit la réponse de l'API
 * - Met à jour les propriétés du composant :
 *   - this.products = response.products (les produits à afficher)
 *   - this.total = response.total (150 produits)
 *   - this.totalPages = Math.ceil(150 / 12) = 13 pages
 *   - this.isLoading = false (cache le spinner)
 *
 * error: (err) => { ... }
 * - Appelé si l'API échoue (serveur éteint, erreur 500, etc.)
 * - Affiche un message d'erreur
 * - Log l'erreur dans la console
 * - Cache le spinner
 *
 * EXEMPLE DE FLUX :
 * -----------------
 * 1. Utilisateur arrive sur /products
 * 2. ngOnInit() → loadProducts()
 * 3. isLoading = true → affiche spinner
 * 4. Requête GET vers http://localhost:3010/api/products?page=1&limit=12
 * 5. API répond après 200ms avec { products: [...], total: 150, ... }
 * 6. next() est appelé
 * 7. products[] est rempli avec 12 produits
 * 8. isLoading = false → cache spinner, affiche la grille
 * 9. Angular détecte le changement et met à jour le DOM
 */

/**
 * MÉTHODE : goToPage(page)
 * ------------------------
 *
 * But : Change de page et recharge les produits
 *
 * PARAMÈTRE :
 * - page : numéro de la page cible (1 à totalPages)
 *
 * VÉRIFICATIONS :
 * if (page >= 1 && page <= this.totalPages)
 * - Empêche d'aller à la page 0 ou page 999
 * - Empêche les bugs de pagination
 *
 * ACTIONS :
 * this.currentPage = page;
 * - Met à jour la page actuelle
 *
 * this.loadProducts();
 * - Recharge les produits pour la nouvelle page
 *
 * window.scrollTo(0, 0);
 * - Remonte en haut de la page
 * - Améliore l'UX (user experience)
 *
 * EXEMPLE :
 * - Utilisateur clique sur "Page 3"
 * - goToPage(3) est appelé
 * - currentPage passe de 1 à 3
 * - loadProducts() charge ?page=3&limit=12
 * - Affiche les produits 25 à 36
 * - Scroll remonte en haut
 */

/**
 * MÉTHODE : nextPage()
 * --------------------
 *
 * But : Aller à la page suivante
 *
 * FONCTIONNEMENT :
 * this.goToPage(this.currentPage + 1);
 * - Si page actuelle = 2 → va à la page 3
 * - goToPage() vérifie que page 3 existe
 *
 * EXEMPLE :
 * - Utilisateur sur page 2/13
 * - Clique sur "Suivant →"
 * - nextPage() → goToPage(3)
 * - Affiche page 3
 */

/**
 * MÉTHODE : previousPage()
 * ------------------------
 *
 * But : Aller à la page précédente
 *
 * FONCTIONNEMENT :
 * this.goToPage(this.currentPage - 1);
 * - Si page actuelle = 3 → va à la page 2
 * - goToPage() vérifie que page 2 existe (>= 1)
 *
 * EXEMPLE :
 * - Utilisateur sur page 3/13
 * - Clique sur "← Précédent"
 * - previousPage() → goToPage(2)
 * - Affiche page 2
 */

/**
 * MÉTHODE : getPageNumbers()
 * --------------------------
 *
 * But : Générer un tableau de numéros de page pour le template
 *
 * FONCTIONNEMENT :
 * Array.from({ length: this.totalPages }, (_, i) => i + 1)
 *
 * DÉCORTIQUÉ :
 * -------------
 * Array.from({ length: 13 }, ...)
 * - Crée un tableau de 13 éléments
 *
 * (_, i) => i + 1
 * - _ : valeur ignorée (undefined)
 * - i : index (0, 1, 2, ..., 12)
 * - i + 1 : retourne (1, 2, 3, ..., 13)
 *
 * RÉSULTAT :
 * [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
 *
 * UTILISATION DANS LE TEMPLATE :
 * <button *ngFor="let pageNum of getPageNumbers()">
 *   {{ pageNum }}
 * </button>
 *
 * Affiche 13 boutons numérotés de 1 à 13
 */

/**
 * ============================================================================
 * 3️⃣ TEMPLATE HTML - product-list.component.html
 * ============================================================================
 *
 * Le template utilise des DIRECTIVES ANGULAR pour afficher dynamiquement
 * les données et gérer les interactions.
 */

/**
 * DIRECTIVE : *ngIf
 * -----------------
 *
 * Affichage conditionnel (comme un if en JavaScript)
 *
 * <div *ngIf="error">{{ error }}</div>
 * - Affiche le div SEULEMENT si error n'est pas vide
 * - Si error = '', le div n'existe pas dans le DOM
 *
 * <div *ngIf="isLoading">Chargement...</div>
 * - Affiche le spinner pendant isLoading = true
 *
 * <div *ngIf="!isLoading && products.length > 0">
 * - Affiche la grille SEULEMENT si :
 *   - Le chargement est terminé (isLoading = false)
 *   - ET il y a des produits (products.length > 0)
 */

/**
 * DIRECTIVE : *ngFor
 * ------------------
 *
 * Boucle pour répéter un élément (comme un for...of en JavaScript)
 *
 * <div *ngFor="let product of products">
 *   {{ product.name }}
 * </div>
 *
 * - Crée un div POUR CHAQUE produit dans products[]
 * - 'product' est la variable de boucle (accessible dans le div)
 *
 * EXEMPLE AVEC 3 PRODUITS :
 * products = [
 *   { name: 'Guitare' },
 *   { name: 'Piano' },
 *   { name: 'Batterie' }
 * ]
 *
 * GÉNÈRE :
 * <div>Guitare</div>
 * <div>Piano</div>
 * <div>Batterie</div>
 */

/**
 * INTERPOLATION : {{ ... }}
 * --------------------------
 *
 * Affiche la valeur d'une expression TypeScript
 *
 * {{ product.name }}
 * - Affiche la propriété 'name' du produit
 *
 * {{ product.price | currency:'EUR' }}
 * - Affiche le prix formaté en euros
 * - | currency:'EUR' est un PIPE (filtre de transformation)
 * - 500 devient "500,00 €"
 */

/**
 * PROPERTY BINDING : [propriété]="expression"
 * -------------------------------------------
 *
 * Lie une propriété HTML à une expression TypeScript
 *
 * <img [src]="product.image_url">
 * - L'attribut src de l'image = product.image_url
 * - Si image_url change, l'image change automatiquement
 *
 * [class.active]="pageNum === currentPage"
 * - Ajoute la classe CSS 'active' si pageNum === currentPage
 * - Permet de surligner le bouton de la page actuelle
 *
 * [disabled]="currentPage === 1"
 * - Désactive le bouton si on est sur la page 1
 * - Empêche de cliquer sur "Précédent" sur la première page
 */

/**
 * EVENT BINDING : (événement)="fonction()"
 * -----------------------------------------
 *
 * Écoute un événement et appelle une méthode
 *
 * (click)="goToPage(3)"
 * - Quand on clique, appelle goToPage(3)
 *
 * (error)="$event.target.src='assets/no-image.png'"
 * - Si l'image ne charge pas (404), affiche image par défaut
 * - $event contient les informations de l'événement
 */

/**
 * DIRECTIVE : [routerLink]
 * ------------------------
 *
 * Navigation vers une autre route (comme <a href> mais côté client)
 *
 * <a [routerLink]="['/product', product.slug]">
 *
 * GÉNÈRE L'URL :
 * /product/guitare-stratocaster
 *
 * AVANTAGES :
 * - Pas de rechargement de page (SPA)
 * - Navigation instantanée
 * - Gestion de l'historique du navigateur
 */

/**
 * ============================================================================
 * 4️⃣ STYLES CSS - product-list.component.css
 * ============================================================================
 */

/**
 * GRID LAYOUT
 * -----------
 *
 * .products-grid {
 *   display: grid;
 *   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
 *   gap: 2rem;
 * }
 *
 * EXPLICATIONS :
 * --------------
 * display: grid
 * - Active la disposition en grille CSS
 *
 * grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
 * - repeat(auto-fill, ...) : crée autant de colonnes que possible
 * - minmax(280px, 1fr) : chaque colonne fait minimum 280px, maximum 1 fraction
 * - Résultat : grille responsive qui s'adapte à la largeur
 *
 * EXEMPLE :
 * - Écran 1400px de large : 4 colonnes de 280px + gaps
 * - Écran 800px de large : 2 colonnes
 * - Écran mobile 400px : 1 colonne
 *
 * gap: 2rem
 * - Espace entre les cartes (2rem = 32px)
 */

/**
 * TRANSITIONS CSS
 * ---------------
 *
 * .product-card {
 *   transition: transform 0.3s, box-shadow 0.3s;
 * }
 *
 * .product-card:hover {
 *   transform: translateY(-5px);
 * }
 *
 * EXPLICATIONS :
 * --------------
 * transition : anime les changements de propriétés
 * - transform 0.3s : animation de 300ms pour transform
 * - box-shadow 0.3s : animation de 300ms pour l'ombre
 *
 * :hover : état quand la souris survole
 * - translateY(-5px) : déplace vers le haut de 5px
 *
 * RÉSULTAT :
 * Quand on survole une carte, elle "s'élève" doucement
 */

/**
 * RESPONSIVE DESIGN
 * -----------------
 *
 * @media (max-width: 768px) {
 *   .products-grid {
 *     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
 *   }
 * }
 *
 * EXPLICATIONS :
 * --------------
 * @media (max-width: 768px)
 * - Applique les styles SEULEMENT si largeur <= 768px (tablettes/mobiles)
 *
 * Sur mobile :
 * - Colonnes plus petites (220px au lieu de 280px)
 * - Gaps réduits
 * - Pagination réorganisée
 */

/**
 * ============================================================================
 * 5️⃣ FLUX DE DONNÉES COMPLET (EXEMPLE CONCRET)
 * ============================================================================
 *
 * SCÉNARIO : Utilisateur visite la page des produits
 * ---------------------------------------------------
 *
 * 1. NAVIGATION
 *    - Utilisateur clique sur "Produits" dans le menu
 *    - Angular Router active la route '/products'
 *    - Angular crée une instance de ProductListComponent
 *
 * 2. INITIALISATION
 *    - Angular appelle ngOnInit()
 *    - ngOnInit() appelle loadProducts()
 *    - isLoading devient true
 *    - Template affiche le spinner
 *
 * 3. REQUÊTE API
 *    - loadProducts() appelle productService.getProducts(1, 12)
 *    - ProductService crée l'URL : http://localhost:3010/api/products?page=1&limit=12
 *    - HttpClient envoie une requête GET
 *
 * 4. BACKEND TRAITE
 *    - Le serveur Express reçoit la requête
 *    - Route /api/products → productSupabaseController.getAllProducts()
 *    - Controller interroge Supabase
 *    - Supabase retourne 150 produits au total, 12 pour la page 1
 *    - Backend répond : { products: [...], total: 150, page: 1, limit: 12 }
 *
 * 5. RÉCEPTION
 *    - HttpClient reçoit la réponse (status 200)
 *    - Observable émet la valeur
 *    - La callback next() est appelée
 *
 * 6. MAJ COMPOSANT
 *    - this.products = [...] (12 produits)
 *    - this.total = 150
 *    - this.totalPages = Math.ceil(150 / 12) = 13
 *    - this.isLoading = false
 *
 * 7. MAJ TEMPLATE
 *    - Angular détecte les changements (Change Detection)
 *    - *ngIf="isLoading" devient false → cache spinner
 *    - *ngIf="products.length > 0" devient true → affiche grille
 *    - *ngFor crée 12 cartes produits
 *    - Pagination affiche 13 boutons
 *
 * 8. INTERACTION UTILISATEUR
 *    - Utilisateur clique sur "Page 2"
 *    - (click)="goToPage(2)" est déclenché
 *    - goToPage(2) met currentPage = 2
 *    - loadProducts() est rappelé avec page=2
 *    - Requête : ?page=2&limit=12
 *    - API retourne produits 13 à 24
 *    - Template se met à jour automatiquement
 *
 * TOTAL : ~500ms de la navigation au premier affichage
 */

/**
 * ============================================================================
 * 6️⃣ BONNES PRATIQUES IMPLÉMENTÉES
 * ============================================================================
 *
 * ✅ SÉPARATION DES RESPONSABILITÉS
 *    - Service (ProductService) : gère les appels API
 *    - Composant (ProductListComponent) : gère l'affichage et les interactions
 *    - Template : affiche les données
 *    - CSS : gère le style
 *
 * ✅ TYPAGE FORT
 *    - Interfaces TypeScript pour Product et ProductsResponse
 *    - Détection d'erreurs à la compilation
 *    - Autocomplétion dans l'IDE
 *
 * ✅ GESTION D'ERREURS
 *    - Callback error() pour gérer les échecs API
 *    - Message d'erreur affiché à l'utilisateur
 *    - Log dans la console pour le débogage
 *
 * ✅ EXPÉRIENCE UTILISATEUR
 *    - Spinner pendant le chargement
 *    - Messages clairs (erreur, aucun produit)
 *    - Pagination intuitive
 *    - Scroll automatique en haut lors du changement de page
 *    - Hover effects sur les cartes
 *
 * ✅ PERFORMANCE
 *    - Pagination côté serveur (pas de chargement de 150 produits d'un coup)
 *    - Images avec gestion d'erreur (fallback si 404)
 *    - Transitions CSS (GPU-accelerated)
 *
 * ✅ RESPONSIVE DESIGN
 *    - Grid CSS adaptatif
 *    - Media queries pour mobile/tablette
 *    - Layout flexible
 *
 * ✅ ACCESSIBILITÉ
 *    - Boutons désactivés clairement (opacity, cursor)
 *    - Alt text sur les images
 *    - Structure sémantique HTML
 */

/**
 * ============================================================================
 * 7️⃣ PROCHAINES AMÉLIORATIONS POSSIBLES
 * ============================================================================
 *
 * 🔹 FILTRES ET RECHERCHE
 *    - Ajouter une barre de recherche
 *    - Filtres par catégorie, marque, prix
 *    - Tri (prix croissant/décroissant, nouveautés)
 *
 * 🔹 GESTION DU CACHE
 *    - Mettre en cache les pages visitées
 *    - Pré-charger la page suivante
 *
 * 🔹 INFINITE SCROLL
 *    - Alternative à la pagination
 *    - Charger automatiquement en scrollant
 *
 * 🔹 WISHLIST
 *    - Bouton "Ajouter aux favoris" sur chaque carte
 *    - Stocker dans localStorage ou base de données
 *
 * 🔹 COMPARAISON
 *    - Sélectionner plusieurs produits
 *    - Page de comparaison côte à côte
 *
 * 🔹 ANIMATIONS
 *    - Transition lors du chargement des produits
 *    - Skeleton loaders au lieu du spinner
 */

/**
 * ============================================================================
 * FIN DES EXPLICATIONS
 * ============================================================================
 *
 * Ce fichier a couvert :
 * ✅ Le service ProductService et toutes ses méthodes
 * ✅ Le composant ProductListComponent et son cycle de vie
 * ✅ Les directives Angular utilisées dans le template
 * ✅ Les styles CSS et techniques responsive
 * ✅ Le flux de données complet de bout en bout
 * ✅ Les bonnes pratiques et améliorations futures
 *
 * N'hésite pas à te référer à ce fichier pour comprendre comment
 * les différentes parties fonctionnent ensemble ! 🎯
 */
