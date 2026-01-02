import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * =====================================
 * COMPOSANT RACINE - AppComponent
 * =====================================
 * 
 * C'est le composant principal de l'application.
 * Il contient la structure de base de toutes les pages.
 * 
 * STRUCTURE HABITUELLE :
 * - Navbar (en haut)
 * - Contenu dynamique (au centre) ← changer selon la route
 * - Footer (en bas) ← optionnel
 * 
 * Le contenu au centre est géré par <router-outlet>
 * qui injecte le composant approprié selon la route active.
 */

@Component({
  // ========================================
  // CONFIGURATION DU COMPOSANT
  // ========================================
  selector: 'app-root',
  // selector : La balise HTML pour utiliser ce composant
  // Ici : <app-root></app-root> dans index.html
  
  standalone: true,
  // standalone: true = mode "standalone" Angular 14+
  // Signifie que ce composant n'a pas besoin de module NgModule
  // Plus simple et moderne que les modules classiques
  
  imports: [CommonModule, RouterModule],
  // imports : Les modules/composants utilisés dans ce composant
  // - CommonModule : directives basiques (*ngIf, *ngFor, etc.)
  // - RouterModule : <router-outlet> pour afficher les pages
  
  templateUrl: './app.component.html',
  // templateUrl : Chemin vers le fichier HTML
  
  styleUrl: './app.component.css',
  // styleUrl : Chemin vers le fichier CSS (styles du composant)
})

// ========================================
// CLASSE DU COMPOSANT
// ========================================
export class AppComponent implements OnInit {
  // ========================================
  // PROPRIÉTÉS (DONNÉES) DU COMPOSANT
  // ========================================
  
  // Titre de l'application (utilisé dans le template)
  title = 'Soundora';
  
  // Indicateur de chargement (utile pour afficher un spinner)
  isLoading = false;
  
  // ========================================
  // LIFECYCLE HOOK : ngOnInit()
  // ========================================
  // Cette méthode est appelée une seule fois après :
  // 1. La création du composant
  // 2. L'initialisation de ses propriétés
  // 
  // Idéal pour :
  // - Charger les données initiales
  // - Initialiser des services
  // - Configurer des abonnements aux observables
  
  ngOnInit(): void {
    console.log('✓ AppComponent initialisé');
    console.log('Application Soundora démarrée');
    
    // Exemple : Charger les données globales (catégories, marques, etc.)
    // this.loadInitialData();
  }
  
  // ========================================
  // MÉTHODES DU COMPOSANT
  // ========================================
  
  /**
   * Méthode pour charger les données initiales de l'application
   * Exemple : catégories, marques, utilisateur connecté, etc.
   */
  loadInitialData(): void {
    console.log('Chargement des données initiales...');
    // Appelerais les services ici
    // this.categoryService.getCategories();
    // this.authService.getCurrentUser();
  }
}
