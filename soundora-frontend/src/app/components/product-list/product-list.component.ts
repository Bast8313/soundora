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
   * ==========================================
   * MAPPING DES IMAGES PRODUITS (productImageMap)
   * ==========================================
   * 
   * POURQUOI CE MAPPING ?
   * ---------------------
   * Les images des produits dans la base de données Supabase sont souvent
   * des URLs fictives (ex: "https://shure.com/sm57-1.jpg") qui ne fonctionnent pas.
   * 
   * Ce mapping permet d'associer le champ "model" d'un produit (ex: "SM57")
   * à une image locale stockée dans "assets/images/products/".
   * 
   * COMMENT ÇA MARCHE ?
   * -------------------
   * - Clé (key) : Le nom du modèle EN MINUSCULES (ex: 'sm57')
   * - Valeur (value) : Le nom du fichier image (ex: 'micro-shure-sm57-cable.jpg')
   * 
   * EXEMPLE :
   * ---------
   * Un produit avec model="SM57" sera converti en 'sm57' (toLowerCase)
   * puis on cherche 'sm57' dans ce mapping → on trouve 'micro-shure-sm57-cable.jpg'
   * → l'image affichée sera "assets/images/products/micro-shure-sm57-cable.jpg"
   * 
   * POUR AJOUTER UN NOUVEAU PRODUIT :
   * ---------------------------------
   * 1. Ajouter l'image dans "soundora-frontend/src/assets/images/products/"
   * 2. Ajouter une entrée ici : 'nom-du-modele-en-minuscules': 'nom-du-fichier.jpg'
   */
  private productImageMap: { [key: string]: string } = {
    // =====================
    // CLAVIERS ET SYNTHÉS
    // =====================
    'minilogue xd': 'korg-minilogue-xd.jpg',      // Korg Minilogue XD
    'fp-30x': 'roland-fp-30x.jpg',                // Roland FP-30X
    'p-125': 'yamaha-p-125.jpg',                  // Yamaha P-125
    
    // =====================
    // BATTERIES
    // =====================
    'export exx': 'pearl-export-exx.jpg',         // Pearl Export EXX
    'imperialstar': 'tama-imperialstar.jpg',      // Tama Imperialstar
    
    // =====================
    // CYMBALES
    // =====================
    'a custom set': 'zildjian-a-custom.jpg',      // Zildjian A Custom Set
    
    // =====================
    // AMPLIS GUITARE/BASSE
    // =====================
    'svt-7 pro': 'ampeg-svt-7-pro.jpg',           // Ampeg SVT-7 Pro (basse)
    'blues junior iv': 'fender-blues-junior-iv.jpg', // Fender Blues Junior IV
    'rumble 500': 'fender-rumble-500.jpg',        // Fender Rumble 500 (basse)
    'dsl40cr': 'marshall-dsl40cr.jpg',            // Marshall DSL40CR
    'jcm800 2203': 'marshall-jcm800-2203.jpg',    // Marshall JCM800 2203
    'rockerverb 50 mkiii': 'orange-rockerverb-50-mkiii.jpg', // Orange Rockerverb 50
    'rocker 30': 'orange-rocker-30.jpg',          // Orange Rocker 30
    'ac30c2': 'vox-ac30c2.jpg',                   // Vox AC30C2
    
    // =====================
    // PÉDALES D'EFFETS
    // =====================
    'ds-1': 'boss-ds1-distortion.jpg',            // Boss DS-1 Distortion
    'big muff pi': 'electro-harmonix-bigmuff-pi.jpg', // Electro-Harmonix Big Muff
    'phase 90': 'mxr-phase-90.jpg',               // MXR Phase 90
    'hall of fame 2': 'tc-electronic-hall-of-fame-2.jpg', // TC Electronic Hall of Fame
    
    // =====================
    // MICROPHONES
    // =====================
    // Ces entrées ont été ajoutées car les URLs en BDD (shure.com, etc.) sont fictives
    'sm57': 'micro-shure-sm57-cable.jpg',         // Shure SM57 - Micro dynamique instrument
    'sm58': 'micro-shure-sm58-cable.jpg',         // Shure SM58 - Micro dynamique vocal
    'at2020': 'micro-audio-technica-at2020.jpg',  // Audio-Technica AT2020 - Micro condensateur
    
    // =====================
    // INTERFACES AUDIO
    // =====================
    'scarlett 2i2 3rd gen': 'interface-focusrite-scarlett.jpg', // Focusrite Scarlett 2i2
    
    // =====================
    // BASSES
    // =====================
    'classic vibe 60s jazz bass': 'squier-classic-vibe-60s-jazz-bass.jpg', // Squier Jazz Bass 60s
    'trbx304': 'yamaha-trbx304.jpg',              // Yamaha TRBX304
    'player jazz bass': 'fender-jazz-bass.jpg',   // Fender Player Jazz Bass
    'player precision bass': 'fender-precision-bass.jpg', // Fender Player Precision Bass
    'sr500e': 'ibanez-sr500e.jpg',                // Ibanez SR500E
    
    // =====================
    // GUITARES
    // =====================
    'player jazzmaster': 'fender-player-jazz-master.jpg', // Fender Player Jazzmaster
    'explorer studio': 'gibson-explorer.jpg',     // Gibson Explorer Studio
    'se custom 24': 'prs-se-custom-24.jpg',       // PRS SE Custom 24
    'classic vibe 70s stratocaster': 'squier-stratocaster-70s.jpg', // Squier Strat 70s
    'rg550': 'ibanez-rg-550.jpg',                 // Ibanez RG550
    'ltd ec-1000': 'esp-ltd-ec-1000.jpg',         // ESP LTD EC-1000
    'american professional ii stratocaster': 'fender-american-professional-2-stratocaster.jpg', // Fender Am Pro II Strat
    'sg standard 61': 'gibson-sg-standard-61.jpg', // Gibson SG Standard 61
    // Cas spéciaux : même modèle mais marques différentes (voir getProductImage)
    'gibson-les paul standard 50s': 'gibson-les-paul-50s.jpg',     // Gibson Les Paul
    'epiphone-les paul standard 50s': 'epiphone-les-paul-50s.jpg'  // Epiphone Les Paul
  };

  /**
   * ==========================================
   * MÉTHODE getProductImage()
   * ==========================================
   * 
   * RÔLE : Retourne l'URL de l'image à afficher pour un produit donné.
   * 
   * ORDRE DE PRIORITÉ :
   * -------------------
   * 1. IMAGE LOCALE (via productImageMap) → Priorité maximale
   *    - On cherche le modèle du produit dans notre mapping
   *    - Si trouvé, on utilise l'image locale (fiable, rapide)
   * 
   * 2. IMAGE EN BASE DE DONNÉES (Supabase)
   *    - Si pas d'image locale, on utilise l'URL stockée en BDD
   *    - ⚠️ Peut ne pas fonctionner si l'URL est invalide/fictive
   * 
   * 3. PLACEHOLDER COLORÉ (fallback)
   *    - Si aucune image disponible, génère un placeholder
   *    - Couleur basée sur l'ID du produit (cohérence visuelle)
   *    - Emoji basé sur la catégorie (🎸 guitare, 🎹 clavier, etc.)
   * 
   * @param product - L'objet produit contenant name, model, images, category, etc.
   * @returns string - L'URL de l'image à utiliser
   */
  getProductImage(product: any): string {
    
    // =====================================================
    // ÉTAPE 1 : Chercher une image locale dans le mapping
    // =====================================================
    // On vérifie si le produit a un champ "model" (ex: "SM57", "Scarlett 2i2 3rd Gen")
    if (product.model) {
      // Convertir en minuscules pour la recherche (le mapping utilise des clés en minuscules)
      const modelKey = product.model.toLowerCase();
      
      // -------------------------------------------------
      // CAS SPÉCIAL : Les Paul (Gibson vs Epiphone)
      // -------------------------------------------------
      // Le modèle "Les Paul Standard 50s" existe chez Gibson ET Epiphone
      // On doit donc différencier avec le nom de la marque
      if (modelKey === 'les paul standard 50s' && product.brand?.name) {
        // Créer une clé unique : "gibson-les paul standard 50s" ou "epiphone-les paul standard 50s"
        const brandKey = `${product.brand.name.toLowerCase()}-${modelKey}`;
        const localImage = this.productImageMap[brandKey];
        if (localImage) {
          // Image trouvée ! On log pour le debug et on retourne le chemin complet
          console.log(`✅ Image locale trouvée pour ${product.name}: ${localImage}`);
          return `assets/images/products/${localImage}`;
        }
      }
      
      // -------------------------------------------------
      // CAS NORMAL : Recherche par modèle uniquement
      // -------------------------------------------------
      const localImage = this.productImageMap[modelKey];
      if (localImage) {
        console.log(`✅ Image locale trouvée pour ${product.name}: ${localImage}`);
        return `assets/images/products/${localImage}`;
      }
    }

    // =====================================================
    // ÉTAPE 2 : Utiliser l'image de la base de données
    // =====================================================
    // Si pas d'image locale, on essaie d'utiliser l'URL stockée en Supabase
    // Le champ "images" est un tableau (peut contenir plusieurs images)
    if (product.images && product.images.length > 0 && product.images[0]) {
      console.log(`⚠️ Utilisation image BDD pour ${product.name}: ${product.images[0]}`);
      return product.images[0];
    }

    // =====================================================
    // ÉTAPE 3 : Générer un placeholder coloré (fallback)
    // =====================================================
    // Aucune image disponible → on crée un placeholder visuel
    console.log(`📦 Génération placeholder pour ${product.name}`);
    
    // Palette de couleurs variées pour les placeholders
    const colors = [
      'FF6B6B', 'F06292', 'BA68C8', '9575CD', '7986CB', '64B5F6',
      '4FC3F7', '4DD0E1', '4DB6AC', '81C784', 'AED581', 'DCE775',
      'FFD54F', 'FFB74D', 'FF8A65', 'A1887F', '90A4AE'
    ];
    
    // Calculer un index de couleur basé sur l'ID du produit
    // Ainsi, un même produit aura toujours la même couleur de placeholder
    let colorIndex = 0;
    if (product.id) {
      // Convertir l'ID (UUID) en nombre en additionnant les codes ASCII de chaque caractère
      const hash = product.id.split('').reduce((acc: number, char: string) => 
        acc + char.charCodeAt(0), 0);
      // Utiliser le modulo pour rester dans les limites du tableau de couleurs
      colorIndex = hash % colors.length;
    }
    
    const bgColor = colors[colorIndex];
    const textColor = 'FFFFFF';
    
    // Choisir un emoji selon la catégorie du produit
    let emoji = '🎵'; // Emoji par défaut (musique)
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
