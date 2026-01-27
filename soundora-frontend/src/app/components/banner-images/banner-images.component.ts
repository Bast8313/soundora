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
  // Tableau des images à afficher - Produits réels du catalogue
  bannerImages = [
    {
      // Ibanez SR500E - Basse électrique
      url: 'assets/images/products/ibanez-sr500e.jpg',
      alt: 'Ibanez SR500E - Collection Basses',
      link: '/products?category=basses'
    },
    {
      // Tama Imperialstar - Batterie acoustique
      url: 'assets/images/products/tama-imperialstar.jpg',
      alt: 'Tama Imperialstar - Collection Batterie',
      link: '/products?category=batterie'
    },
    {
      // Orange Rockerverb 50 MKIII - Ampli guitare
      url: 'assets/images/products/orange-rockerverb-50-mkiii.jpg',
      alt: 'Orange Rockerverb 50 - Amplis Guitare',
      link: '/products?category=amplis'
    }
  ];
}
