import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * =====================================
 * POINT D'ENTRÉE ANGULAR - main.ts
 * =====================================
 * 
 * Ce fichier est le premier fichier TypeScript exécuté par l'application.
 * Il initialise Angular et lance le composant racine (AppComponent).
 * 
 * PROCESSUS D'INITIALISATION :
 * 1. bootstrapApplication() = démarre l'application Angular
 * 2. Charge AppComponent (le composant racine)
 * 3. Injecte les services/modules nécessaires via provideRouter(), provideHttpClient()
 * 4. Monte l'application dans <app-root> du DOM
 */

// =====================================
// CONFIGURATION DE L'APPLICATION
// =====================================

bootstrapApplication(AppComponent, {
  providers: [
    // ========================================
    // CONFIGURATION DU ROUTEUR ANGULAR
    // ========================================
    // provideRouter(routes) : Configure le système de routage
    // - Permet la navigation entre différentes pages/vues
    // - Les routes sont définies dans app.routes.ts
    // - Exemple : /products → ProductListComponent
    //            /product/:id → ProductDetailComponent
    //            /cart → CartComponent
    provideRouter(routes),
    
    // ========================================
    // CONFIGURATION HTTP CLIENT
    // ========================================
    // provideHttpClient() : Activates le module HttpClient
    // - Permet aux services de faire des requêtes HTTP
    // - Communique avec l'API backend (http://localhost:3010/api)
    // - Gère les requêtes GET, POST, PUT, DELETE
    // - Supporte les observables RxJS
    provideHttpClient(),
  ],
}).catch(err => {
  // ========================================
  // GESTION DES ERREURS D'INITIALISATION
  // ========================================
  // Si quelque chose échoue au démarrage, affiche l'erreur dans la console
  console.error('Erreur lors du démarrage de l\'application:', err);
});
