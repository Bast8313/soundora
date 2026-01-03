import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * Point d'entrée de l'application Angular
 * 
 * bootstrapApplication() : Démarre l'application
 * - Charge AppComponent (composant racine)
 * - Configure les services globaux
 * - Monte l'application dans <app-root>
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),      // Configuration du routage
    provideHttpClient(),         // Client HTTP pour les requêtes API
  ],
}).catch(err => console.error(err));
