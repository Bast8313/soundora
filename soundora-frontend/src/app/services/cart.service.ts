// IMPORTS NÉCESSAIRES POUR LE SERVICE DE PANIER
import { Injectable } from '@angular/core';

/**
 * INTERFACE POUR LES ÉLÉMENTS DU PANIER
 * Définit la structure d'un article dans le panier d'achat
 */
export interface CartItem {
  id: string;      // Identifiant unique du produit
  name: string;    // Nom du produit
  price: number;   // Prix unitaire du produit
  quantity: number; // Quantité dans le panier
}

/**
 * SERVICE DE GESTION DU PANIER D'ACHAT
 * Gère l'ajout, suppression et persistance des articles dans le panier
 * Utilise les cookies pour conserver le panier entre les sessions
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  /**
   * CONSTRUCTEUR DU SERVICE DE PANIER
   * Initialise le service et charge le panier existant depuis les cookies
   */
  constructor() {
    // Charger le panier depuis les cookies au démarrage
    this.loadCartFromCookies();
  }

  // =====================================
  // MÉTHODES PRINCIPALES DU PANIER
  // =====================================

  /**
   * AJOUTE UN PRODUIT AU PANIER
   * Si le produit existe déjà, incrémente la quantité
   * Sinon, ajoute un nouvel élément avec quantité 1
   * 
   * @param product - Produit à ajouter au panier
   */
  addToCart(product: any) {
    let cart = this.getCartFromCookies();
    
    // Vérifier si le produit existe déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Produit existant : augmenter la quantité
      existingItem.quantity += 1;
    } else {
      // Nouveau produit : ajouter au panier
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    // Sauvegarder le panier mis à jour
    this.saveCartToCookies(cart);
    console.log('Produit ajouté au panier :', product.name);
  }

  /**
   * RÉCUPÈRE TOUS LES ARTICLES DU PANIER
   * Retourne la liste complète des articles dans le panier
   * 
   * @returns Tableau des articles du panier
   */
  getItems(): CartItem[] {
    return this.getCartFromCookies();
  }

  /**
   * SUPPRIME UN PRODUIT DU PANIER
   * Retire complètement un produit du panier (toutes quantités)
   * 
   * @param product - Produit à supprimer du panier
   */
  removeFromCart(product: any) {
    let cart = this.getCartFromCookies();
    // Filtrer pour exclure le produit à supprimer
    cart = cart.filter(item => item.id !== product.id);
    this.saveCartToCookies(cart);
  }

  /**
   * MODIFIE LA QUANTITÉ D'UN PRODUIT
   * Met à jour la quantité d'un produit spécifique dans le panier
   * Si quantité = 0, supprime l'article du panier
   * 
   * @param productId - ID du produit à modifier
   * @param quantity - Nouvelle quantité (0 = suppression)
   */
  updateQuantity(productId: string, quantity: number) {
    let cart = this.getCartFromCookies();
    const item = cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        // Si quantité = 0, supprimer l'article
        cart = cart.filter(item => item.id !== productId);
      } else {
        // Mettre à jour la quantité
        item.quantity = quantity;
      }
      this.saveCartToCookies(cart);
    }
  }

  /**
   * VIDE COMPLÈTEMENT LE PANIER
   * Supprime tous les articles du panier en effaçant le cookie
   */
  clearCart() {
    this.deleteCookie('soundora_cart');
  }

  // =====================================
  // MÉTHODES DE CALCUL
  // =====================================

  /**
   * CALCULE LE NOMBRE TOTAL D'ARTICLES
   * Retourne le nombre total d'articles dans le panier (somme des quantités)
   * 
   * @returns Nombre total d'articles
   */
  getTotalItems(): number {
    const cart = this.getCartFromCookies();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * CALCULE LE PRIX TOTAL DU PANIER
   * Retourne le montant total du panier (prix × quantité pour chaque article)
   * 
   * @returns Prix total en euros
   */
  getTotalPrice(): number {
    const cart = this.getCartFromCookies();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // =====================================
  // MÉTHODES PRIVÉES POUR GESTION DES COOKIES
  // =====================================

  /**
   * CHARGE LE PANIER DEPUIS LES COOKIES
   * Méthode d'initialisation appelée au démarrage du service
   */
  private loadCartFromCookies() {
    // Cette méthode peut être appelée au démarrage si nécessaire
    // Le panier est chargé automatiquement via getCartFromCookies()
  }

  /**
   * RÉCUPÈRE LE PANIER DEPUIS LES COOKIES
   * Lit et parse le panier stocké dans les cookies
   * 
   * @returns Tableau des articles du panier ou tableau vide si aucun cookie
   */
  private getCartFromCookies(): CartItem[] {
    const cartData = this.getCookie('soundora_cart');
    return cartData ? JSON.parse(cartData) : [];
  }

  /**
   * SAUVEGARDE LE PANIER DANS LES COOKIES
   * Sérialise et stocke le panier dans un cookie
   * 
   * @param cart - Tableau des articles du panier à sauvegarder
   */
  private saveCartToCookies(cart: CartItem[]) {
    this.setCookie('soundora_cart', JSON.stringify(cart), 30); // 30 jours d'expiration
  }

  /**
   * CRÉE OU MET À JOUR UN COOKIE
   * Stocke une valeur dans un cookie avec une date d'expiration
   * 
   * @param name - Nom du cookie
   * @param value - Valeur à stocker
   * @param days - Nombre de jours avant expiration
   */
  private setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  /**
   * LIT LA VALEUR D'UN COOKIE
   * Récupère et décode la valeur d'un cookie par son nom
   * 
   * @param name - Nom du cookie à lire
   * @returns Valeur du cookie ou null si inexistant
   */
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  /**
   * SUPPRIME UN COOKIE
   * Efface un cookie en définissant sa date d'expiration dans le passé
   * 
   * @param name - Nom du cookie à supprimer
   */
  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}