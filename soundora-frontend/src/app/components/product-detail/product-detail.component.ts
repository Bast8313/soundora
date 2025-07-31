// IMPORTS NÉCESSAIRES POUR LE COMPOSANT DE DÉTAIL PRODUIT
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

/**
 * COMPOSANT DE DÉTAIL D'UN PRODUIT
 * Affiche toutes les informations détaillées d'un produit spécifique
 * Permet la sélection de quantité et l'ajout au panier avec notifications
 * Navigation via slug pour des URLs SEO-friendly
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  // PROPRIÉTÉS DU COMPOSANT
  product: any = null;           // Données du produit chargé depuis l'API
  error: string | null = null;   // Message d'erreur en cas de problème de chargement
  selectedQuantity: number = 1;  // Quantité sélectionnée par l'utilisateur (défaut: 1)

  /**
   * CONSTRUCTEUR - INJECTION DES DÉPENDANCES
   * Injecte tous les services nécessaires au fonctionnement du composant
   * 
   * @param route - Service pour accéder aux paramètres de l'URL courante
   * @param router - Service pour la navigation programmatique
   * @param productService - Service pour les opérations liées aux produits
   * @param cartService - Service pour la gestion du panier
   * @param notificationService - Service pour l'affichage des notifications
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  /**
   * INITIALISATION DU COMPOSANT
   * Récupère le slug depuis l'URL et charge les données du produit correspondant
   * Utilise getProductBySlug() pour une API cohérente avec le backend
   */
  ngOnInit() {
    // RÉCUPÉRATION DU SLUG DEPUIS L'URL
    // Ex: /product/gibson-les-paul-standard -> slug = "gibson-les-paul-standard"
    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (slug) {
      console.log('Chargement du produit avec slug:', slug);
      
      // APPEL API POUR CHARGER LE PRODUIT
      // Utilise getProductBySlug au lieu de getProductById pour correspondre à l'API backend
      this.productService.getProductBySlug(slug).subscribe({
        next: (response) => {
          // TRAITEMENT DE LA RÉPONSE API
          // L'API retourne { success: true, data: product }
          if (response.success && response.data) {
            this.product = response.data;
            console.log('Produit chargé:', this.product);
          } else {
            console.error('Réponse API invalide:', response);
            this.error = 'Produit introuvable';
          }
        },
        error: (error) => {
          // GESTION DES ERREURS DE CHARGEMENT
          console.error('Erreur lors du chargement du produit:', error);
          this.error = 'Produit introuvable';
        }
      });
    } else {
      // ERREUR SI AUCUN SLUG N'EST FOURNI DANS L'URL
      this.error = 'Aucun slug fourni dans l\'URL';
    }
  }

  /**
   * DÉTERMINE LE STATUT DU STOCK
   * Retourne un statut pour le styling CSS selon la disponibilité
   * 
   * @returns 'out' | 'low' | 'available' | 'unknown'
   */
  getStockStatus(): string {
    if (!this.product) return 'unknown';
    if (this.product.stock === 0) return 'out';        // Rupture de stock
    if (this.product.stock < 5) return 'low';          // Stock faible
    return 'available';                                 // Stock disponible
  }

  /**
   * GÉNÈRE LE TEXTE D'AFFICHAGE DU STOCK
   * Retourne un message utilisateur selon la disponibilité
   * 
   * @returns Message à afficher à l'utilisateur
   */
  getStockText(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Rupture de stock';
    if (this.product.stock < 5) return `Stock limité (${this.product.stock} restants)`;
    return 'En stock';
  }

  /**
   * DIMINUE LA QUANTITÉ SÉLECTIONNÉE
   * Décrémente la quantité avec limite minimale de 1
   */
  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  /**
   * AUGMENTE LA QUANTITÉ SÉLECTIONNÉE
   * Incrémente la quantité avec limite du stock disponible
   */
  increaseQuantity() {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  /**
   * AJOUTE UNE QUANTITÉ SÉLECTIONNÉE AU PANIER AVEC NOTIFICATION
   * Méthode améliorée avec gestion des erreurs et notification de succès
   * 
   * @param product - Produit à ajouter (provient de this.product dans le template)
   * @param quantity - Quantité à ajouter (provient de this.selectedQuantity)
   */
  addToCart(product: any, quantity: number = 1) {
    // VÉRIFICATIONS DE SÉCURITÉ AVANT AJOUT
    
    // 1. Vérification de l'existence du produit
    if (!product) {
      this.notificationService.error(
        'Erreur produit',
        'Impossible d\'ajouter au panier : produit non trouvé'
      );
      console.error('Tentative d\'ajout au panier sans produit valide');
      return;
    }
    
    // 2. Vérification de la quantité demandée
    if (quantity <= 0) {
      this.notificationService.warning(
        'Quantité invalide',
        'Veuillez sélectionner une quantité valide'
      );
      return;
    }
    
    // 3. Vérification du stock disponible
    if (product.stock === 0) {
      this.notificationService.showCartAddError(
        product.name,
        'Produit en rupture de stock'
      );
      return;
    }
    
    // 4. Vérification si la quantité demandée est disponible
    if (quantity > product.stock) {
      this.notificationService.showCartAddError(
        product.name,
        `Stock insuffisant. Seulement ${product.stock} exemplaire(s) disponible(s)`
      );
      return;
    }
    
    // AJOUT AU PANIER - Boucle pour ajouter la quantité demandée
    // Le CartService ajoute un item à la fois, donc on boucle pour la quantité
    for (let i = 0; i < quantity; i++) {
      this.cartService.addToCart(product);
    }
    
    // NOTIFICATION DE SUCCÈS avec bouton "Voir le panier"
    // showCartAddSuccess() gère automatiquement le format du message selon la quantité
    this.notificationService.showCartAddSuccess(
      product.name,
      quantity,
      () => {
        // Callback exécuté quand l'utilisateur clique "Voir le panier"
        this.router.navigate(['/cart']);
      }
    );
    
    // LOG POUR DEBUG avec informations détaillées
    console.log(`🛒 ${quantity} x "${product.name}" ajouté(s) au panier depuis la page détail`);
    
    // OPTIONNEL : Réinitialiser la quantité sélectionnée à 1 après ajout
    // this.selectedQuantity = 1;
  }

  /**
   * GESTION D'ERREUR D'IMAGE
   * Remplace par une image par défaut quand l'image principale ne peut pas se charger
   * 
   * @param event - Événement d'erreur du chargement d'image
   */
  onImageError(event: any) {
    // Remplacer par une image par défaut en cas d'erreur
    event.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
  }

  /**
   * EXTRAIT ET FORMATE LES SPÉCIFICATIONS TECHNIQUES
   * Convertit l'objet specifications en tableau pour l'affichage dans le template
   * 
   * @returns Tableau des spécifications formatées avec clé/valeur
   */
  getSpecifications() {
    if (!this.product?.specifications) return [];
    return Object.keys(this.product.specifications).map(key => ({
      key: this.formatSpecKey(key),
      value: this.product.specifications[key]
    }));
  }

  /**
   * FORMATE UNE CLÉ DE SPÉCIFICATION POUR L'AFFICHAGE
   * Transforme les clés techniques en format lisible (première lettre majuscule)
   * 
   * @param key - Clé de spécification brute
   * @returns Clé formatée pour l'affichage utilisateur
   */
  private formatSpecKey(key: string): string {
    // Formatter la clé pour l'affichage (première lettre en majuscule)
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  // EXPOSITION D'OBJECT POUR LE TEMPLATE
  // Permet l'utilisation d'Object.keys() directement dans le template HTML
  Object = Object;
}