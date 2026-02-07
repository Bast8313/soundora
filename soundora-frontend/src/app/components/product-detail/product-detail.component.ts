// ==========================================
// IMPORTS - On importe ce dont on a besoin
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

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
  imports: [CommonModule, RouterModule],
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
  cartMessage: string = '';         // Message après ajout au panier
  
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
    'big muff pi': 'electro-harmonix-bigmuff-pi.jpg',
    'phase 90': 'mxr-phase-90.jpg',
    'hall of fame 2': 'tc-electronic-hall-of-fame-2.jpg',
    // Microphones (URLs BDD fictives → images locales)
    'sm57': 'micro-shure-sm57-cable.jpg',         // Shure SM57
    'sm58': 'micro-shure-sm58-cable.jpg',         // Shure SM58
    'at2020': 'micro-audio-technica-at2020.jpg',  // Audio-Technica AT2020
    // Interfaces audio
    'scarlett 2i2 3rd gen': 'interface-focusrite-scarlett.jpg', // Focusrite Scarlett 2i2
    // Basses
    'classic vibe 60s jazz bass': 'squier-classic-vibe-60s-jazz-bass.jpg',
    'trbx304': 'yamaha-trbx304.jpg',
    'player jazz bass': 'fender-jazz-bass.jpg',
    'player precision bass': 'fender-precision-bass.jpg',
    'sr500e': 'ibanez-sr500e.jpg',
    // Guitares
    'player jazzmaster': 'fender-player-jazz-master.jpg',
    'explorer studio': 'gibson-explorer.jpg',
    'se custom 24': 'prs-se-custom-24.jpg',
    'classic vibe 70s stratocaster': 'squier-stratocaster-70s.jpg',
    'rg550': 'ibanez-rg-550.jpg',
    'gibson-les paul standard 50s': 'gibson-les-paul-50s.jpg',
    'epiphone-les paul standard 50s': 'epiphone-les-paul-50s.jpg',
    'ltd ec-1000': 'esp-ltd-ec-1000.jpg',
    'american professional ii stratocaster': 'fender-american-professional-2-stratocaster.jpg',
    'sg standard 61': 'gibson-sg-standard-61.jpg'
  };
  
  /**
   * CONSTRUCTEUR : Injection de dépendances
   * 
   * @param route - Pour récupérer les paramètres de l'URL (le slug)
   * @param router - Pour naviguer vers d'autres pages
   * @param productService - Pour récupérer les données du produit
   * @param cartService - Pour ajouter le produit au panier
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
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
    // 
    // EXPLICATION POUR UN ÉTUDIANT :
    // ------------------------------
    // On a créé un "dictionnaire" (productImageMap) qui associe 
    // le nom d'un modèle à son fichier image.
    // 
    // Exemple : 'classic vibe 60s jazz bass' → 'squier-classic-vibe-60s-jazz-bass.jpg'
    // 
    // Cette approche est plus fiable que les URLs en base de données
    // car les images sont stockées LOCALEMENT dans notre projet.
    // =====================================================
    
    if (this.product.model) {
      // Convertir le modèle en minuscules pour uniformiser la recherche
      // "Classic Vibe 60s Jazz Bass" devient "classic vibe 60s jazz bass"
      const modelKey = this.product.model.toLowerCase();
      
      // LOG DE DEBUG : Affiche ce qu'on cherche dans la console du navigateur (F12)
      console.log(`🔍 Recherche image pour modèle: "${modelKey}"`);
      
      // -------------------------------------------------
      // CAS SPÉCIAL : Les Paul (Gibson vs Epiphone)
      // -------------------------------------------------
      // Même modèle mais marques différentes → images différentes
      if (modelKey === 'les paul standard 50s' && this.product.brand?.name) {
        const brandKey = `${this.product.brand.name.toLowerCase()}-${modelKey}`;
        const localImage = this.productImageMap[brandKey];
        if (localImage) {
          console.log(`✅ Image locale trouvée (Les Paul): ${localImage}`);
          return `assets/images/products/${localImage}`;
        }
      }
      
      // -------------------------------------------------
      // CAS NORMAL : Recherche par modèle uniquement
      // -------------------------------------------------
      const localImage = this.productImageMap[modelKey];
      if (localImage) {
        // Image trouvée dans notre mapping local !
        console.log(`✅ Image locale trouvée: ${localImage}`);
        return `assets/images/products/${localImage}`;
      } else {
        // Pas trouvée : on affiche les clés disponibles pour debug
        console.log(`❌ Modèle "${modelKey}" non trouvé dans le mapping`);
        console.log(`📋 Clés disponibles:`, Object.keys(this.productImageMap));
      }
    }
    
    // =====================================================
    // ÉTAPE 2 : Utiliser l'image de la base de données
    // =====================================================
    // Vérifier si le produit a des images en BDD
    if (this.product.images && this.product.images.length > 0 && this.product.images[0]) {
      const url = this.product.images[0];
      
      // =========================================================
      // IMPORTANT : Filtrer les URLs fictives qui ne fonctionnent pas
      // =========================================================
      // 
      // EXPLICATION POUR UN ÉTUDIANT :
      // ------------------------------
      // En base de données (Supabase), chaque produit a un champ "images"
      // qui contient des URLs vers des photos. 
      // 
      // PROBLÈME : Lors de la création des données de test, on a mis des 
      // URLs "fictives" qui ressemblent à de vraies URLs mais qui n'existent pas.
      // Exemple : "https://squier.com/cv-60s-jbass-1.jpg" → cette page n'existe pas !
      // 
      // SOLUTION : On crée une liste de tous les domaines fictifs connus,
      // et si l'URL contient un de ces domaines, on l'ignore pour utiliser
      // plutôt notre image locale (stockée dans assets/images/products/).
      // 
      // C'est comme avoir une "liste noire" de sources non fiables !
      // =========================================================
      const fakeUrlDomains = [
        // Marques de micros et interfaces
        'shure.com', 
        'focusrite.com', 
        'audio-technica.com',
        // Marques de guitares et basses
        'squier.com',
        'fender.com',
        'gibson.com',
        'epiphone.com',
        'prs.com',
        'ibanez.com',
        'espguitars.com',
        // Marques d'amplis
        'marshall.com',
        'vox.com',
        'orange.com',
        'ampeg.com',
        // Marques de pédales
        'tcelectronic.com',
        'ehx.com',
        'mxr.com',
        'boss.com',
        // Marques de batteries et cymbales
        'pearldrums.com',
        'tama.com',
        'zildjian.com',
        // Marques de claviers
        'roland.com',
        'yamaha.com',
        'korg.com'
      ];
      
      // La méthode .some() vérifie si AU MOINS UN élément du tableau
      // satisfait la condition. Ici : est-ce que l'URL contient un domaine fictif ?
      const isFakeUrl = fakeUrlDomains.some(domain => url.includes(domain));
      
      // Si l'URL n'est PAS fictive, on peut l'utiliser en toute confiance
      if (!isFakeUrl) {
        return url;
      }
      // Sinon, on continue vers le fallback (placeholder)
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
   * 1. Vérifie que le produit existe
   * 2. Prépare l'objet produit avec l'image locale
   * 3. Appelle le CartService pour ajouter au panier
   * 4. Affiche un message de confirmation
   * 
   * POUR LES ÉTUDIANTS :
   * Cette méthode est appelée quand on clique sur "Ajouter au panier"
   * dans le template HTML via (click)="addToCart()"
   */
  addToCart(): void {
    // Vérification : le produit doit être chargé
    if (!this.product) return;
    
    // Active le loader pour le bouton
    this.addingToCart = true;
    
    // Prépare l'objet produit pour le panier
    // On inclut l'image locale pour l'afficher dans le panier
    const productForCart = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      slug: this.product.slug,
      image: this.getLocalImageName() // Nom du fichier image local
    };
    
    // Ajoute au panier via le service
    this.cartService.addToCart(productForCart, 1);
    
    // Affiche le message de confirmation
    this.cartMessage = `✅ ${this.product.name} ajouté au panier !`;
    
    // Désactive le loader
    this.addingToCart = false;
    
    // Le message disparaît après 3 secondes
    setTimeout(() => {
      this.cartMessage = '';
    }, 3000);
  }

  /**
   * ==========================================
   * MÉTHODE getLocalImageName()
   * ==========================================
   * 
   * Retourne le nom du fichier image local pour le panier.
   * Utilisé pour stocker l'image correcte dans le panier.
   * 
   * @returns string - Nom du fichier image
   */
  private getLocalImageName(): string {
    if (!this.product?.model) return 'default-product.jpg';
    
    const modelKey = this.product.model.toLowerCase();
    
    // Cas spécial Les Paul
    if (modelKey === 'les paul standard 50s' && this.product.brand?.name) {
      const brandKey = `${this.product.brand.name.toLowerCase()}-${modelKey}`;
      return this.productImageMap[brandKey] || 'default-product.jpg';
    }
    
    return this.productImageMap[modelKey] || 'default-product.jpg';
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
