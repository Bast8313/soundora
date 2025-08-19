// =====================================
// IMPORTS POUR LE COMPOSANT PANIER AMÉLIORÉ
// =====================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Directives Angular de base (ngFor, ngIf, etc.)
import { FormsModule } from '@angular/forms'; // NOUVEAU : Pour ngModel (liaison bidirectionnelle)
import { CartService } from '../../services/cart.service'; // Service de gestion du panier existant
import { CheckoutService, CheckoutItem } from '../../services/checkout.service'; // NOUVEAU : Service de checkout Stripe

/**
 * COMPOSANT PANIER D'ACHAT AVEC CHECKOUT INTÉGRÉ
 * 
 * FONCTIONNALITÉS EXISTANTES :
 * - Affichage des articles du panier
 * - Modification des quantités
 * - Calcul du total
 * - Suppression d'articles
 * 
 *   NOUVELLES FONCTIONNALITÉS AJOUTÉES :
 * - Saisie d'email pour la facturation
 * - Bouton de checkout vers Stripe
 * - Gestion des états de chargement
 * - Validation des données avant paiement
 * - Transformation des données pour Stripe
 */
@Component({
  selector: 'app-cart',
  standalone: true, // Composant autonome (Angular 14+)
  imports: [CommonModule, FormsModule], // MODIFIÉ : Ajout FormsModule pour ngModel
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  // =====================================
  // PROPRIÉTÉS DU COMPOSANT
  // =====================================
  items: any[] = []; // EXISTANT : Tableau des articles dans le panier
  
  // NOUVELLES PROPRIÉTÉS POUR LE CHECKOUT :
  customerEmail: string = '';    // Email saisi par l'utilisateur (requis par Stripe)
  isProcessing: boolean = false; // État du processus de checkout (pour désactiver le bouton)

  /**
   * CONSTRUCTEUR AMÉLIORÉ - INJECTION DES SERVICES
   * 
   * MODIFICATION : Ajout du service de checkout
   * 
   * @param cartService - EXISTANT : Service pour gérer les opérations du panier
   * @param checkoutService - NOUVEAU : Service pour gérer le processus de paiement Stripe
   */
  constructor(
    private cartService: CartService,      // Service existant pour le panier
    private checkoutService: CheckoutService // NOUVEAU : Service pour Stripe checkout
  ) { }

  // =====================================
  // MÉTHODES DU CYCLE DE VIE ANGULAR
  // =====================================

  /**
   * INITIALISATION DU COMPOSANT
   * MÉTHODE EXISTANTE : Charge les articles du panier au démarrage
   */
  ngOnInit() {
    this.items = this.cartService.getItems(); // Récupération des articles du panier
  }

  // =====================================
  // MÉTHODES DE GESTION DU PANIER (EXISTANTES)
  // =====================================

  /**
   * MÉTHODE EXISTANTE : SUPPRIME UN ARTICLE DU PANIER
   * Retire l'article et met à jour l'affichage
   * @param item - Article à supprimer
   */
  removeFromCart(item: any) {
    this.cartService.removeFromCart(item); // Suppression via le service
    this.items = this.cartService.getItems(); // Rechargement de la liste mise à jour
  }

  /**
   * MÉTHODE EXISTANTE : CALCULE LE PRIX TOTAL DU PANIER
   * Additionne prix × quantité pour chaque article
   * @returns Prix total en euros
   */
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  // =====================================
  // NOUVELLE MÉTHODE : PROCESSUS DE CHECKOUT STRIPE
  // =====================================

  /**
   * NOUVELLE FONCTIONNALITÉ : PROCÈDE AU CHECKOUT AVEC STRIPE
   * 
   * Cette méthode est le POINT D'ENTRÉE du processus de paiement.
   * Elle orchestre toute la séquence de checkout.
   * 
   * PROCESSUS COMPLET :
   * 
   * 1. VALIDATIONS PRÉALABLES
   *    ✓ Vérifier que l'email est saisi
   *    ✓ Vérifier que le panier n'est pas vide
   * 
   * 2. ÉTAT DE CHARGEMENT
   *    ✓ Désactiver le bouton (éviter double-clic)
   *    ✓ Afficher "Redirection..." à l'utilisateur
   * 
   * 3. TRANSFORMATION DES DONNÉES
   *    ✓ Convertir les articles du panier au format Stripe
   *    ✓ Assurer la compatibilité avec l'API backend
   * 
   * 4. APPEL DU SERVICE DE CHECKOUT
   *    ✓ Envoyer les données au backend
   *    ✓ Backend crée une session Stripe
   *    ✓ Récupérer l'URL de paiement
   * 
   * 5. GESTION DES RÉPONSES
   *    ✓ Succès → Redirection automatique vers Stripe
   *    ✓ Erreur → Message + reset du bouton
   * 
   * EXEMPLE DE FLUX :
   * Panier [SM58, SM57] + email → Service → Backend → Stripe → Page paiement
   */
  proceedToCheckout(): void {
    // ==========================================
    // ÉTAPE 1 : VALIDATIONS PRÉALABLES
    // ==========================================
    if (!this.customerEmail || this.items.length === 0) {
      alert('Veuillez saisir un email et avoir des articles dans le panier');
      return;
    }

    // ==========================================
    // ÉTAPE 2 : ACTIVATION DE L'ÉTAT DE CHARGEMENT
    // ==========================================
    this.isProcessing = true; // Désactive le bouton et change le texte

    // ==========================================
    // ÉTAPE 3 : TRANSFORMATION DES DONNÉES POUR STRIPE
    // ==========================================
    // Convertir les articles du panier au format CheckoutItem (interface définie)
    // Cette transformation assure la compatibilité avec l'API Stripe
    const checkoutItems: CheckoutItem[] = this.items.map(item => ({
      id: item.id,                    // ID du produit en base
      name: item.name,                // Nom affiché sur la facture Stripe
      price: item.price,              // Prix unitaire en euros
      quantity: item.quantity || 1    // Quantité (défaut: 1 si undefined)
    }));

    // ==========================================
    // ÉTAPE 4 : APPEL DU SERVICE DE CHECKOUT
    // ==========================================
    // Utilise le service pour communiquer avec le backend
    // Le backend va créer une session Stripe et renvoyer l'URL de paiement
    this.checkoutService.createCheckoutSession(checkoutItems, this.customerEmail)
      .subscribe({
        // ==========================================
        // GESTION DU SUCCÈS
        // ==========================================
        next: (response) => {
          if (response.success && response.checkoutUrl) {
            // SESSION CRÉÉE AVEC SUCCÈS
            // Redirection immédiate vers la page de paiement Stripe sécurisée
            this.checkoutService.redirectToCheckout(response.checkoutUrl);
            // Note: L'utilisateur quitte temporairement le site pour payer
            // Il reviendra après paiement sur /order/success ou /order/cancel
          } else {
            // RÉPONSE REÇUE MAIS SESSION NON CRÉÉE
            alert('Erreur lors de la création de la session de paiement');
            this.isProcessing = false; // Réactiver le bouton
          }
        },
        
        // ==========================================
        // GESTION DES ERREURS
        // ==========================================
        error: (error) => {
          // ERREUR RÉSEAU, SERVEUR OU AUTHENTIFICATION
          console.error('Erreur checkout:', error);
          
          // Messages d'erreur possibles :
          // - Problème réseau (pas d'internet)
          // - Serveur backend down
          // - Token d'authentification expiré
          // - Erreur API Stripe côté backend
          
          alert('Erreur lors de la création de la session de paiement');
          this.isProcessing = false; // Réactiver le bouton pour permettre un nouvel essai
        }
      });
  }

  // ==========================================
  // RÉSUMÉ DES NOUVELLES FONCTIONNALITÉS AJOUTÉES
  // ==========================================
  /*
   * PROPRIÉTÉS AJOUTÉES :
   * - customerEmail: string     → Email de facturation (liaison avec input)
   * - isProcessing: boolean     → État de chargement (désactive bouton)
   *
   * SERVICE INJECTÉ :
   * - CheckoutService          → Communication avec API Stripe
   *
   * MÉTHODE PRINCIPALE :
   * - proceedToCheckout()      → Orchestration complète du processus de paiement
   *
   * FONCTIONNALITÉS INTERFACE :
   * - Input email avec ngModel → Saisie obligatoire pour Stripe
   * - Bouton checkout stylé   → Design moderne avec états (normal/loading/disabled)
   * - Validation dynamique    → Bouton désactivé si pas d'email ou panier vide
   * - Feedback utilisateur    → Messages d'erreur et état de chargement
   *
   * INTÉGRATIONS :
   * - FormsModule             → Pour la liaison bidirectionnelle ngModel
   * - Interfaces TypeScript  → Typage sécurisé des données
   * - Observable/Subscribe    → Gestion asynchrone des requêtes HTTP
   * - Stripe Checkout        → Redirection vers pages de paiement sécurisées
   */
}