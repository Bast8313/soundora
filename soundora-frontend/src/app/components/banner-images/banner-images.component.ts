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
  // Tableau des 3 images bannières sous la barre de recherche
  bannerImages = [
    {
      // Image 1 : Concert / Foule
      url: 'assets/images/banner-guitares.jpg',
      alt: 'Concert - Ambiance musicale',
      link: '/products?category=guitares'
    },
    {
      // Image 2 : Guitariste / Musicien
      url: 'assets/images/banner-basses.jpg',
      alt: 'Musicien - Guitare électrique',
      link: '/products?category=basses'
    },
    {
      // Image 3 : Studio d'enregistrement
      url: 'assets/images/banner-effets.jpg',
      alt: 'Studio - Équipement professionnel',
      link: '/products?category=studio'
    }
  ];
}
