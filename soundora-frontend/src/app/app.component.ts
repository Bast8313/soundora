// =====================================
// IMPORTS POUR LE COMPOSANT RACINE
// =====================================
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Module de routing Angular
import { NavbarComponent } from './components/navbar/navbar.component'; // Composant de navigation
import { NotificationComponent } from './components/notification/notification.component'; // Système de notifications

/**
 * COMPOSANT RACINE DE L'APPLICATION SOUNDORA
 * Point d'entrée principal de l'application Angular
 * Contient la structure de base : navbar + contenu + notifications
 */
@Component({
  selector: 'app-root', // Sélecteur utilisé dans index.html
  standalone: true, // Composant autonome (Angular 14+)
  imports: [RouterModule, NavbarComponent, NotificationComponent], // Composants et modules importés
  templateUrl: './app.component.html', // Template HTML principal
  styleUrls: ['./app.component.css'] // Styles CSS globaux
})
export class AppComponent {
  
  // =====================================
  // PROPRIÉTÉS DE L'APPLICATION
  // =====================================
  title = 'Soundora'; // Titre de l'application utilisé dans le template
}
