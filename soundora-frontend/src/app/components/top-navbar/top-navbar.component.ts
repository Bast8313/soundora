import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * =====================================
 * TOP NAVBAR - Barre de navigation supérieure
 * =====================================
 * 
 * RÔLE :
 * Petite barre en haut du site avec les liens utiles
 * 
 * CONTENU :
 * - Nous contacter
 * - À propos
 * - FAQ
 * 
 * DESIGN :
 * - Fond gris clair
 * - Texte petit
 * - Centré ou aligné à droite
 * 
 * EXEMPLE VISUEL (Thomann) :
 * [Service] [Nous contacter] [À propos]
 */

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css'
})
export class TopNavbarComponent {
  // Ce composant est simple, pas de logique complexe
  // Il affiche juste des liens statiques
}
