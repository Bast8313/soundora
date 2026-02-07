// ==========================================
// IMPORTS
// ==========================================
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * ==========================================
 * INTERFACE CartItem - Définit la structure d'un article du panier
 * ==========================================
 * 
 * En TypeScript, une INTERFACE décrit la "forme" d'un objet.
 * C'est comme un contrat : tout objet CartItem DOIT avoir ces propriétés.
 * 
 * Avantages :
 * - Autocomplétion dans VS Code
 * - Erreurs détectées avant l'exécution
 * - Code plus lisible et maintenable
 */
export interface CartItem {
  id: string;           // ID unique du produit (ex: "prod-123")
  name: string;         // Nom du produit (ex: "Guitare Fender")
  price: number;        // Prix unitaire en euros (ex: 599)
  quantity: number;     // Quantité dans le panier (ex: 2)
  image: string;        // Chemin vers l'image (ex: "fender-strat.jpg")
  slug: string;         // URL-friendly name (ex: "fender-stratocaster")
}

/**
 * ==========================================
 * SERVICE CART - cart.service.ts
 * ==========================================
 * 
 * VERSION SIMPLIFIÉE avec LocalStorage
 * 
 * POURQUOI LOCALSTORAGE ?
 * -----------------------
 * - Fonctionne sans backend (parfait pour apprendre)
 * - Les données persistent même après fermeture du navigateur
 * - Simple à comprendre et à débugger
 * 
 * FONCTIONNEMENT :
 * 1. Le panier est stocké dans le navigateur (localStorage)
 * 2. Un BehaviorSubject notifie les composants des changements
 * 3. La navbar affiche le nombre d'articles en temps réel
 * 
 * POUR LES ÉTUDIANTS :
 * - localStorage = "mémoire" du navigateur (clé/valeur)
 * - BehaviorSubject = "haut-parleur" qui prévient tout le monde
 */
@Injectable({
  providedIn: 'root'  // Service disponible partout dans l'app
})
export class CartService {
  
  // ==========================================
  // PROPRIÉTÉS PRIVÉES
  // ==========================================
  
  /**
   * Clé utilisée pour stocker le panier dans localStorage
   * On utilise une constante pour éviter les fautes de frappe
   */
  private readonly CART_KEY = 'soundora_cart';
  
  /**
   * BehaviorSubject = Observable spécial qui :
   * - Garde en mémoire la dernière valeur
   * - Émet cette valeur immédiatement à tout nouvel abonné
   * - Permet de notifier tous les composants d'un changement
   * 
   * EXEMPLE :
   * - La navbar s'abonne au cartItems$
   * - Quand on ajoute un produit, le BehaviorSubject émet
   * - La navbar reçoit la notification et met à jour le compteur
   */
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  
  /**
   * Observable PUBLIC que les composants peuvent "écouter"
   * Le $ à la fin est une convention pour indiquer un Observable
   */
  public cartItems$ = this.cartItemsSubject.asObservable();

  // ==========================================
  // CONSTRUCTEUR
  // ==========================================
  constructor() {
    // Le panier est automatiquement chargé depuis localStorage
    // grâce à l'initialisation du BehaviorSubject ci-dessus
    console.log('🛒 CartService initialisé');
  }

  // ==========================================
  // MÉTHODES PRIVÉES (internes au service)
  // ==========================================

  /**
   * Charge le panier depuis localStorage
   * 
   * FONCTIONNEMENT :
   * 1. Récupère la chaîne JSON stockée
   * 2. La convertit en tableau d'objets
   * 3. Retourne un tableau vide si rien n'est stocké
   * 
   * @returns CartItem[] - Le tableau des articles du panier
   */
  private loadCart(): CartItem[] {
    try {
      // localStorage.getItem() retourne null si la clé n'existe pas
      const cartJson = localStorage.getItem(this.CART_KEY);
      
      // Si le panier existe, on le parse (JSON → Objet JavaScript)
      // Sinon, on retourne un tableau vide
      return cartJson ? JSON.parse(cartJson) : [];
    } catch (error) {
      // En cas d'erreur (JSON invalide), on retourne un tableau vide
      console.error('Erreur lors du chargement du panier:', error);
      return [];
    }
  }

  /**
   * Sauvegarde le panier dans localStorage
   * 
   * FONCTIONNEMENT :
   * 1. Convertit le tableau en chaîne JSON
   * 2. Stocke cette chaîne dans localStorage
   * 3. Notifie tous les abonnés du changement
   * 
   * @param items - Le tableau des articles à sauvegarder
   */
  private saveCart(items: CartItem[]): void {
    // JSON.stringify() convertit un objet JavaScript en chaîne JSON
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    
    // .next() émet la nouvelle valeur à tous les abonnés
    this.cartItemsSubject.next(items);
    
    console.log('💾 Panier sauvegardé:', items);
  }

  // ==========================================
  // MÉTHODES PUBLIQUES (utilisables par les composants)
  // ==========================================

  /**
   * Ajoute un produit au panier
   * 
   * LOGIQUE :
   * - Si le produit existe déjà → on augmente la quantité
   * - Sinon → on l'ajoute comme nouveau
   * 
   * @param product - L'objet produit à ajouter
   * @param quantity - La quantité à ajouter (défaut: 1)
   */
  addToCart(product: any, quantity: number = 1): void {
    // Récupère le panier actuel
    const currentCart = this.loadCart();
    
    // Cherche si le produit est déjà dans le panier
    const existingIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      // Le produit existe déjà → on augmente la quantité
      currentCart[existingIndex].quantity += quantity;
      console.log(`📦 Quantité mise à jour: ${currentCart[existingIndex].name} x${currentCart[existingIndex].quantity}`);
    } else {
      // Nouveau produit → on l'ajoute au panier
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || 'default-product.jpg',
        slug: product.slug
      };
      currentCart.push(newItem);
      console.log(`✅ Produit ajouté: ${newItem.name}`);
    }
    
    // Sauvegarde le panier mis à jour
    this.saveCart(currentCart);
  }

  /**
   * Retire un produit du panier
   * 
   * @param productId - L'ID du produit à retirer
   */
  removeFromCart(productId: string): void {
    const currentCart = this.loadCart();
    
    // filter() garde uniquement les éléments qui passent le test
    // Ici, on garde tous les produits SAUF celui avec l'ID donné
    const updatedCart = currentCart.filter(item => item.id !== productId);
    
    this.saveCart(updatedCart);
    console.log(`🗑️ Produit retiré du panier`);
  }

  /**
   * Met à jour la quantité d'un produit
   * 
   * @param productId - L'ID du produit
   * @param quantity - La nouvelle quantité
   */
  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.loadCart();
    const itemIndex = currentCart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Si quantité <= 0, on retire le produit
        this.removeFromCart(productId);
      } else {
        // Sinon, on met à jour la quantité
        currentCart[itemIndex].quantity = quantity;
        this.saveCart(currentCart);
      }
    }
  }

  /**
   * Vide complètement le panier
   */
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    this.cartItemsSubject.next([]);
    console.log('🧹 Panier vidé');
  }

  /**
   * Récupère le panier actuel (snapshot)
   * 
   * @returns CartItem[] - Copie du panier actuel
   */
  getCartItems(): CartItem[] {
    return this.loadCart();
  }

  /**
   * Calcule le nombre total d'articles dans le panier
   * 
   * EXPLICATION du reduce() :
   * - reduce() parcourt un tableau et accumule une valeur
   * - Ici, on additionne les quantités de chaque article
   * - (total, item) => total + item.quantity
   *   - total : l'accumulateur (commence à 0)
   *   - item : l'article en cours
   * 
   * @returns number - Le nombre total d'articles
   */
  getCartCount(): number {
    const items = this.loadCart();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calcule le montant total du panier en euros
   * 
   * @returns number - Le total en euros
   */
  getCartTotal(): number {
    const items = this.loadCart();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
