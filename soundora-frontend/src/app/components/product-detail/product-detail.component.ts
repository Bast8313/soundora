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
   * Retourne l'URL de l'image du produit.
   * 
   * LOGIQUE :
   * - Si le produit a un tableau 'images', on prend la première
   * - Sinon on cherche 'image_url'
   * - Sinon on affiche une image placeholder
   */
  getProductImage(): string {
    if (!this.product) return 'assets/placeholder.jpg';
    
    // Si 'images' existe et contient au moins une image
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images[0];
    }
    
    // Sinon, essayer 'image_url'
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
