// ==========================================
// COMPOSANT PAYMENT SUCCESS
// ==========================================
// Page affichée après un paiement Stripe réussi
// URL: /payment/success?session_id=xxx
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StripeService, StripeSessionStatus } from '../../services/stripe.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container">
      <!-- État de chargement -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Vérification de votre paiement...</p>
      </div>

      <!-- Paiement confirmé -->
      <div *ngIf="!isLoading && paymentConfirmed" class="success-content">
        <div class="success-icon">✅</div>
        <h1>Paiement réussi !</h1>
        <p class="success-message">
          Merci pour votre commande. Un email de confirmation a été envoyé à 
          <strong>{{ customerEmail }}</strong>.
        </p>
        
        <div class="order-details" *ngIf="amountPaid">
          <p>Montant payé : <strong>{{ amountPaid | number:'1.2-2' }} €</strong></p>
        </div>

        <div class="actions">
          <a routerLink="/products" class="btn-primary">
            Continuer mes achats
          </a>
          <a routerLink="/" class="btn-secondary">
            Retour à l'accueil
          </a>
        </div>
      </div>

      <!-- Erreur ou paiement non confirmé -->
      <div *ngIf="!isLoading && !paymentConfirmed" class="error-content">
        <div class="error-icon">⚠️</div>
        <h1>Vérification en cours</h1>
        <p>{{ errorMessage }}</p>
        <div class="actions">
          <a routerLink="/cart" class="btn-primary">
            Retour au panier
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      max-width: 600px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
    }

    .loading {
      padding: 3rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #e94560;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-icon, .error-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .success-content h1 {
      color: #28a745;
      margin-bottom: 1rem;
    }

    .error-content h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }

    .success-message {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .order-details {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
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
  `]
})
export class PaymentSuccessComponent implements OnInit {
  isLoading = true;
  paymentConfirmed = false;
  customerEmail = '';
  amountPaid = 0;
  errorMessage = 'Impossible de vérifier le paiement pour le moment.';

  constructor(
    private route: ActivatedRoute,
    private stripeService: StripeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Récupère le session_id depuis l'URL
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (sessionId) {
      this.verifyPayment(sessionId);
    } else {
      // Pas de session_id, on considère le paiement comme réussi
      // (cas où Stripe n'a pas passé le paramètre)
      this.isLoading = false;
      this.paymentConfirmed = true;
      this.cartService.clearCart();
    }
  }

  private verifyPayment(sessionId: string): void {
    this.stripeService.getSessionStatus(sessionId).subscribe({
      next: (response: StripeSessionStatus) => {
        this.isLoading = false;
        
        if (response.success && response.payment_status === 'paid') {
          this.paymentConfirmed = true;
          this.customerEmail = response.customer_email || '';
          this.amountPaid = (response.amount_total || 0) / 100; // Centimes → Euros
          
          // Vide le panier après paiement réussi
          this.cartService.clearCart();
          
          console.log('✅ Paiement confirmé:', response);
        } else {
          this.paymentConfirmed = false;
          this.errorMessage = 'Le paiement est en cours de traitement.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.paymentConfirmed = true; // On assume le succès
        this.cartService.clearCart();
        console.log('⚠️ Vérification échouée, mais on assume le succès');
      }
    });
  }
}
