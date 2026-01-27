import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { BannerImagesComponent } from './components/banner-images/banner-images.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component'; // NOUVEAU : Barre de recherche
import { filter } from 'rxjs/operators';

/**
 * =====================================
 * COMPOSANT RACINE DE L'APPLICATION
 * =====================================
 * 
 * RÔLE :
 * C'est le composant principal qui contient toute l'application
 * 
 * STRUCTURE :
 * 1. Top Navbar (petite barre en haut)
 * 2. Navbar principale (catégories, panier, etc.)
 * 3. Barre de recherche (NOUVEAU - entre navbar et bannières)
 * 4. Bannières images
 * 5. <router-outlet> (le contenu change selon la page)
 * 6. Footer (pied de page)
 * 
 * CYCLE DE VIE :
 * ngOnInit() : Appelé une fois au démarrage
 */
@Component({
  selector: 'app-root',           // Balise HTML : <app-root>
  standalone: true,               // Composant standalone (moderne, Angular 17+)
  
  // Importations nécessaires :
  imports: [
    CommonModule,         // Directives Angular de base (*ngIf, *ngFor, etc.)
    RouterModule,         // Pour la navigation (routerLink, router-outlet)
    NavbarComponent,      // Notre navbar principale
    TopNavbarComponent,   // Notre top navbar
    SearchBarComponent,   // Barre de recherche (NOUVEAU !)
    BannerImagesComponent // Bannières images
  ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Soundora';
  isLoading = false;
  showLayout = true; // Afficher ou masquer le layout (navbar, etc.)

  constructor(private router: Router) {
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Masquer le layout sur les pages de connexion/inscription
      const authRoutes = ['/login', '/register'];
      this.showLayout = !authRoutes.includes(event.urlAfterRedirects);
    });
  }

  /**
   * LIFECYCLE HOOK : ngOnInit()
   * Appelé automatiquement par Angular après la création du composant
   * Utilisé pour initialiser les données
   */
  ngOnInit(): void {
    console.log('✓ AppComponent initialisé');
    console.log('✓ Top Navbar et Navbar principale chargées');
  }
}
