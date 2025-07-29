// Importation des modules Angular nécessaires
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService, Category, Brand } from '../../services/category.service';

// Décorateur Component qui définit les métadonnées du composant
@Component({
  selector: 'app-navbar',           // Nom du sélecteur HTML pour utiliser ce composant
  standalone: true,                // Composant autonome (Angular 14+)
  imports: [CommonModule, RouterModule], // Modules importés pour ce composant
  templateUrl: './navbar.component.html', // Chemin vers le template HTML
  styleUrl: './navbar.component.css'      // Chemin vers le fichier CSS
})
export class NavbarComponent implements OnInit {
  // Propriétés pour stocker les données récupérées de l'API
  categories: Category[] = [];     // Liste des catégories de produits
  brands: Brand[] = [];           // Liste des marques de produits
  
  // Variables pour gérer l'état d'ouverture/fermeture des dropdowns
  isDropdownOpen = false;         // État du dropdown des catégories
  isBrandDropdownOpen = false;    // État du dropdown des marques

  // Injection de dépendances dans le constructeur
  constructor(
    private categoryService: CategoryService, // Service pour récupérer catégories et marques
    private router: Router                    // Service de navigation d'Angular
  ) {}

  // Méthode appelée automatiquement après l'initialisation du composant
  ngOnInit() {
    this.loadCategories(); // Charge les catégories au démarrage
    this.loadBrands();     // Charge les marques au démarrage
  }

  // Méthode pour récupérer les catégories depuis l'API
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        // Récupère les données (gère différents formats de réponse API)
        this.categories = response.data || response || [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error: any) => {
        // Gestion des erreurs de chargement
        console.error('Erreur lors du chargement des catégories:', error);
        this.categories = []; // Réinitialise en cas d'erreur
      }
    });
  }

  // Méthode pour récupérer les marques depuis l'API
  loadBrands() {
    this.categoryService.getBrands().subscribe({
      next: (response: any) => {
        // Récupère les données (gère différents formats de réponse API)
        this.brands = response.data || response || [];
        console.log('Marques chargées:', this.brands);
      },
      error: (error: any) => {
        // Gestion des erreurs de chargement
        console.error('Erreur lors du chargement des marques:', error);
        this.brands = []; // Réinitialise en cas d'erreur
      }
    });
  }

  // === MÉTHODES DE GESTION DES DROPDOWNS ===
  
  // Bascule l'état du dropdown des catégories (ouvre/ferme)
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isBrandDropdownOpen = false; // Ferme l'autre dropdown pour éviter les conflits
  }

  // Bascule l'état du dropdown des marques (ouvre/ferme)
  toggleBrandDropdown() {
    this.isBrandDropdownOpen = !this.isBrandDropdownOpen;
    this.isDropdownOpen = false; // Ferme l'autre dropdown pour éviter les conflits
  }

  // Ouvre le dropdown des catégories (au survol de la souris)
  openDropdown() {
    this.isDropdownOpen = true;
    this.isBrandDropdownOpen = false;
  }

  // Ouvre le dropdown des marques (au survol de la souris)
  openBrandDropdown() {
    this.isBrandDropdownOpen = true;
    this.isDropdownOpen = false;
  }

  // Ferme tous les dropdowns (quand la souris sort de la zone)
  closeDropdowns() {
    this.isDropdownOpen = false;
    this.isBrandDropdownOpen = false;
  }

  // === MÉTHODES DE NAVIGATION ===
  
  // Gestionnaire de clic sur une catégorie dans le dropdown
  onCategorySelect(categorySlug: string) {
    console.log('Clic sur catégorie:', categorySlug); // Log pour débogage
    
    // Navigation vers la page de produits filtrée par catégorie
    // Utilise le slug de la catégorie comme paramètre d'URL
    this.router.navigate(['/category', categorySlug]).then(success => {
      console.log('Navigation vers catégorie réussie:', success);
    }).catch(error => {
      console.error('Erreur navigation catégorie:', error);
    });
    
    this.closeDropdowns(); // Ferme les dropdowns après la sélection
  }

  // Gestionnaire de clic sur une marque dans le dropdown
  onBrandSelect(brandSlug: string) {
    console.log('Clic sur marque:', brandSlug); // Log pour débogage
    
    // Navigation vers la page de produits filtrée par marque
    // Utilise le slug de la marque comme paramètre d'URL
    this.router.navigate(['/brand', brandSlug]).then(success => {
      console.log('Navigation vers marque réussie:', success);
    }).catch(error => {
      console.error('Erreur navigation marque:', error);
    });
    
    this.closeDropdowns(); // Ferme les dropdowns après la sélection
  }
}
