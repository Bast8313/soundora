import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';

/**
 * =====================================
 * COMPOSANT NAVBAR PRINCIPALE
 * =====================================
 * 
 * Contient :
 * - Logo Soundora
 * - Menu de catégories
 * - Actions utilisateur (panier, connexion)
 * - Menu burger pour mobile
 * 
 * Note : La barre de recherche a été déplacée dans un composant séparé (SearchBarComponent)
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // FormsModule retiré (plus de recherche ici)
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  // État du menu burger (ouvert/fermé)
  isMenuOpen: boolean = false;

  // État du dropdown catégories (ouvert/fermé)
  isCategoriesDropdownOpen: boolean = false;

  // Nombre d'articles dans le panier (à remplacer par la vraie valeur du service)
  cartItemCount: number = 0;

  // Liste des catégories avec leurs sous-catégories
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Charge les catégories depuis l'API
  loadCategories(): void {
    console.log('Chargement des catégories...');
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log('Réponse catégories:', response);
        if (response.success) {
          // Organise les catégories en structure hiérarchique
          this.categories = this.categoryService.organizeCategoriesHierarchy(response.data);
          console.log('Catégories organisées:', this.categories);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  // Bascule l'état du menu burger
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Ferme le menu burger (utile après un clic sur un lien)
  closeMenu(): void {
    this.isMenuOpen = false;
    this.isCategoriesDropdownOpen = false;
  }

  // Bascule le dropdown des catégories
  toggleCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }

  // Ouvre le dropdown des catégories
  openCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = true;
  }

  // Ferme le dropdown des catégories (menu)
  closeCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = false;
  }
}
