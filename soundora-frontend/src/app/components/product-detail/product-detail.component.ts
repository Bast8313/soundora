// ==========================================
// IMPORTS - On importe ce dont on a besoin
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
// import { CartService } from '../../services/cart.service'; // Temporairement désactivé

/**
 * ==========================================
 * COMPOSANT PRODUCT-DETAIL
 * ==========================================
 * 
 * Ce composant affiche les détails d'un produit spécifique.
 * 
 * RÔLE :
 * - Récupérer l'ID du produit depuis l'URL
 * - Charger les informations du produit depuis l'API
 * - Afficher toutes les informations détaillées
 * - Permettre d'ajouter le produit au panier
 * 
 * CYCLE DE VIE :
 * 1. ngOnInit() : Récupère le slug depuis l'URL et charge le produit
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  
  // ==========================================
  // PROPRIÉTÉS DU COMPOSANT
  // ==========================================
  
  product: any = null;              // Le produit à afficher (null au début)
  loading: boolean = true;          // true = on charge les données
  error: string = '';               // Message d'erreur si problème
  addingToCart: boolean = false;    // true = ajout au panier en cours
  
  /**
   * ==========================================
   * MAPPING DES IMAGES PRODUITS (productImageMap)
   * ==========================================
   * 
   * POURQUOI CE MAPPING ?
   * ---------------------
   * Les images dans la BDD Supabase sont souvent des URLs fictives qui ne fonctionnent pas.
   * Ce mapping associe le champ "model" d'un produit à une image locale.
   * 
   * FONCTIONNEMENT :
   * - Clé : nom du modèle en MINUSCULES (ex: 'sm57')
   * - Valeur : nom du fichier image dans "assets/images/products/"
   * 
   * NOTE : Ce mapping est dupliqué dans product-list.component.ts
   *        Idéalement, il devrait être dans un service partagé.
   */
  private productImageMap: { [key: string]: string } = {
    // Claviers et synthés
    'minilogue xd': 'korg-minilogue-xd.jpg',
    'fp-30x': 'roland-fp-30x.jpg',
    'p-125': 'yamaha-p-125.jpg',
    // Batteries
    'export exx': 'pearl-export-exx.jpg',
    'imperialstar': 'tama-imperialstar.jpg',
    // Cymbales
    'a custom set': 'zildjian-a-custom.jpg',
    // Amplis guitare/basse
    'svt-7 pro': 'ampeg-svt-7-pro.jpg',
    'blues junior iv': 'fender-blues-junior-iv.jpg',
    'rumble 500': 'fender-rumble-500.jpg',
    'dsl40cr': 'marshall-dsl40cr.jpg',
    'jcm800 2203': 'marshall-jcm800-2203.jpg',
    'rockerverb 50 mkiii': 'orange-rockerverb-50-mkiii.jpg',
    'rocker 30': 'orange-rocker-30.jpg',
    'ac30c2': 'vox-ac30c2.jpg',
    // Pédales d'effets
    'ds-1': 'boss-ds1-distortion.jpg',
    'big muff pi': 'electro-harmonix-big-muff-pi.jpg',
    'phase 90': 'mxr-phase-90.jpg',
    'hall of fame 2': 'tc-electronic-hall-of-fame-2.jpg',
    // Microphones (URLs BDD fictives → images locales)
    'sm57': 'micro-shure-sm57-cable.jpg',         // Shure SM57
    'sm58': 'micro-shure-sm58-cable.jpg',         // Shure SM58
    'at2020': 'micro-audio-technica-at2020.jpg',  // Audio-Technica AT2020
    // Interfaces audio
    'scarlett 2i2 3rd gen': 'interface-focusrite-scarlett.jpg', // Focusrite Scarlett 2i2
    // Basses
    'classic vibe 60s jazz bass': 'squier-jazz-bass-60s.jpg',
    'trbx304': 'yamaha-trbx304.jpg',
    'player jazz bass': 'fender-jazz-bass.jpg',
    'player precision bass': 'fender-precision-bass.jpg',
    'sr500e': 'ibanez-sr500e.jpg',
    // Guitares
    'player jazzmaster': 'fender-jazzmaster.jpg',
    'explorer studio': 'gibson-explorer.jpg',
    'se custom 24': 'prs-se-custom-24.jpg',
    'classic vibe 70s stratocaster': 'squier-stratocaster-70s.jpg',
    'rg550': 'ibanez-rg550.jpg',
    'gibson-les paul standard 50s': 'gibson-les-paul-50s.jpg',
    'epiphone-les paul standard 50s': 'epiphone-les-paul-50s.jpg'
  };
  
  /**
   * CONSTRUCTEUR : Injection de dépendances
   * 
   * @param route - Pour récupérer les paramètres de l'URL (le slug)
   * @param router - Pour naviguer vers d'autres pages
   * @param productService - Pour récupérer les données du produit
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
    // private cartService: CartService // Temporairement désactivé
  ) {}

  /**
   * ==========================================
   * MÉTHODE ngOnInit()
   * ==========================================
   * 
   * Appelée automatiquement par Angular au démarrage du composant.
   * 
   * FONCTIONNEMENT :
   * 1. Récupère le "slug" depuis l'URL (exemple : /product/gibson-les-paul)
   * 2. Utilise ce slug pour charger les données du produit
   */
  ngOnInit(): void {
    // Récupérer le paramètre "slug" de l'URL
    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (slug) {
      this.loadProduct(slug);
    } else {
      this.error = 'Aucun produit spécifié';
      this.loading = false;
    }
  }

  /**
   * ==========================================
   * MÉTHODE loadProduct()
   * ==========================================
   * 
   * Charge les données du produit depuis l'API.
   * 
   * @param slug - L'identifiant unique du produit (exemple: "gibson-les-paul")
   */
  loadProduct(slug: string): void {
    this.loading = true;
    
    // Appel au service pour récupérer le produit
    this.productService.getProductBySlug(slug).subscribe({
      // Si la requête réussit
      next: (data) => {
        this.product = data;
        this.loading = false;
        console.log('Produit chargé:', this.product);
      },
      // Si la requête échoue
      error: (err) => {
        console.error('Erreur chargement produit:', err);
        this.error = 'Impossible de charger le produit';
        this.loading = false;
      }
    });
  }

  /**
   * ==========================================
   * MÉTHODE getProductImage()
   * ==========================================
   * 
   * RÔLE : Retourne l'URL de l'image principale du produit.
   * 
   * ORDRE DE PRIORITÉ :
   * -------------------
   * 1. IMAGE LOCALE (via productImageMap)
   *    - Recherche le modèle du produit dans le mapping
   *    - Retourne le chemin vers l'image locale si trouvée
   * 
   * 2. IMAGE EN BASE DE DONNÉES (Supabase)
   *    - Utilise l'URL stockée dans le champ "images"
   *    - FILTRE les URLs fictives connues (shure.com, focusrite.com, etc.)
   * 
   * 3. IMAGE_URL (compatibilité ancienne structure)
   *    - Certains produits peuvent avoir un champ "image_url" au lieu de "images"
   * 
   * 4. PLACEHOLDER (fallback)
   *    - Image par défaut si aucune autre option disponible
   * 
   * @returns string - L'URL de l'image à afficher
   */
  getProductImage(): string {
    // Si le produit n'est pas encore chargé, afficher le placeholder
    if (!this.product) return 'assets/placeholder.jpg';
    
    // =====================================================
    // ÉTAPE 1 : Chercher une image locale dans le mapping
    // =====================================================
    if (this.product.model) {
      // Convertir le modèle en minuscules (les clés du mapping sont en minuscules)
      const modelKey = this.product.model.toLowerCase();
      
      // -------------------------------------------------
      // CAS SPÉCIAL : Les Paul (Gibson vs Epiphone)
      // -------------------------------------------------
      // Même modèle mais marques différentes → images différentes
      if (modelKey === 'les paul standard 50s' && this.product.brand?.name) {
        const brandKey = `${this.product.brand.name.toLowerCase()}-${modelKey}`;
        const localImage = this.productImageMap[brandKey];
        if (localImage) {
          return `assets/images/products/${localImage}`;
        }
      }
      
      // -------------------------------------------------
      // CAS NORMAL : Recherche par modèle
      // -------------------------------------------------
      const localImage = this.productImageMap[modelKey];
      if (localImage) {
        return `assets/images/products/${localImage}`;
      }
    }
    
    // =====================================================
    // ÉTAPE 2 : Utiliser l'image de la base de données
    // =====================================================
    // Vérifier si le produit a des images en BDD
    if (this.product.images && this.product.images.length > 0 && this.product.images[0]) {
      const url = this.product.images[0];
      
      // IMPORTANT : Filtrer les URLs fictives qui ne fonctionnent pas
      // Ces URLs ont été mises en BDD mais ne pointent vers aucune vraie image
      const fakeUrlDomains = ['shure.com', 'focusrite.com', 'audio-technica.com'];
      const isFakeUrl = fakeUrlDomains.some(domain => url.includes(domain));
      
      if (!isFakeUrl) {
        return url;
      }
    }
    
    // =====================================================
    // ÉTAPE 3 : Fallback sur image_url (ancienne structure)
    // =====================================================
    if (this.product.image_url) {
      return this.product.image_url;
    }
    
    // Par défaut, image placeholder
    return 'assets/placeholder.jpg';
  }

  /**
   * ==========================================
   * MÉTHODE addToCart()
   * ==========================================
   * 
   * Ajoute le produit au panier.
   * 
   * FONCTIONNEMENT :
   * 1. Active le loader (addingToCart = true)
   * 2. Appelle le service pour ajouter au panier
   * 3. Affiche un message de succès ou d'erreur
   */
  addToCart(): void {
    if (!this.product) return;
    
    this.addingToCart = true;
    
    // TODO: Réactiver quand CartService sera disponible
    alert('Produit ajouté au panier ! (fonctionnalité en cours de développement)');
    this.addingToCart = false;
    
    /* Temporairement désactivé - problème de cache TypeScript
    // Appel au service panier
    this.cartService.addToCart(this.product.id, 1).subscribe({
      // Si l'ajout réussit
      next: (response: any) => {
        console.log('Produit ajouté au panier:', response);
        this.addingToCart = false;
        alert('Produit ajouté au panier !');
      },
      // Si l'ajout échoue
      error: (err: any) => {
        console.error('Erreur ajout panier:', err);
        this.addingToCart = false;
        alert('Erreur lors de l\'ajout au panier');
      }
    });
    */
  }

  /**
   * ==========================================
   * MÉTHODE goBack()
   * ==========================================
   * 
   * Retourne à la liste des produits.
   */
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
