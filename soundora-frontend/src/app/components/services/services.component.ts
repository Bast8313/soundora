// =============================================
// COMPOSANT SERVICES - services.component.ts
// =============================================
// 
// CE QU'EST CE FICHIER :
// C'est le "cerveau" du composant Services.
// Il contient la logique et les données de la page.
//
// STRUCTURE D'UN COMPOSANT ANGULAR :
// 1. Les imports (ce dont on a besoin)
// 2. Le décorateur @Component (configuration)
// 3. La classe (données et méthodes)
// =============================================

// IMPORTS : On importe les modules Angular nécessaires
import { Component } from '@angular/core';      // Pour créer un composant
import { CommonModule } from '@angular/common'; // Pour *ngFor, *ngIf dans le HTML
import { RouterModule } from '@angular/router'; // Pour les liens de navigation

// =============================================
// DÉCORATEUR @Component
// =============================================
// Le décorateur configure le composant :
// - selector : nom de la balise HTML (<app-services>)
// - standalone : composant autonome (pas besoin de module)
// - imports : modules utilisés dans le template HTML
// - templateUrl : chemin vers le fichier HTML
// - styleUrl : chemin vers le fichier CSS
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  
  // =============================================
  // DONNÉES DU COMPOSANT
  // =============================================
  // Ces tableaux contiennent les données affichées sur la page.
  // On utilise des objets avec des propriétés (title, description, items).
  // Ces données seront lues par le HTML avec *ngFor.

  /**
   * Services de livraison et commande
   * Chaque objet a un titre et une description
   */
  deliveryServices = [
    {
      title: 'Livraison standard',
      description: 'Livraison en 3 à 5 jours ouvrés partout en France métropolitaine.'
    },
    {
      title: 'Livraison express',
      description: 'Recevez votre commande en 24h pour les produits en stock (commande avant 14h).'
    },
    {
      title: 'Click & Collect',
      description: 'Retirez gratuitement votre commande dans notre entrepôt à Paris.'
    },
    {
      title: 'Livraison gratuite',
      description: 'Frais de port offerts pour toute commande supérieure à 50€.'
    }
  ];

  /**
   * Services de paiement
   */
  paymentServices = [
    {
      title: 'Paiement sécurisé',
      description: 'Transactions 100% sécurisées par Stripe (Visa, Mastercard, American Express).'
    },
    {
      title: 'Paiement en 3x ou 4x',
      description: 'Étalez vos paiements sans frais pour les commandes de plus de 100€.'
    },
    {
      title: 'PayPal',
      description: 'Payez facilement avec votre compte PayPal.'
    }
  ];

  /**
   * Services après-vente
   */
  supportServices = [
    {
      title: 'Garantie 2 ans',
      description: 'Tous nos produits sont garantis 2 ans pièces et main d\'œuvre.'
    },
    {
      title: 'Retours sous 30 jours',
      description: 'Vous avez 30 jours pour changer d\'avis. Retour gratuit en France.'
    },
    {
      title: 'SAV réactif',
      description: 'Notre équipe répond à vos questions sous 24h du lundi au vendredi.'
    },
    {
      title: 'Conseils d\'experts',
      description: 'Nos conseillers sont tous musiciens et peuvent vous guider dans vos choix.'
    }
  ];
}
