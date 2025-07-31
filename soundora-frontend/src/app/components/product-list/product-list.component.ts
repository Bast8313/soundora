// IMPORTS NÉCESSAIRES POUR LE COMPOSANT DE LISTE DE PRODUITS
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductFilters, ApiResponse } from '../../services/product.service';
import { CategoryService, Category, Brand } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

/**
 * COMPOSANT LISTE DES PRODUITS
 * Gère l'affichage de tous les produits avec filtres, pagination et recherche
 * Supporte le filtrage par catégorie, marque, prix et recherche textuelle
 * Inclut la gestion du panier avec notifications
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // DONNÉES PRINCIPALES
  products: Product[] = [];       // Liste des produits récupérés depuis l'API
  categories: Category[] = [];    // Liste des catégories pour les filtres
  brands: Brand[] = [];          // Liste des marques pour les filtres
  loading = false;               // État de chargement pour l'UI
  
  // FILTRES ET PAGINATION
  filters: ProductFilters = {};   // Objet contenant tous les filtres appliqués
  currentPage = 1;               // Page courante pour la pagination
  totalPages = 0;                // Nombre total de pages
  totalItems = 0;                // Nombre total d'éléments
  
  // FILTRES UI - VALEURS LIÉES AUX CONTRÔLES DU FORMULAIRE
  selectedCategory = '';         // Catégorie sélectionnée dans le dropdown
  selectedBrand = '';           // Marque sélectionnée dans le dropdown
  searchQuery = '';             // Texte de recherche saisi par l'utilisateur
  priceMin: number | null = null; // Prix minimum pour le filtre de prix
  priceMax: number | null = null; // Prix maximum pour le filtre de prix
  
  // TITRE DYNAMIQUE DE LA PAGE SELON LE FILTRE ACTIF
  pageTitle = 'Tous nos produits';

  /**
   * CONSTRUCTEUR - INJECTION DES DÉPENDANCES
   * Injecte tous les services nécessaires pour le fonctionnement du composant
   * 
   * @param productService - Service pour les opérations liées aux produits
   * @param categoryService - Service pour récupérer catégories et marques
   * @param route - Service pour accéder aux paramètres de l'URL courante
   * @param router - Service pour la navigation programmatique
   * @param cartService - Service pour gérer l'ajout au panier
   * @param notificationService - Service pour afficher les notifications
   */
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService, // Service pour gérer l'ajout au panier
    private notificationService: NotificationService // Service pour afficher les notifications
  ) {}

  /**
   * INITIALISATION DU COMPOSANT
   * Charge les données de base et écoute les changements de route
   */
  ngOnInit() {
    // CHARGEMENT DES DONNÉES DE BASE
    // Charger d'abord les catégories et marques pour les filtres
    this.loadCategories();
    this.loadBrands();
    
    // ÉCOUTE DES CHANGEMENTS DE ROUTE
    // Réagit aux changements d'URL pour appliquer les filtres appropriés
    // Écouter les changements de route après avoir chargé les données
    this.route.params.subscribe(params => {
      // ATTENDRE QUE LES DONNÉES SOIENT CHARGÉES AVANT DE TRAITER LES PARAMÈTRES
      // Vérifie si les catégories et marques sont chargées avant de procéder
      if (this.categories.length > 0 && this.brands.length > 0) {
        this.handleRouteParams(params);
      } else {
        // Si pas encore chargées, attendre un court délai
        setTimeout(() => {
          this.handleRouteParams(params);
        }, 200);
      }
    });
  }

  handleRouteParams(params: any) {
    console.log('Paramètres de route reçus:', params);
    console.log('URL actuelle:', this.route.snapshot.url);
    
    // STOCKAGE DES VALEURS PRÉCÉDENTES pour éviter les rechargements inutiles
    const previousCategory = this.selectedCategory;
    const previousBrand = this.selectedBrand;
    
    // Réinitialiser les filtres
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.pageTitle = 'Tous nos produits';
    
    // Vérifier si on filtre par catégorie
    if (params['slug'] && this.route.snapshot.url[0]?.path === 'category') {
      this.selectedCategory = params['slug'];
      console.log('Filtre par catégorie:', this.selectedCategory);
      // Trouver le nom de la catégorie pour le titre
      const category = this.categories.find(c => c.slug === params['slug']);
      this.pageTitle = category ? `Catégorie: ${category.name}` : 'Catégorie';
    }
    
    // Vérifier si on filtre par marque
    if (params['slug'] && this.route.snapshot.url[0]?.path === 'brand') {
      this.selectedBrand = params['slug'];
      console.log('Filtre par marque:', this.selectedBrand);
      // Trouver le nom de la marque pour le titre
      const brand = this.brands.find(b => b.slug === params['slug']);
      this.pageTitle = brand ? `Marque: ${brand.name}` : 'Marque';
    }
    
    console.log('Titre de page:', this.pageTitle);
    
    // OPTIMISATION: Ne recharger que si les filtres ont vraiment changé
    if (previousCategory !== this.selectedCategory || previousBrand !== this.selectedBrand) {
      this.currentPage = 1; // Reset page lors d'un changement de filtre
      this.loadProducts();
    }
  }

  /**
   * CHARGE LA LISTE DES CATÉGORIES DEPUIS L'API
   * Récupère toutes les catégories pour les afficher dans les filtres
   */
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        // Gestion de différents formats de réponse API
        this.categories = response.data || response || [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.categories = [];
      }
    });
  }

  /**
   * CHARGE LA LISTE DES MARQUES DEPUIS L'API
   * Récupère toutes les marques pour les afficher dans les filtres
   */
  loadBrands() {
    this.categoryService.getBrands().subscribe({
      next: (response: any) => {
        // Gestion de différents formats de réponse API
        this.brands = response.data || response || [];
        console.log('Marques chargées:', this.brands);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des marques:', error);
        this.brands = [];
      }
    });
  }

  /**
   * CHARGE LES PRODUITS DEPUIS L'API AVEC LES FILTRES APPLIQUÉS
   * Construit l'objet de filtres et effectue l'appel API
   * Gère la pagination et les différents formats de réponse
   */
  loadProducts() {
    // ÉVITER LES RECHARGEMENTS MULTIPLES
    if (this.loading) {
      console.log('Chargement déjà en cours, annulation...');
      return;
    }
    
    // ACTIVATION DE L'ÉTAT DE CHARGEMENT
    this.loading = true;
    
    // CONSTRUCTION DE L'OBJET FILTRES
    // Seuls les filtres avec des valeurs sont inclus (undefined = ignoré par l'API)
    this.filters = {
      page: this.currentPage,
      category: this.selectedCategory || undefined,
      brand: this.selectedBrand || undefined,
      search: this.searchQuery || undefined,
      minPrice: this.priceMin || undefined,
      maxPrice: this.priceMax || undefined
    };

    // APPEL API POUR RÉCUPÉRER LES PRODUITS
    this.productService.getProducts(this.filters).subscribe({
      next: (response: any) => {
        console.log('Réponse API produits:', response);
        
        // TRAITEMENT DE LA RÉPONSE API
        if (response && typeof response === 'object') {
          // Extraction des produits selon le format de réponse
          this.products = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response) ? response : [];
          
          // GESTION DE LA PAGINATION
          // Utilisation correcte de la structure pagination
          if (response.pagination) {
            this.totalItems = response.pagination.totalItems || this.products.length;
            this.totalPages = response.pagination.totalPages || Math.ceil(this.totalItems / 12);
          } else {
            // Fallback si pas de pagination dans la réponse
            this.totalItems = this.products.length;
            this.totalPages = Math.ceil(this.totalItems / 12);
          }
        } else {
          // CAS D'ERREUR - RÉINITIALISATION DES DONNÉES
          this.products = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
        
        // DÉSACTIVATION DE L'ÉTAT DE CHARGEMENT
        this.loading = false;
      },
      error: (error) => {
        // GESTION DES ERREURS D'API
        console.error('Erreur lors du chargement des produits:', error);
        this.products = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  // =====================================
  // MÉTHODES DE FILTRAGE ET RECHERCHE
  // =====================================

  /**
   * GESTIONNAIRE CHANGEMENT DE CATÉGORIE
   * Réinitialise la pagination et recharge les produits
   */
  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * GESTIONNAIRE CHANGEMENT DE MARQUE
   * Réinitialise la pagination et recharge les produits
   */
  onBrandChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * GESTIONNAIRE RECHERCHE TEXTUELLE
   * Déclenché par clic sur bouton ou touche Entrée
   */
  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * GESTIONNAIRE FILTRE DE PRIX
   * Déclenché par changement des inputs min/max prix
   */
  onPriceFilter() {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * RÉINITIALISE TOUS LES FILTRES
   * Remet les valeurs par défaut et recharge tous les produits
   */
  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.searchQuery = '';
    this.priceMin = null;
    this.priceMax = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  // =====================================
  // MÉTHODES DE PAGINATION
  // =====================================

  /**
   * NAVIGUE VERS UNE PAGE SPÉCIFIQUE
   * Vérifie que la page est dans les limites valides
   * 
   * @param page - Numéro de page à afficher
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  /**
   * NAVIGUE VERS LA PAGE SUIVANTE
   * Vérifie qu'il existe une page suivante
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * NAVIGUE VERS LA PAGE PRÉCÉDENTE
   * Vérifie qu'il existe une page précédente
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * GÉNÈRE UN TABLEAU DES NUMÉROS DE PAGE
   * Utilisé pour afficher les boutons de pagination
   * 
   * @returns Tableau des numéros de page [1, 2, 3, ...]
   */
  getPagesArray(): number[] {
    if (this.totalPages <= 0) {
      return [];
    }
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR L'AFFICHAGE
  // =====================================

  /**
   * FORMATE UN PRIX EN EUROS
   * Utilise l'API Intl pour un formatage localisé français
   * 
   * @param price - Prix à formater
   * @returns Prix formaté avec devise (ex: "149,00 €")
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * RÉCUPÈRE L'IMAGE PRINCIPALE D'UN PRODUIT
   * Retourne la première image ou une image par défaut
   * 
   * @param product - Produit dont récupérer l'image
   * @returns URL de l'image à afficher
   */
  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : '/assets/images/no-image.jpg';
  }

  /**
   * OPTIMISATION DU RENDU - TRACKBY FUNCTION
   * Évite le re-rendu complet des éléments de la liste quand les données changent
   * Angular utilise l'ID du produit pour identifier les éléments uniques
   * 
   * @param index - Index dans le tableau
   * @param product - Produit à identifier
   * @returns ID unique du produit
   */
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  /**
   * AJOUTE UN PRODUIT AU PANIER AVEC NOTIFICATION
   * Gère l'ajout au panier, empêche la navigation vers la page de détails,
   * et affiche une notification de confirmation avec bouton "Voir le panier"
   * 
   * @param product - Produit à ajouter au panier
   * @param event - Événement de clic (pour stopper la propagation)
   */

  addToCart(product: Product, event: Event): void {
    // EMPÊCHE LA PROPAGATION DU CLIC
    // Évite la navigation vers la page de détails quand on clique sur "Ajouter au panier"
    event.stopPropagation();
    event.preventDefault();
    
    // VÉRIFICATION DU STOCK AVANT AJOUT
    if (product.stock === 0) {
      // NOTIFICATION D'ERREUR pour rupture de stock
      this.notificationService.showCartAddError(
        product.name,
        'Produit en rupture de stock'
      );
      
      console.warn('Tentative d\'ajout d\'un produit en rupture de stock:', product.name);
      return;
    }
    
    // AJOUT EFFECTIF AU PANIER via le service CartService
    this.cartService.addToCart(product);
    
    // NOTIFICATION DE SUCCÈS avec bouton "Voir le panier"
    // showCartAddSuccess() format automatiquement le message et ajoute l'action
    this.notificationService.showCartAddSuccess(
      product.name,                    // Nom du produit ajouté
      1,                              // Quantité (toujours 1 depuis la liste)
      () => {                         // Callback pour "Voir le panier"
        this.router.navigate(['/cart']); // Navigation vers la page panier
      }
    );
    
    // LOG POUR DEBUG
    console.log(`🛒 Produit "${product.name}" ajouté au panier depuis la liste avec notification`);
  }
}