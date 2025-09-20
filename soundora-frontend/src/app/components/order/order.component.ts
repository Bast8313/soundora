// Composant principal de la page commande
// Intègre la notification de succès après paiement Stripe
import { Component } from '@angular/core';
import { OrderSuccessNotificationComponent } from './order-success-notification.component';

@Component({
  selector: 'app-order',
  imports: [OrderSuccessNotificationComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  // Contrôle l'affichage de la notification
  showNotification = true; // À adapter selon le flux réel (ex: session Stripe validée)

}
