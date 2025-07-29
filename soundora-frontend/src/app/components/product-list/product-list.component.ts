import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductFilters, ApiResponse } from '../../services/product.service';
import { CategoryService, Category, Brand } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  loading = false;
  
  // Filtres et pagination
  filters: ProductFilters = {};
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  
  // Filtres UI
  selectedCategory = '';
  selectedBrand = '';
  searchQuery = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  
  // Titre de la page selon le filtre
  pageTitle = 'Tous nos produits';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cartService: CartService // Ajout du CartService pour gérer l'ajout au panier
  ) {}

  ngOnInit() {
    // Charger d'abord les catégories et marques
    this.loadCategories();
    this.loadBrands();
    
    // Écouter les changements de route après avoir chargé les données
    this.route.params.subscribe(params => {
      // Attendre un court délai pour que les catégories/marques soient chargées
      setTimeout(() => {
        this.handleRouteParams(params);
      }, 100);
    });
  }

  handleRouteParams(params: any) {
    console.log('Paramètres de route reçus:', params);
    console.log('URL actuelle:', this.route.snapshot.url);
    
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
    // Charger les produits avec les nouveaux filtres
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response || [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.categories = [];
      }
    });
  }

  loadBrands() {
    this.categoryService.getBrands().subscribe({
      next: (response: any) => {
        this.brands = response.data || response || [];
        console.log('Marques chargées:', this.brands);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des marques:', error);
        this.brands = [];
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.filters = {
      page: this.currentPage,
      category: this.selectedCategory || undefined,
      brand: this.selectedBrand || undefined,
      search: this.searchQuery || undefined,
      minPrice: this.priceMin || undefined,
      maxPrice: this.priceMax || undefined
    };

    this.productService.getProducts(this.filters).subscribe({
      next: (response: any) => {
        console.log('Réponse API produits:', response);
        if (response && typeof response === 'object') {
          this.products = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response) ? response : [];
          
          // Utilisation correcte de la structure pagination
          if (response.pagination) {
            this.totalItems = response.pagination.totalItems || this.products.length;
            this.totalPages = response.pagination.totalPages || Math.ceil(this.totalItems / 12);
          } else {
            this.totalItems = this.products.length;
            this.totalPages = Math.ceil(this.totalItems / 12);
          }
        } else {
          this.products = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.products = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  // Méthodes de filtrage
  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onBrandChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPriceFilter() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.searchQuery = '';
    this.priceMin = null;
    this.priceMax = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPagesArray(): number[] {
    if (this.totalPages <= 0) {
      return [];
    }
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : '/assets/images/no-image.jpg';
  }

  /**
   * Ajoute un produit au panier et empêche la propagation du clic
   * pour éviter la navigation vers la page de détails
   */
  addToCart(product: Product, event: Event): void {
    // Empêche la propagation du clic pour éviter de naviguer vers la page de détails
    event.stopPropagation();
    event.preventDefault();
    
    // Vérification du stock
    if (product.stock === 0) {
      console.warn('Tentative d\'ajout d\'un produit en rupture de stock:', product.name);
      return;
    }
    
    // Ajout au panier
    this.cartService.addToCart(product);
    console.log(`Produit "${product.name}" ajouté au panier depuis la liste des produits`);
    
    // TODO: Afficher une notification visuelle (toast, snackbar, etc.)
    // Par exemple : this.toastService.show(`${product.name} ajouté au panier`);
  }
}