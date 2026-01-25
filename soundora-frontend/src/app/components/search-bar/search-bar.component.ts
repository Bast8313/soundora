import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * =====================================
 * COMPOSANT BARRE DE RECHERCHE
 * =====================================
 * 
 * Composant standalone pour la recherche de produits
 * Placé entre la navbar noire et les images bannières
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  
  // Variable pour stocker la recherche de l'utilisateur
  searchQuery: string = '';

  constructor(private router: Router) { }

  /**
   * Déclenche la recherche
   * Redirige vers /products avec le paramètre search dans l'URL
   * Exemple : /products?search=guitare
   */
  onSearch(): void {
    // Vérifie que la recherche n'est pas vide
    if (this.searchQuery.trim()) {
      console.log('🔍 Recherche:', this.searchQuery);
      
      // Redirige vers la page produits avec le paramètre de recherche
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      
      // Réinitialise le champ après la recherche (optionnel)
      // this.searchQuery = '';
    }
  }
}
