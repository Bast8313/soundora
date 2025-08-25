// =====================================
// IMPORTS NÉCESSAIRES POUR LA NAVBAR
// =====================================
// Modules Angular pour le composant de navigation principal
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService, Category, Brand } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

/**
 * COMPOSANT DE NAVIGATION PRINCIPAL
 * Barre de navigation responsive avec dropdowns pour catégories, marques et utilisateur
 * Gère l'affichage selon l'état d'authentification
 * Includes menu mobile et desktop avec fermeture automatique
 */
@Component({
  selector: 'app-navbar',           // Sélecteur HTML : <app-navbar></app-navbar>
  standalone: true,                // Composant autonome (Angular 14+)
  imports: [CommonModule, RouterModule], // Modules requis pour directives et routing
  templateUrl: './navbar.component.html', // Template HTML associé
  styleUrl: './navbar.component.css'      // Styles CSS associés
})
export class NavbarComponent implements OnInit, OnDestroy {
  // État du menu burger (mobile)
  isBurgerMenuOpen = false;
  isMobile = false;

  /**
   * Ouvre/ferme le menu burger sur mobile
   */
  toggleBurgerMenu() {
    this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
  }

  /**
   * Détecte si l'écran est en mode mobile (largeur <= 768px)
   */
  checkMobile() {
    if (window !== undefined) {
      this.isMobile = window.innerWidth <= 768;
    }
    // Si on repasse en desktop, on ferme le menu burger
    if (!this.isMobile) {
      this.isBurgerMenuOpen = false;
    }
  }

  // @HostListener('window:resize')
  // onResize() {
  //   this.checkMobile();
  // }
  
  // =====================================
  // PROPRIÉTÉS DE DONNÉES
  // =====================================
  categories: Category[] = [];     // Liste des catégories récupérées de l'API
  brands: Brand[] = [];           // Liste des marques récupérées de l'API
  
  // =====================================
  // GESTION DES ÉTATS D'INTERFACE
  // =====================================
  isDropdownOpen = false;         // État du dropdown des catégories
  isBrandDropdownOpen = false;    // État du dropdown des marques
  isUserDropdownOpen = false;     // État du dropdown utilisateur

  // =====================================
  // GESTION DE L'AUTHENTIFICATION
  // =====================================
  isLoggedIn = false;             // Statut de connexion utilisateur
  currentUser: any = null;        // Données de l'utilisateur connecté

  // =====================================
  // GESTION DES ABONNEMENTS RXJS
  // =====================================
  private subscriptions: Subscription[] = []; // Stockage des abonnements pour éviter les fuites mémoire
  /**
   * CONSTRUCTEUR - INJECTION DES DÉPENDANCES
   * Injecte les services nécessaires au fonctionnement de la navbar
   
   * @param categoryService - Service pour récupérer catégories et marques
   * @param authService - Service pour la gestion de l'authentification
   * @param router - Service de navigation Angular
   */
  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * INITIALISATION DU COMPOSANT
   * Charge les données initiales et configure les abonnements
   */
  ngOnInit() {
  this.loadCategories(); // Charge les catégories au démarrage
  this.loadBrands();     // Charge les marques au démarrage
  this.initAuthState();  // Initialise l'état d'authentification
  //this.checkMobile();    // Détecte le mode mobile au chargement
  }

  /**
   * NETTOYAGE À LA DESTRUCTION
   * Libère les abonnements pour éviter les fuites mémoire
   */
  ngOnDestroy() {
    // Désabonnement de tous les observables pour éviter les fuites mémoire
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // =====================================
  // GESTION DE L'AUTHENTIFICATION
  // =====================================

  /**
   * INITIALISE L'ÉTAT D'AUTHENTIFICATION
   * S'abonne aux observables de l'AuthService pour suivre les changements
   */
  initAuthState() {
    // S'abonner à l'état de connexion
    const authSub = this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        console.log('État de connexion mis à jour:', isLoggedIn);
      }
    });

    // S'abonner aux données utilisateur
    const userSub = this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Utilisateur actuel mis à jour:', user);
      }
    });

    // Ajouter les abonnements à la liste pour le nettoyage
    this.subscriptions.push(authSub, userSub);
  }

  // Méthode pour récupérer les catégories depuis l'API
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        // Récupère les données (gère différents formats de réponse API)
        this.categories = response.data || response || [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error: any) => {
        // Gestion des erreurs de chargement
        console.error('Erreur lors du chargement des catégories:', error);
        this.categories = []; // Réinitialise en cas d'erreur
      }
    });
  }

  // Méthode pour récupérer les marques depuis l'API
  loadBrands() {
    this.categoryService.getBrands().subscribe({
      next: (response: any) => {
        // Récupère les données (gère différents formats de réponse API)
        this.brands = response.data || response || [];
        console.log('Marques chargées:', this.brands);
      },
      error: (error: any) => {
        // Gestion des erreurs de chargement
        console.error('Erreur lors du chargement des marques:', error);
        this.brands = []; // Réinitialise en cas d'erreur
      }
    });
  }

  // === MÉTHODES DE GESTION DES DROPDOWNS ===
  // MODIFICATION : Simplification de la logique des dropdowns
  
  // Bascule l'état du dropdown des catégories (ouvre/ferme)
  // AMÉLIORATION : Ferme aussi le dropdown utilisateur pour cohérence
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;      // Bascule : true → false ou false → true
    this.isBrandDropdownOpen = false;                // Ferme l'autre dropdown pour éviter les conflits
    this.isUserDropdownOpen = false;                 // NOUVEAU : Ferme aussi le dropdown utilisateur
  }

  // Bascule l'état du dropdown des marques (ouvre/ferme)
  // AMÉLIORATION : Ferme aussi le dropdown utilisateur pour cohérence
  toggleBrandDropdown() {
    this.isBrandDropdownOpen = !this.isBrandDropdownOpen; // Bascule état marques
    this.isDropdownOpen = false;                          // Ferme dropdown catégories
    this.isUserDropdownOpen = false;                      // NOUVEAU : Ferme dropdown utilisateur
  }

  // MODIFICATION : Méthode simplifiée - suppression des méthodes openDropdown() et openBrandDropdown()
  // SUPPRIMÉ : openDropdown(), openBrandDropdown() (comportement survol non désiré)
  // RAISON : L'utilisateur demandait un contrôle par clic uniquement
  
  // Ferme tous les dropdowns (peut être appelé depuis l'extérieur ou au clic sur une option)
  // USAGE : Appelé après sélection d'un élément ou clic extérieur
  closeDropdowns() {
    this.isDropdownOpen = false;        // Ferme dropdown catégories
    this.isBrandDropdownOpen = false;   // Ferme dropdown marques  
    this.isUserDropdownOpen = false;    // Ferme dropdown utilisateur
  }

  // NOUVEAU : Écoute les clics sur le document pour fermer les dropdowns
  // OBJECTIF : Améliorer l'UX - fermer dropdowns quand utilisateur clique ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Récupère l'élément cliqué
    const target = event.target as HTMLElement;
    
    // Vérifie si le clic est EN DEHORS de la navbar
    // closest('.navbar') : Remonte l'arbre DOM pour trouver un parent avec classe 'navbar'
    if (!target.closest('.navbar')) {
      this.closeDropdowns(); // Ferme tous les dropdowns si clic extérieur
    }
    
    // LOGIQUE : 
    // - Clic DANS la navbar → Rien (laisse les méthodes toggle gérer)
    // - Clic HORS navbar → Ferme automatiquement tous les dropdowns
  }

  // Bascule l'état du dropdown utilisateur
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isDropdownOpen = false;         // Ferme les autres dropdowns
    this.isBrandDropdownOpen = false;
  }

  // === MÉTHODES DE NAVIGATION ===
  
  // Gestionnaire de clic sur une catégorie dans le dropdown
  onCategorySelect(categorySlug: string) {
    console.log('Clic sur catégorie:', categorySlug); // Log pour débogage
    
    // Navigation vers la page de produits filtrée par catégorie
    // Utilise le slug de la catégorie comme paramètre d'URL
    this.router.navigate(['/category', categorySlug]).then(success => {
      console.log('Navigation vers catégorie réussie:', success);
    }).catch(error => {
      console.error('Erreur navigation catégorie:', error);
    });
    
    this.closeDropdowns(); // Ferme les dropdowns après la sélection
  }

  // Gestionnaire de clic sur une marque dans le dropdown
  onBrandSelect(brandSlug: string) {
    console.log('Clic sur marque:', brandSlug); // Log pour débogage
    
    // Navigation vers la page de produits filtrée par marque
    // Utilise le slug de la marque comme paramètre d'URL
    this.router.navigate(['/brand', brandSlug]).then(success => {
      console.log('Navigation vers marque réussie:', success);
    }).catch(error => {
      console.error('Erreur navigation marque:', error);
    });
    
    this.closeDropdowns(); // Ferme les dropdowns après la sélection
  }

  // === MÉTHODES D'AUTHENTIFICATION ===

  // Déconnexion de l'utilisateur
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        this.closeDropdowns(); // Ferme les dropdowns
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // Même en cas d'erreur, on ferme les dropdowns et on navigue
        this.closeDropdowns();
      }
    });
  }

  // Obtenir l'initiale du prénom pour l'avatar
  getUserInitial(): string {
    if (this.currentUser?.first_name) {
      return this.currentUser.first_name.charAt(0).toUpperCase();
    } else if (this.currentUser?.email) {
      return this.currentUser.email.charAt(0).toUpperCase();
    }
    return 'U'; // Par défaut
  }

  // Obtenir le nom d'affichage de l'utilisateur
  getUserDisplayName(): string {
    if (this.currentUser?.first_name && this.currentUser?.last_name) {
      return `${this.currentUser.first_name} ${this.currentUser.last_name}`;
    } else if (this.currentUser?.first_name) {
      return this.currentUser.first_name;
    } else if (this.currentUser?.email) {
      return this.currentUser.email;
    }
    return 'Utilisateur';
  }
}
