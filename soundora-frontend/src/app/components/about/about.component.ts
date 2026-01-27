import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * =====================================
 * À PROPOS - Composant Histoire de Soundora
 * =====================================
 * 
 * RÔLE :
 * Présente l'histoire et les valeurs de la boutique Soundora
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  
  // Valeurs de l'entreprise
  values = [
    {
      icon: '🎯',
      title: 'Passion',
      description: 'Nous sommes musiciens avant tout. Chaque produit est sélectionné avec soin.'
    },
    {
      icon: '✨',
      title: 'Qualité',
      description: 'Nous travaillons uniquement avec des marques reconnues pour leur excellence.'
    },
    {
      icon: '💡',
      title: 'Conseil',
      description: 'Notre équipe vous accompagne dans le choix de votre matériel.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Nous restons à l\'écoute des dernières tendances et nouveautés.'
    }
  ];

  // Étapes clés de l'histoire
  timeline = [
    {
      year: '2018',
      title: 'La naissance',
      description: 'Création de Soundora par trois musiciens passionnés dans un petit garage parisien.'
    },
    {
      year: '2019',
      title: 'Premiers partenariats',
      description: 'Signature avec les plus grandes marques : Fender, Gibson, Marshall...'
    },
    {
      year: '2021',
      title: 'Expansion',
      description: 'Ouverture de notre entrepôt de 2000m² et lancement de la livraison express.'
    },
    {
      year: '2023',
      title: 'Reconnaissance',
      description: 'Élue "Meilleure boutique de musique en ligne" par les musiciens français.'
    },
    {
      year: '2024',
      title: 'International',
      description: 'Début de la livraison en Europe et partenariat avec 50 nouvelles marques.'
    }
  ];
}
