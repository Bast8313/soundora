// ==========================================
// COMPOSANT PAYMENT CANCEL
// ==========================================
// Page affichée après annulation du paiement Stripe
// URL: /payment/cancel
// ==========================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cancel-container">
      <div class="cancel-content">
        <div class="cancel-icon">❌</div>
        <h1>Paiement annulé</h1>
        <p class="cancel-message">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>
        <p class="info-message">
          Votre panier a été conservé. Vous pouvez reprendre votre commande à tout moment.
        </p>

        <div class="actions">
          <a routerLink="/cart" class="btn-primary">
            Retour au panier
          </a>
          <a routerLink="/products" class="btn-secondary">
            Continuer mes achats
          </a>
        </div>

        <div class="help-section">
          <h3>Besoin d'aide ?</h3>
          <p>
            Si vous avez rencontré un problème lors du paiement, n'hésitez pas à 
            <a routerLink="/contact">nous contacter</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cancel-container {
      max-width: 600px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
    }

    .cancel-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .cancel-content h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }

    .cancel-message {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .info-message {
      color: #28a745;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .btn-primary {
      background: #e94560;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #d63850;
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid #e94560;
      color: #e94560;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #e94560;
      color: white;
    }

    .help-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .help-section h3 {
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .help-section a {
      color: #e94560;
      text-decoration: none;
    }

    .help-section a:hover {
      text-decoration: underline;
    }
  `]
})
export class PaymentCancelComponent {}
