// ==========================================
// IMPORTS - On importe ce dont on a besoin
// ==========================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

/**
 * ==========================================
 * COMPOSANT CART (PANIER)
 * ==========================================
 * 
 * Ce composant affiche la page du panier d'achat.
 * 
 * RÔLE :
 * - Afficher tous les produits du panier
 * - Permettre de modifier les quantités
 * - Permettre de supprimer des produits
 * - Afficher le total
 * - Permettre de passer commande
 * 
 * CONCEPTS UTILISÉS :
 * - Subscription : écoute les changements du panier
 * - OnDestroy : nettoie la subscription quand on quitte la page
 * 
 * POUR LES ÉTUDIANTS :
 * Ce composant est un bon exemple de :
 * - Communication entre service et composant
 * - Gestion de l'état avec des Observables
 * - Nettoyage des ressources (unsubscribe)
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  // ==========================================
  // PROPRIÉTÉS DU COMPOSANT
  // ==========================================

  /**
   * Liste des articles dans le panier
   * On utilise le type CartItem[] défini dans le service
   */
  cartItems: CartItem[] = [];

  /**
   * Total du panier en euros
   */
  cartTotal: number = 0;

  /**
   * Subscription pour écouter les changements du panier
   * On la garde en mémoire pour pouvoir se désabonner plus tard
   */
  private cartSubscription!: Subscription;

  /**
   * Message de confirmation après une action
   */
  message: string = '';

  // ==========================================
  // CONSTRUCTEUR - Injection des dépendances
  // ==========================================

  /**
   * On injecte le CartService pour accéder au panier
   * 
   * INJECTION DE DÉPENDANCES :
   * Angular crée automatiquement une instance du service
   * et la "injecte" dans notre composant via le constructeur.
   */
  constructor(private cartService: CartService) {}

  // ==========================================
  // CYCLE DE VIE - ngOnInit
  // ==========================================

  /**
   * ngOnInit() est appelée une fois après la création du composant
   * C'est ici qu'on initialise les données
   */
  ngOnInit(): void {
    // On s'abonne aux changements du panier
    // À chaque modification, la fonction dans subscribe() est appelée
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  // ==========================================
  // CYCLE DE VIE - ngOnDestroy
  // ==========================================

  /**
   * ngOnDestroy() est appelée quand le composant est détruit
   * (par exemple quand on change de page)
   * 
   * IMPORTANT : Il faut toujours se désabonner des Observables
   * pour éviter les fuites de mémoire (memory leaks)
   */
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // ==========================================
  // MÉTHODES PRIVÉES
  // ==========================================

  /**
   * Calcule le total du panier
   * Appelée à chaque modification du panier
   */
  private calculateTotal(): void {
    this.cartTotal = this.cartService.getCartTotal();
  }

  // ==========================================
  // MÉTHODES PUBLIQUES (appelées depuis le template)
  // ==========================================

  /**
   * Augmente la quantité d'un produit de 1
   * 
   * @param item - L'article à modifier
   */
  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  /**
   * Diminue la quantité d'un produit de 1
   * Si la quantité atteint 0, le produit est retiré
   * 
   * @param item - L'article à modifier
   */
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    } else {
      // Si quantité = 1 et on diminue, on retire le produit
      this.removeItem(item);
    }
  }

  /**
   * Retire un produit du panier
   * 
   * @param item - L'article à retirer
   */
  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
    this.showMessage(`${item.name} retiré du panier`);
  }

  /**
   * Vide complètement le panier
   */
  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartService.clearCart();
      this.showMessage('Panier vidé');
    }
  }

  /**
   * Passe la commande (simulation)
   * 
   * POUR ALLER PLUS LOIN :
   * Ici, on pourrait :
   * - Vérifier que l'utilisateur est connecté
   * - Rediriger vers une page de paiement (Stripe)
   * - Créer une commande dans la base de données
   */
  checkout(): void {
    if (this.cartItems.length === 0) {
      this.showMessage('Votre panier est vide !');
      return;
    }

    // Simulation de commande
    const orderNumber = 'CMD-' + Date.now();
    
    alert(`🎉 Commande ${orderNumber} validée !\n\nTotal : ${this.cartTotal.toFixed(2)} €\n\nMerci pour votre achat !`);
    
    // Vide le panier après la commande
    this.cartService.clearCart();
  }

  /**
   * Affiche un message temporaire
   * 
   * @param text - Le message à afficher
   */
  private showMessage(text: string): void {
    this.message = text;
    // Le message disparaît après 3 secondes
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  /**
   * Retourne le chemin complet de l'image d'un produit
   * 
   * @param imageName - Nom du fichier image
   * @returns Le chemin complet vers l'image
   */
  getImagePath(imageName: string): string {
    return `assets/images/products/${imageName}`;
  }

  /**
   * Gère l'erreur de chargement d'image
   * Remplace par une image par défaut
   * 
   * @param event - L'événement d'erreur
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/products/default-product.jpg';
    }
  }
}
