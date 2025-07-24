import { Injectable } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  constructor() {
    // Charger le panier depuis les cookies au démarrage
    this.loadCartFromCookies();
  }

  // Ajouter un produit au panier
  addToCart(product: any) {
    let cart = this.getCartFromCookies();
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    this.saveCartToCookies(cart);
    console.log('Produit ajouté au panier :', product.name);
  }

  // Récupérer tous les articles du panier
  getItems(): CartItem[] {
    return this.getCartFromCookies();
  }

  // Supprimer un produit du panier
  removeFromCart(product: any) {
    let cart = this.getCartFromCookies();
    cart = cart.filter(item => item.id !== product.id);
    this.saveCartToCookies(cart);
  }

  // Modifier la quantité d'un produit
  updateQuantity(productId: string, quantity: number) {
    let cart = this.getCartFromCookies();
    const item = cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        // Si quantité = 0, supprimer l'article
        cart = cart.filter(item => item.id !== productId);
      } else {
        item.quantity = quantity;
      }
      this.saveCartToCookies(cart);
    }
  }

  // Vider le panier
  clearCart() {
    this.deleteCookie('soundora_cart');
  }

  // Obtenir le nombre total d'articles
  getTotalItems(): number {
    const cart = this.getCartFromCookies();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtenir le prix total
  getTotalPrice(): number {
    const cart = this.getCartFromCookies();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // ==========================================
  // MÉTHODES PRIVÉES POUR GESTION DES COOKIES
  // ==========================================

  private loadCartFromCookies() {
    // Cette méthode peut être appelée au démarrage si nécessaire
  }

  private getCartFromCookies(): CartItem[] {
    const cartData = this.getCookie('soundora_cart');
    return cartData ? JSON.parse(cartData) : [];
  }

  private saveCartToCookies(cart: CartItem[]) {
    this.setCookie('soundora_cart', JSON.stringify(cart), 30); // 30 jours
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

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

  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}