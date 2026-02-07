// ==========================================
// IMPORTS - On importe ce dont on a besoin
// ==========================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { StripeService } from '../../services/stripe.service';
import { AuthService } from '../../services/auth.service';

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

  /**
   * Indique si un paiement est en cours
   * Permet de désactiver le bouton pendant le traitement
   */
  isProcessing: boolean = false;

  // ==========================================
  // CONSTRUCTEUR - Injection des dépendances
  // ==========================================

  /**
   * On injecte les services nécessaires :
   * - CartService : accès au panier
   * - StripeService : gestion des paiements
   * - AuthService : vérification connexion utilisateur
   * - Router : navigation entre les pages
   */
  constructor(
    private cartService: CartService,
    private stripeService: StripeService,
    private authService: AuthService,
    private router: Router
  ) {}

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
   * Lance le processus de paiement Stripe
   * 
   * PROCESSUS COMPLET :
   * 1. Vérifie que l'utilisateur est connecté
   * 2. Vérifie que le panier n'est pas vide
   * 3. Appelle le backend pour créer une session Stripe
   * 4. Redirige vers la page de paiement Stripe
   * 5. Après paiement, Stripe redirige vers success/cancel
   */
  checkout(): void {
    // Vérification panier vide
    if (this.cartItems.length === 0) {
      this.showMessage('Votre panier est vide !');
      return;
    }

    // Vérification utilisateur connecté
    if (!this.authService.isLoggedIn()) {
      this.showMessage('Veuillez vous connecter pour passer commande');
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    // Évite les doubles clics
    if (this.isProcessing) {
      return;
    }

    // Lance le paiement
    this.isProcessing = true;
    this.showMessage('Préparation du paiement...');

    // Appel au service Stripe
    this.stripeService.createCheckoutSession(this.cartItems).subscribe({
      next: (response) => {
        if (response.success && response.url) {
          // Redirection vers Stripe Checkout
          this.showMessage('Redirection vers le paiement sécurisé...');
          this.stripeService.redirectToCheckout(response.url);
        } else {
          this.isProcessing = false;
          this.showMessage(response.error || 'Erreur lors de la création du paiement');
        }
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Erreur Stripe:', error);
        this.showMessage(error.message || 'Erreur lors du paiement');
      }
    });
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
