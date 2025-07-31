// =====================================
// IMPORTS POUR LE COMPOSANT PANIER
// =====================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Directives Angular de base (ngFor, ngIf, etc.)
import { CartService } from '../../services/cart.service'; // Service de gestion du panier

/**
 * COMPOSANT PANIER D'ACHAT
 * Affiche les articles dans le panier, permet la modification des quantités
 * et calcule le total des achats
 */
@Component({
  selector: 'app-cart',
  standalone: true, // Composant autonome (Angular 14+)
  imports: [CommonModule], // Modules nécessaires pour les directives
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  // =====================================
  // PROPRIÉTÉS DU COMPOSANT
  // =====================================
  items: any[] = []; // Tableau des articles dans le panier

  /**
   * CONSTRUCTEUR - INJECTION DU SERVICE PANIER
   * @param cartService - Service pour gérer les opérations du panier
   */
  constructor(private cartService: CartService) { }

  /**
   * INITIALISATION DU COMPOSANT
   * Charge les articles du panier au démarrage
   */
  ngOnInit() {
    this.items = this.cartService.getItems(); // Récupération des articles du panier
  }

  // =====================================
  // MÉTHODES DE GESTION DU PANIER
  // =====================================

  /**
   * SUPPRIME UN ARTICLE DU PANIER
   * Retire l'article et met à jour l'affichage
   * @param item - Article à supprimer
   */
  removeFromCart(item: any) {
    this.cartService.removeFromCart(item); // Suppression via le service
    this.items = this.cartService.getItems(); // Rechargement de la liste mise à jour
  }

  /**
   * CALCULE LE PRIX TOTAL DU PANIER
   * Additionne prix × quantité pour chaque article
   * @returns Prix total en euros
   */
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }
}