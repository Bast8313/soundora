import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; // Importation du module commun pour les directives Angular de base
import { CartService } from '../../services/cart.service'; // Importation du service de panier

@Component({
  selector: 'app-cart',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule], // Importation des modules nécessaires pour le composant
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: any[] = []; // Tableau pour stocker les articles du panier

  constructor(private cartService: CartService) { } // Injection du service de panier

  ngOnInit(){
    this.items = this.cartService.getItems(); // Récupération des articles du panier lors de l'initialisation du composant
  }
  removeFromCart(item: any) {
    this.cartService.removeFromCart(item); // Suppression d'un article du panier
    this.items = this.cartService.getItems(); // Mise à jour de la liste des articles après suppression
  }
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0); // Calcul du total du panier
}
}