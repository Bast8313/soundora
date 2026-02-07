/**
 * ============================================================================
 * 📦 EXPLICATIONS DÉTAILLÉES - NavbarComponent
 * ============================================================================
 * Error occurs in the template of component CartComponent
 * Ce fichier explique en détail le fonctionnement de la barre de navigation
 * (navbar) avec menu responsive, recherche, panier et authentification.
 */

/**
 * ============================================================================
 * 1️⃣ STRUCTURE DU COMPOSANT NAVBAR
 * ============================================================================
 *
 * La navbar contient 6 zones principales :
 *
 * 1. Logo Soundora (lien vers l'accueil)
 * 2. Menu de navigation (Accueil, Produits, Catégories, À propos)
 * 3. Barre de recherche
 * 4. Icône panier avec badge compteur
 * 5. Boutons Connexion/Inscription
 * 6. Menu burger (visible uniquement sur mobile)
 */

/**
 * ============================================================================
 * 2️⃣ TYPESCRIPT - navbar.component.ts
 * ============================================================================
 */

/**
 * IMPORTS
 * -------
 *
 * CommonModule
 * - Fournit les directives Angular de base (*ngIf, *ngFor, pipes, etc.)
 * - Nécessaire pour utiliser *ngIf sur le badge du panier
 *
 * RouterModule
 * - Permet d'utiliser routerLink pour la navigation
 * - Permet d'utiliser routerLinkActive pour surligner le lien actif
 *
 * FormsModule
 * - Nécessaire pour utiliser [(ngModel)] sur l'input de recherche
 * - Permet le two-way data binding (liaison bidirectionnelle)
 */

/**
 * PROPRIÉTÉS DE CLASSE
 * ---------------------
 *
 * isMenuOpen: boolean = false
 * - État du menu burger (ouvert ou fermé)
 * - Sur mobile, contrôle l'affichage du menu de navigation
 * - false par défaut = menu fermé au chargement
 *
 * UTILISATION :
 * - Basculée par toggleMenu() quand on clique sur le burger
 * - Utilisée dans le template avec [class.active]="isMenuOpen"
 *
 * searchQuery: string = ''
 * - Contient le texte de recherche saisi par l'utilisateur
 * - Lié à l'input avec [(ngModel)]="searchQuery"
 * - Réinitialisé à '' après la recherche
 *
 * EXEMPLE DE FLUX :
 * 1. Utilisateur tape "guitare" → searchQuery = "guitare"
 * 2. Utilisateur appuie sur Entrée → onSearch() est appelé
 * 3. onSearch() traite la recherche
 * 4. searchQuery est réinitialisé à ''
 *
 * cartItemCount: number = 0
 * - Nombre d'articles dans le panier
 * - Affiché dans le badge rouge au-dessus de l'icône panier
 * - Actuellement fixé à 0 (à remplacer par la valeur du CartService)
 *
 * TODO :
 * Dans le ngOnInit(), s'abonner au CartService :
 * this.cartService.getCartCount().subscribe(count => {
 *   this.cartItemCount = count;
 * });
 */

/**
 * MÉTHODES
 * --------
 *
 * toggleMenu(): void
 * ------------------
 * But : Bascule l'état du menu burger (ouvert ↔ fermé)
 *
 * FONCTIONNEMENT :
 * this.isMenuOpen = !this.isMenuOpen;
 * - Si isMenuOpen = false → devient true (menu s'ouvre)
 * - Si isMenuOpen = true → devient false (menu se ferme)
 *
 * DÉCLENCHEMENT :
 * - Quand l'utilisateur clique sur le bouton burger (3 lignes)
 * - (click)="toggleMenu()" dans le template
 *
 * EFFET VISUEL :
 * - Classe CSS .active est ajoutée/retirée sur .navbar-menu
 * - Animation CSS change max-height de 0 à 400px
 * - Les lignes du burger forment un X quand actif
 *
 * EXEMPLE :
 * 1. Menu fermé (isMenuOpen = false)
 * 2. Clic sur burger → toggleMenu() → isMenuOpen = true
 * 3. CSS détecte .navbar-menu.active → affiche le menu
 * 4. Re-clic sur burger → toggleMenu() → isMenuOpen = false
 * 5. Menu se referme
 *
 *
 * closeMenu(): void
 * -----------------
 * But : Ferme le menu burger (force isMenuOpen à false)
 *
 * UTILISATION :
 * - Appelée quand l'utilisateur clique sur un lien de navigation
 * - (click)="closeMenu()" sur chaque <a> du menu
 *
 * POURQUOI ?
 * - Améliore l'UX sur mobile
 * - Quand on clique sur "Produits", on veut :
 *   1. Naviguer vers /products
 *   2. Fermer automatiquement le menu
 * - Sans closeMenu(), le menu resterait ouvert après la navigation
 *
 * EXEMPLE DE FLUX (mobile) :
 * 1. Menu ouvert (isMenuOpen = true)
 * 2. Clic sur "Produits" → closeMenu() → isMenuOpen = false
 * 3. Navigation vers /products
 * 4. Menu se referme automatiquement
 *
 *
 * onSearch(): void
 * ----------------
 * But : Gère la soumission de la recherche
 *
 * FONCTIONNEMENT :
 *
 * ÉTAPE 1 : Vérification
 * if (this.searchQuery.trim())
 * - Vérifie que le champ n'est pas vide
 * - .trim() supprime les espaces avant/après
 * - "   " devient "" → condition fausse → pas de recherche
 *
 * ÉTAPE 2 : Log (temporaire)
 * console.log('Recherche:', this.searchQuery);
 * - Affiche le terme recherché dans la console
 * - Utile pour le développement
 *
 * ÉTAPE 3 : Navigation (TODO)
 * // TODO: Implémenter la navigation vers /products?search=...
 *
 * À IMPLÉMENTER PLUS TARD :
 * this.router.navigate(['/products'], {
 *   queryParams: { search: this.searchQuery }
 * });
 *
 * Cela naviguera vers : /products?search=guitare
 * Le ProductListComponent devra lire ce paramètre et filtrer
 *
 * ÉTAPE 4 : Réinitialisation
 * this.searchQuery = '';
 * - Vide le champ de recherche
 * - Prêt pour une nouvelle recherche
 *
 * DÉCLENCHEMENT :
 * 1. Clic sur le bouton 🔍 : (click)="onSearch()"
 * 2. Touche Entrée dans l'input : (keyup.enter)="onSearch()"
 *
 * EXEMPLE DE FLUX :
 * 1. Utilisateur tape "piano" dans l'input
 * 2. searchQuery = "piano" (via [(ngModel)])
 * 3. Utilisateur appuie sur Entrée
 * 4. (keyup.enter) déclenche onSearch()
 * 5. Condition : "piano".trim() = "piano" ✓
 * 6. Log : "Recherche: piano"
 * 7. searchQuery = '' → input vidé
 */

/**
 * ============================================================================
 * 3️⃣ TEMPLATE HTML - navbar.component.html
 * ============================================================================
 */

/**
 * STRUCTURE GLOBALE
 * -----------------
 *
 * <nav class="navbar">
 *   <div class="navbar-container">
 *     ...contenu...
 *   </div>
 * </nav>
 *
 * - <nav> : élément sémantique HTML5 pour la navigation
 * - .navbar-container : conteneur avec max-width pour centrer le contenu
 */

/**
 * 1. LOGO SOUNDORA
 * ----------------
 *
 * <a routerLink="/" class="navbar-logo">
 *   <span class="logo-icon">🎸</span>
 *   <span class="logo-text">Soundora</span>
 * </a>
 *
 * routerLink="/"
 * - Navigation vers la page d'accueil
 * - Équivalent à href="/" mais sans rechargement de page
 * - Utilise le router Angular (SPA - Single Page Application)
 *
 * EFFET HOVER :
 * - transform: scale(1.05) → logo grossit légèrement au survol
 */

/**
 * 2. MENU DE NAVIGATION
 * ---------------------
 *
 * <ul class="navbar-menu" [class.active]="isMenuOpen">
 *
 * [class.active]="isMenuOpen"
 * - Property binding sur la classe CSS
 * - Si isMenuOpen = true → ajoute la classe 'active'
 * - Si isMenuOpen = false → retire la classe 'active'
 *
 * SUR DESKTOP :
 * - Menu toujours visible (display: flex)
 * - Disposé horizontalement
 *
 * SUR MOBILE :
 * - Menu caché par défaut (max-height: 0)
 * - Quand .active → max-height: 400px → menu se déroule
 *
 *
 * LIENS DE NAVIGATION
 * -------------------
 *
 * <a routerLink="/products" routerLinkActive="active" class="navbar-link">
 *
 * routerLink="/products"
 * - Navigation vers la page des produits
 *
 * routerLinkActive="active"
 * - Angular ajoute automatiquement la classe 'active' quand cette route est active
 * - Permet de surligner le lien de la page actuelle
 *
 * EXEMPLE :
 * - URL actuelle : /products
 * - Le lien "Produits" reçoit la classe .active
 * - CSS : .navbar-link.active { background-color: #3498db; }
 * - Le lien est surligné en bleu
 *
 * [routerLinkActiveOptions]="{exact: true}"
 * - Utilisé UNIQUEMENT sur le lien "Accueil"
 * - exact: true = la route doit matcher exactement
 * - Sans ça, "/" matcherait aussi "/products" (car /products commence par /)
 *
 * (click)="closeMenu()"
 * - Ferme le menu burger après le clic (sur mobile)
 */

/**
 * 3. BARRE DE RECHERCHE
 * ----------------------
 *
 * <input
 *   type="text"
 *   [(ngModel)]="searchQuery"
 *   (keyup.enter)="onSearch()">
 *
 * [(ngModel)]="searchQuery"
 * - TWO-WAY DATA BINDING (liaison bidirectionnelle)
 * - Syntaxe : [(ngModel)] = "banana in a box"
 *
 * FONCTIONNEMENT :
 * - Utilisateur tape dans l'input → searchQuery se met à jour
 * - searchQuery change dans le code → input se met à jour
 *
 * EXEMPLE :
 * 1. Input vide, searchQuery = ""
 * 2. Utilisateur tape "g" → input = "g", searchQuery = "g"
 * 3. Utilisateur tape "u" → input = "gu", searchQuery = "gu"
 * 4. Dans le code : searchQuery = "" → input devient vide
 *
 * (keyup.enter)="onSearch()"
 * - Écoute l'événement "touche Entrée relâchée"
 * - Appelle onSearch() quand l'utilisateur valide la recherche
 *
 * <button (click)="onSearch()">🔍</button>
 * - Alternative : clic sur le bouton de recherche
 */

/**
 * 4. ICÔNE PANIER AVEC BADGE
 * ---------------------------
 *
 * <a routerLink="/cart" class="navbar-icon-link">
 *   <span class="icon">🛒</span>
 *   <span class="badge" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
 * </a>
 *
 * *ngIf="cartItemCount > 0"
 * - Affichage conditionnel du badge
 * - Si panier vide (cartItemCount = 0) → pas de badge
 * - Si panier contient 3 articles → badge affiche "3"
 *
 * POURQUOI *ngIf PLUTÔT QUE TOUJOURS AFFICHER ?
 * - Meilleure UX : pas de badge "0" quand le panier est vide
 * - Badge rouge attire l'attention uniquement s'il y a des articles
 *
 * POSITIONNEMENT CSS :
 * .badge {
 *   position: absolute;
 *   top: -8px;
 *   right: -8px;
 * }
 *
 * - Position absolue par rapport à .navbar-icon-link (position: relative)
 * - Décalé en haut à droite de l'icône
 * - Crée l'effet de "badge" superposé
 */

/**
 * 5. BOUTONS AUTHENTIFICATION
 * ----------------------------
 *
 * <a routerLink="/login" class="btn-login">Connexion</a>
 * <a routerLink="/register" class="btn-register">Inscription</a>
 *
 * STYLES DIFFÉRENTS :
 * - .btn-login : bordure blanche, fond transparent
 * - .btn-register : fond vert, bordure verte
 *
 * EFFET HOVER :
 * - Login : fond devient blanc, texte devient sombre
 * - Register : fond devient vert plus foncé
 *
 * À FAIRE PLUS TARD :
 * - Remplacer par le nom de l'utilisateur + menu dropdown
 * - Afficher "Bonjour, Jean" au lieu de Connexion/Inscription
 * - Ajouter un bouton "Déconnexion" dans le dropdown
 */

/**
 * 6. MENU BURGER
 * --------------
 *
 * <button class="burger-menu" (click)="toggleMenu()" [class.active]="isMenuOpen">
 *   <span class="burger-line"></span>
 *   <span class="burger-line"></span>
 *   <span class="burger-line"></span>
 * </button>
 *
 * STRUCTURE :
 * - 3 lignes horizontales (burger-line)
 * - Clic sur le bouton → toggleMenu()
 *
 * ANIMATION BURGER → X :
 * .burger-menu.active .burger-line:nth-child(1) {
 *   transform: rotate(45deg) translate(8px, 8px);
 * }
 * .burger-menu.active .burger-line:nth-child(2) {
 *   opacity: 0;
 * }
 * .burger-menu.active .burger-line:nth-child(3) {
 *   transform: rotate(-45deg) translate(7px, -7px);
 * }
 *
 * EXPLICATION :
 * - Ligne 1 : rotation 45° + déplacement → forme le haut du X
 * - Ligne 2 : devient invisible (opacity: 0)
 * - Ligne 3 : rotation -45° + déplacement → forme le bas du X
 * - Transition CSS rend l'animation fluide
 *
 * VISIBILITÉ :
 * - Desktop : display: none (caché)
 * - Mobile (< 768px) : display: flex (visible)
 */

/**
 * ============================================================================
 * 4️⃣ STYLES CSS - navbar.component.css
 * ============================================================================
 */

/**
 * STICKY NAVBAR
 * -------------
 *
 * .navbar {
 *   position: sticky;
 *   top: 0;
 *   z-index: 1000;
 * }
 *
 * position: sticky
 * - La navbar reste fixée en haut lors du scroll
 * - Contrairement à 'fixed', elle commence dans le flux normal
 * - Quand on scroll, elle "colle" en haut (top: 0)
 *
 * z-index: 1000
 * - Assure que la navbar reste au-dessus du contenu
 * - Valeur élevée pour éviter les chevauchements
 */

/**
 * FLEXBOX LAYOUT
 * --------------
 *
 * .navbar-container {
 *   display: flex;
 *   align-items: center;
 *   justify-content: space-between;
 *   gap: 2rem;
 * }
 *
 * display: flex
 * - Disposition flexible des éléments enfants
 *
 * align-items: center
 * - Aligne verticalement au centre
 *
 * justify-content: space-between
 * - Espace les éléments avec un maximum d'espace entre eux
 * - Logo à gauche, actions à droite
 *
 * gap: 2rem
 * - Espace entre les éléments (32px)
 */

/**
 * RESPONSIVE - MOBILE
 * -------------------
 *
 * @media (max-width: 768px) {
 *   .navbar-container {
 *     flex-wrap: wrap;
 *   }
 * }
 *
 * flex-wrap: wrap
 * - Permet aux éléments de passer à la ligne
 * - Nécessaire pour réorganiser la navbar sur mobile
 *
 * ORDRE DES ÉLÉMENTS SUR MOBILE :
 * - Logo (order: 1) : en haut à gauche
 * - Burger (order: 2) : en haut à droite
 * - Actions (order: 3) : en haut au milieu
 * - Recherche (order: 4) : ligne suivante, pleine largeur
 * - Menu (order: 5) : en dessous, pleine largeur
 *
 * MENU DÉROULANT :
 * .navbar-menu {
 *   max-height: 0;
 *   overflow: hidden;
 *   transition: max-height 0.3s ease-out;
 * }
 *
 * .navbar-menu.active {
 *   max-height: 400px;
 * }
 *
 * - max-height: 0 → menu caché (hauteur 0, contenu masqué)
 * - max-height: 400px quand .active → menu se déroule
 * - transition anime le changement de hauteur
 * - overflow: hidden empêche le contenu de déborder
 *
 * POURQUOI max-height ET PAS height ?
 * - On ne connaît pas la hauteur exacte du menu (dépend du contenu)
 * - max-height: 400px laisse assez d'espace
 * - Transition fonctionne avec max-height
 */

/**
 * TRANSITIONS CSS
 * ---------------
 *
 * .navbar-link {
 *   transition: background-color 0.3s, color 0.3s;
 * }
 *
 * - Anime les changements de couleur sur 300ms
 * - Rend les interactions plus fluides
 *
 * .navbar-logo {
 *   transition: transform 0.3s;
 * }
 *
 * - Anime l'effet de grossissement au survol
 */

/**
 * ============================================================================
 * 5️⃣ INTÉGRATION DANS AppComponent
 * ============================================================================
 *
 * IMPORT DU COMPOSANT :
 * ---------------------
 * import { NavbarComponent } from './components/navbar/navbar.component';
 *
 * AJOUT DANS LES IMPORTS :
 * ------------------------
 * imports: [CommonModule, RouterModule, NavbarComponent]
 *
 * UTILISATION DANS LE TEMPLATE :
 * ------------------------------
 * <app-navbar></app-navbar>
 * <main>
 *   <router-outlet></router-outlet>
 * </main>
 * <footer>...</footer>
 *
 * - La navbar est affichée en haut, avant le contenu
 * - Elle reste visible sur toutes les pages
 * - Le <router-outlet> affiche le contenu de la page active
 */

/**
 * ============================================================================
 * 6️⃣ FLUX COMPLET - EXEMPLE D'UTILISATION
 * ============================================================================
 *
 * SCÉNARIO 1 : Navigation sur desktop
 * ------------------------------------
 * 1. Utilisateur arrive sur http://localhost:4200
 * 2. Navbar s'affiche avec tous les éléments visibles
 * 3. Menu burger est caché (CSS media query)
 * 4. Utilisateur clique sur "Produits"
 * 5. routerLink="/products" → navigation vers /products
 * 6. routerLinkActive ajoute .active sur le lien "Produits"
 * 7. Lien surligné en bleu
 * 8. ProductListComponent s'affiche dans <router-outlet>
 *
 * SCÉNARIO 2 : Navigation sur mobile
 * -----------------------------------
 * 1. Écran < 768px → média query mobile activée
 * 2. Menu burger visible, menu de navigation caché
 * 3. Utilisateur clique sur le burger
 * 4. (click)="toggleMenu()" → isMenuOpen = true
 * 5. [class.active]="isMenuOpen" → ajoute .active sur .navbar-menu
 * 6. CSS : max-height passe de 0 à 400px → menu se déroule
 * 7. Burger se transforme en X (animation CSS)
 * 8. Utilisateur clique sur "Produits"
 * 9. (click)="closeMenu()" → isMenuOpen = false
 * 10. Navigation vers /products
 * 11. Menu se referme automatiquement
 *
 * SCÉNARIO 3 : Recherche
 * -----------------------
 * 1. Utilisateur clique dans le champ de recherche
 * 2. Input reçoit le focus
 * 3. Utilisateur tape "guitare"
 * 4. [(ngModel)] met à jour searchQuery à chaque frappe
 * 5. searchQuery = "g" → "gu" → "gui" → ... → "guitare"
 * 6. Utilisateur appuie sur Entrée
 * 7. (keyup.enter)="onSearch()" → appelle la méthode
 * 8. if (searchQuery.trim()) → condition vraie
 * 9. console.log("Recherche: guitare")
 * 10. searchQuery = "" → input vidé
 * 11. TODO : navigation vers /products?search=guitare
 *
 * SCÉNARIO 4 : Panier avec articles
 * ----------------------------------
 * 1. CartService émet un nouveau count : 3 articles
 * 2. cartItemCount = 3 (dans un futur ngOnInit)
 * 3. *ngIf="cartItemCount > 0" → condition vraie
 * 4. Badge s'affiche avec "3"
 * 5. Badge positionné en haut à droite de l'icône 🛒
 * 6. Fond rouge (#e74c3c) attire l'attention
 */

/**
 * ============================================================================
 * 7️⃣ AMÉLIORATIONS FUTURES
 * ============================================================================
 *
 * 🔹 AUTHENTIFICATION
 *    - Détecter si l'utilisateur est connecté
 *    - Afficher "Bonjour, [Nom]" au lieu de Connexion/Inscription
 *    - Menu dropdown avec "Mon compte", "Mes commandes", "Déconnexion"
 *
 * 🔹 PANIER DYNAMIQUE
 *    - S'abonner au CartService dans ngOnInit()
 *    - Mettre à jour cartItemCount en temps réel
 *    - Animation quand le nombre change
 *
 * 🔹 RECHERCHE AVANCÉE
 *    - Autocomplétion pendant la frappe
 *    - Dropdown avec suggestions de produits
 *    - Recherche instantanée (debounce avec RxJS)
 *
 * 🔹 MENU CATÉGORIES
 *    - Menu déroulant au survol de "Catégories"
 *    - Afficher les sous-catégories
 *    - Mega menu avec images
 *
 * 🔹 NOTIFICATIONS
 *    - Badge pour les nouvelles notifications
 *    - Icône cloche à côté du panier
 *    - Dropdown avec liste de notifications
 *
 * 🔹 WISHLIST
 *    - Icône cœur pour les favoris
 *    - Badge avec nombre de produits en wishlist
 *
 * 🔹 INTERNATIONALISATION
 *    - Sélecteur de langue (FR/EN)
 *    - Traduction de tous les textes
 *
 * 🔹 ACCESSIBILITÉ
 *    - Attributs ARIA pour lecteurs d'écran
 *    - Navigation au clavier (Tab, Échap)
 *    - Indicateurs de focus visibles
 */

/**
 * ============================================================================
 * 8️⃣ POINTS CLÉS À RETENIR
 * ============================================================================
 *
 * ✅ RESPONSIVE DESIGN
 *    - Desktop : menu horizontal, tout visible
 *    - Mobile : menu burger, menu vertical déroulant
 *    - Breakpoint à 768px
 *
 * ✅ NAVIGATION SPA
 *    - routerLink au lieu de href
 *    - Pas de rechargement de page
 *    - routerLinkActive pour surligner la page active
 *
 * ✅ TWO-WAY BINDING
 *    - [(ngModel)] pour la recherche
 *    - Nécessite FormsModule
 *    - Synchronisation automatique input ↔ propriété
 *
 * ✅ AFFICHAGE CONDITIONNEL
 *    - *ngIf pour le badge panier
 *    - [class.active] pour les classes dynamiques
 *    - Améliore les performances (badge non rendu si count = 0)
 *
 * ✅ ANIMATIONS CSS
 *    - Transitions pour les effets smooth
 *    - Transform pour les effets de survol
 *    - max-height pour le menu déroulant
 *
 * ✅ STICKY NAVBAR
 *    - position: sticky pour rester en haut
 *    - z-index élevé pour passer au-dessus du contenu
 *    - Améliore la navigation (toujours accessible)
 *
 * ✅ CODE COMMENTÉ
 *    - Chaque section expliquée
 *    - Commentaires concis dans le code
 *    - Fichier d'explications séparé pour les détails
 */

/**
 * ============================================================================
 * FIN DES EXPLICATIONS
 * ============================================================================
 *
 * Ce fichier a couvert :
 * ✅ Structure complète de la navbar
 * ✅ Toutes les propriétés et méthodes TypeScript
 * ✅ Chaque élément du template HTML
 * ✅ Styles CSS et responsive design
 * ✅ Intégration dans AppComponent
 * ✅ Flux complets d'utilisation
 * ✅ Améliorations futures possibles
 *
 * La navbar est maintenant prête à être utilisée ! 🎯
 */
