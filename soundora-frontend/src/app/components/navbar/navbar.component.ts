import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // État du menu burger (ouvert/fermé)
  isMenuOpen: boolean = false;

  // Terme de recherche
  searchQuery: string = '';

  // Nombre d'articles dans le panier (à remplacer par la vraie valeur du service)
  cartItemCount: number = 0;

  // Bascule l'état du menu burger
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Ferme le menu burger (utile après un clic sur un lien)
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Gère la recherche
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
      // TODO: Implémenter la navigation vers /products?search=...
      this.searchQuery = '';
    }
  }
}
