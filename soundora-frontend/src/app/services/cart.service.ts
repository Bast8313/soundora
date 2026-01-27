// ==========================================
// IMPORTS
// ==========================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * ==========================================
 * SERVICE CART - cart.service.ts
 * ==========================================
 * 
 * Ce service gère le PANIER de l'utilisateur.
 * 
 * RÔLE :
 * - Ajouter un produit au panier
 * - Récupérer le contenu du panier
 * - Supprimer un produit du panier
 * - Vider le panier
 * 
 * COMMUNICATION :
 * - Envoie des requêtes HTTP vers le backend
 * - Retourne des Observables (flux de données asynchrones)
 * 
 * POUR LES ÉTUDIANTS :
 * Un service est comme une "boîte à outils" réutilisable.
 * Au lieu de copier-coller le code partout, on l'écrit une fois ici
 * et on l'utilise dans tous les composants qui en ont besoin.
 */
@Injectable({
  providedIn: 'root'  // Le service est disponible dans toute l'application
})
export class CartService {
  
  // URL de base de l'API backend
  private apiUrl = 'http://localhost:3000/api';

  /**
   * CONSTRUCTEUR : Injection du HttpClient
   * 
   * @param http - Module Angular pour faire des requêtes HTTP
   */
  constructor(private http: HttpClient) {}

  /**
   * ==========================================
   * MÉTHODE addToCart()
   * ==========================================
   * 
   * Ajoute un produit au panier.
   * 
   * @param productId - L'ID du produit à ajouter
   * @param quantity - La quantité à ajouter (par défaut 1)
   * @returns Observable - Flux de données de la réponse du serveur
   * 
   * FONCTIONNEMENT :
   * 1. Prépare les données (productId + quantity)
   * 2. Envoie une requête POST au backend
   * 3. Le backend ajoute le produit dans la base de données
   * 4. Retourne la réponse (succès ou erreur)
   */
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const body = {
      product_id: productId,
      quantity: quantity
    };
    
    return this.http.post(`${this.apiUrl}/cart/add`, body);
  }

  /**
   * ==========================================
   * MÉTHODE getCart()
   * ==========================================
   * 
   * Récupère tout le contenu du panier de l'utilisateur.
   * 
   * @returns Observable - La liste des produits dans le panier
   */
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  /**
   * ==========================================
   * MÉTHODE removeFromCart()
   * ==========================================
   * 
   * Supprime un produit du panier.
   * 
   * @param productId - L'ID du produit à supprimer
   * @returns Observable - Confirmation de suppression
   */
  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${productId}`);
  }

  /**
   * ==========================================
   * MÉTHODE clearCart()
   * ==========================================
   * 
   * Vide complètement le panier.
   * 
   * @returns Observable - Confirmation de vidage
   */
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear`);
  }
}
