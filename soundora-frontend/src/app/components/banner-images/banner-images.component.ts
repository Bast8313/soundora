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
      // Images gratuites haute qualité depuis Unsplash
      // Guitares électriques
      url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=250&fit=crop&q=80',
      alt: 'Collection Guitares',
      link: '/products?category=guitares'
    },
    {
      // Basses électriques
      url: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=600&h=250&fit=crop&q=80',
      alt: 'Collection Basses',
      link: '/products?category=basses'
    },
    {
      // Effets et amplis
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=250&fit=crop&q=80',
      alt: 'Effets et Amplis',
      link: '/products?category=effets'
    }
  ];
}
