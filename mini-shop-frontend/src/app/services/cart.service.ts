import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = []; // Tableau pour stocker les articles du panier
  addToCart(product: any) {
    // faire un appel HTTP ou stocker en localStorage
    //console.log('Produit ajouté au panier :', product);
const found = this.items.find(item => item.id === product.id);
    if (found) {
      found.quantity += 1; // Incrémente la quantité si le produit existe déjà
     } else {
      this.items.push({ ...product, quantity: 1 }); // Ajoute le produit avec une quantité de 1
  }
}
  getItems() {
    // Récupérer les articles du panier, par exemple depuis localStorage ou une API
    return this.items;
  }

  removeFromCart(product: any) {
    // Supprimer un produit du panier
    this.items = this.items.filter(item => item.id !== product.id);
  }
}