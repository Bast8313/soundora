// Composant Angular pour afficher une notification de commande réussie
// Utilisé sur la page de succès après paiement Stripe
// Import du module CommonModule pour utiliser les directives Angular comme *ngIf
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success-notification',
  // Ajout de CommonModule dans les imports pour permettre l'utilisation de *ngIf dans le template
  templateUrl: './order-success-notification.component.html',
  styleUrls: ['./order-success-notification.component.css'],
  imports: [CommonModule] // <-- Permet d'utiliser *ngIf dans le template HTML
})
export class OrderSuccessNotificationComponent {
  // Contrôle l'affichage de la notification
  @Input() showNotification: boolean = false;
}
