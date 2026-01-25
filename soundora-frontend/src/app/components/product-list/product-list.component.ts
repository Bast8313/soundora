import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product, ProductsResponse } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // Données
  products: Product[] = [];
  total: number = 0;
  
  // Pagination
  currentPage: number = 1;
  limit: number = 12;
  totalPages: number = 0;
  
  // Filtres
  selectedCategory: string = '';
  selectedBrand: string = '';
  searchQuery: string = '';
  
  // État du chargement
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log(' ProductListComponent initialisé');
    // Écoute les changements de paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      console.log(' QueryParams reçus:', params);
      this.selectedCategory = params['category'] || '';
      this.selectedBrand = params['brand'] || '';
      this.searchQuery = params['search'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      console.log(' Filtres appliqués:', {
        category: this.selectedCategory,
        brand: this.selectedBrand,
        search: this.searchQuery,
        page: this.currentPage
      });
      this.loadProducts();
    });
  }

  // Charge les produits depuis l'API avec filtres
  loadProducts(): void {
    this.isLoading = true;
    this.error = '';

    // Construit l'objet de filtres
    const filters: any = {
      page: this.currentPage,
      limit: this.limit
    };

    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.selectedBrand) filters.brand = this.selectedBrand;
    if (this.searchQuery) filters.search = this.searchQuery;

    console.log('Chargement des produits avec filtres:', filters);

    this.productService.getProducts(filters.page, filters.limit, filters).subscribe({
      next: (response: ProductsResponse) => {
        console.log('Produits reçus:', response);
        // Le backend retourne {success: true, data: [...], pagination: {...}}
        this.products = response.data || response.products || [];
        this.total = response.pagination?.total || response.total || 0;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  // Change de page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo(0, 0); // Remonte en haut de la page
    }
  }

  // Navigation page suivante
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Navigation page précédente
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Génère un tableau pour les numéros de page
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Mapping des produits vers leurs images locales
   * Clé : modèle du produit (simplifié)
   * Valeur : nom du fichier image
   */
  private productImageMap: { [key: string]: string } = {
    'minilogue xd': 'korg-minilogue-xd.jpg',
    'export exx': 'pearl-export-exx.jpg',
    'fp-30x': 'roland-fp-30x.jpg',
    'classic vibe 60s jazz bass': 'squier-jazz-bass-60s.jpg',
    'imperialstar': 'tama-imperialstar.jpg',
    'p-125': 'yamaha-p-125.jpg',
    'trbx304': 'yamaha-trbx304.jpg',
    'a custom set': 'zildjian-a-custom.jpg',
    'player jazz bass': 'fender-jazz-bass.jpg',
    'player precision bass': 'fender-precision-bass.jpg',
    'sr500e': 'ibanez-sr500e.jpg'
  };

  /**
   * Génère une URL d'image pour chaque produit
   * Priorité : 1) Images locales, 2) Images BDD, 3) Placeholder coloré
   * @param product - Le produit pour lequel générer l'image
   * @returns URL de l'image
   */
  getProductImage(product: any): string {
    // 1. Vérifie d'abord si une image locale existe pour ce produit
    if (product.model) {
      const modelKey = product.model.toLowerCase();
      const localImage = this.productImageMap[modelKey];
      if (localImage) {
        return `assets/images/products/${localImage}`;
      }
    }

    // 2. Si le produit a une image valide en BDD, l'utilise
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    if (product.image_url) {
      return product.image_url;
    }

    // 3. Sinon, génère un placeholder coloré
    const colors = [
      'FF6B6B', 'F06292', 'BA68C8', '9575CD', '7986CB', '64B5F6',
      '4FC3F7', '4DD0E1', '4DB6AC', '81C784', 'AED581', 'DCE775',
      'FFD54F', 'FFB74D', 'FF8A65', 'A1887F', '90A4AE'
    ];
    
    let colorIndex = 0;
    if (product.id) {
      const hash = product.id.split('').reduce((acc: number, char: string) => 
        acc + char.charCodeAt(0), 0);
      colorIndex = hash % colors.length;
    }
    
    const bgColor = colors[colorIndex];
    const textColor = 'FFFFFF';
    
    let emoji = '🎵';
    if (product.category?.name) {
      const category = product.category.name.toLowerCase();
      if (category.includes('guitare') && !category.includes('basse')) emoji = '🎸';
      else if (category.includes('basse')) emoji = '🎸';
      else if (category.includes('batterie')) emoji = '🥁';
      else if (category.includes('clavier')) emoji = '🎹';
      else if (category.includes('piano')) emoji = '🎹';
      else if (category.includes('microphone')) emoji = '🎤';
      else if (category.includes('pédale')) emoji = '🎛️';
      else if (category.includes('ampli')) emoji = '🔊';
    }
    
    const brand = product.brand?.name || 'Soundora';
    const text = `${emoji} ${brand}`;
    
    return `https://via.placeholder.com/400x400/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Gère les erreurs de chargement d'image
   * Remplace l'image cassée par une image par défaut depuis Unsplash
   * @param event - Événement d'erreur de l'image
   */
  onImageError(event: any): void {
    // Remplace l'image cassée par une image par défaut d'instruments de musique
    event.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop';
  }
}
