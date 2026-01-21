import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * =====================================
 * BANNER IMAGES - Composant
 * =====================================
 * 
 * RÔLE :
 * Affiche 3 images horizontales sous les navbars
 * 
 * DESIGN :
 * - 3 images côte à côte
 * - Espacées uniformément
 * - Responsive (empilées sur mobile)
 */

@Component({
  selector: 'app-banner-images',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner-images.component.html',
  styleUrl: './banner-images.component.css'
})
export class BannerImagesComponent {
  // Tableau des images à afficher
  bannerImages = [
    {
      // Pour l'instant, on utilise des placeholders
      // Tu pourras remplacer par tes vraies images plus tard
      url: 'https://via.placeholder.com/600x250/3498db/ffffff?text=Guitares',
      alt: 'Collection Guitares',
      link: '/products?category=guitares'
    },
    {
      url: 'https://via.placeholder.com/600x250/e74c3c/ffffff?text=Basses',
      alt: 'Collection Basses',
      link: '/products?category=basses'
    },
    {
      url: 'https://via.placeholder.com/600x250/27ae60/ffffff?text=Effets+%26+Amplis',
      alt: 'Effets et Amplis',
      link: '/products?category=effets'
    }
  ];
}
