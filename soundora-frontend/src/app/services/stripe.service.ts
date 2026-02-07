// ==========================================
// SERVICE STRIPE - stripe.service.ts
// ==========================================
//
// Ce service gère l'intégration avec Stripe Checkout.
// Il communique avec le backend pour créer des sessions de paiement
// et redirige l'utilisateur vers la page de paiement Stripe.
//
// PROCESSUS DE PAIEMENT :
// 1. L'utilisateur clique sur "Payer" dans le panier
// 2. Ce service envoie le panier au backend
// 3. Le backend crée une session Stripe et renvoie une URL
// 4. L'utilisateur est redirigé vers Stripe pour payer
// 5. Après paiement, Stripe redirige vers success/cancel
// ==========================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartItem } from './cart.service';
import { AuthService } from './auth.service';

/**
 * Interface pour la réponse de création de session Stripe
 */
export interface StripeSessionResponse {
  success: boolean;
  url?: string;           // URL de paiement Stripe
  sessionId?: string;     // ID de la session Stripe
  error?: string;         // Message d'erreur si échec
}

/**
 * Interface pour le statut d'une session Stripe
 */
export interface StripeSessionStatus {
  success: boolean;
  status?: string;        // 'complete', 'expired', 'open'
  payment_status?: string; // 'paid', 'unpaid', 'no_payment_required'
  customer_email?: string;
  amount_total?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  // URL de l'API backend
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('💳 StripeService initialisé');
  }

  // ==========================================
  // MÉTHODE PRINCIPALE : Créer une session de paiement
  // ==========================================
  /**
   * Crée une session Stripe Checkout et redirige vers la page de paiement
   * 
   * @param cartItems - Les articles du panier à payer
   * @returns Observable avec l'URL de paiement ou une erreur
   * 
   * PROCESSUS :
   * 1. Récupère le token d'authentification
   * 2. Envoie le panier au backend
   * 3. Le backend crée une session Stripe
   * 4. Retourne l'URL de paiement
   */
  createCheckoutSession(cartItems: CartItem[]): Observable<StripeSessionResponse> {
    // Récupère l'utilisateur connecté
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      console.error('❌ Utilisateur non connecté');
      return throwError(() => new Error('Vous devez être connecté pour payer'));
    }

    // Récupère le token JWT depuis le localStorage
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('❌ Token non trouvé');
      return throwError(() => new Error('Session expirée, veuillez vous reconnecter'));
    }

    // Prépare les headers avec le token d'authentification
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Prépare les données à envoyer au backend
    const payload = {
      cartItems: cartItems,
      userEmail: currentUser.email
    };

    console.log('📤 Envoi au backend Stripe:', {
      email: currentUser.email,
      nbArticles: cartItems.length
    });

    // Appel API vers le backend
    return this.http.post<StripeSessionResponse>(
      `${this.apiUrl}/stripe/create-checkout-session`,
      payload,
      { headers }
    ).pipe(
      tap(response => {
        if (response.success) {
          console.log('✅ Session Stripe créée:', response.sessionId);
        } else {
          console.error('❌ Erreur Stripe:', response.error);
        }
      }),
      catchError(error => {
        console.error('❌ Erreur API Stripe:', error);
        return throwError(() => new Error(
          error.error?.error || 'Erreur lors de la création du paiement'
        ));
      })
    );
  }

  // ==========================================
  // MÉTHODE : Rediriger vers Stripe
  // ==========================================
  /**
   * Redirige l'utilisateur vers la page de paiement Stripe
   * 
   * @param url - L'URL de la session Stripe Checkout
   */
  redirectToCheckout(url: string): void {
    console.log('🔄 Redirection vers Stripe Checkout...');
    // Redirige vers la page de paiement Stripe
    window.location.href = url;
  }

  // ==========================================
  // MÉTHODE : Vérifier le statut d'une session
  // ==========================================
  /**
   * Vérifie le statut d'une session de paiement
   * Utile pour la page de confirmation après paiement
   * 
   * @param sessionId - L'ID de la session Stripe
   * @returns Observable avec le statut de la session
   */
  getSessionStatus(sessionId: string): Observable<StripeSessionStatus> {
    return this.http.get<StripeSessionStatus>(
      `${this.apiUrl}/stripe/session-status/${sessionId}`
    ).pipe(
      tap(response => {
        console.log('📋 Statut session:', response);
      }),
      catchError(error => {
        console.error('❌ Erreur récupération statut:', error);
        return throwError(() => new Error('Impossible de vérifier le paiement'));
      })
    );
  }

  // ==========================================
  // MÉTHODE TEST : Session de test simple
  // ==========================================
  /**
   * Crée une session de test à 10€ (pour le développement)
   * Ne nécessite pas d'authentification
   */
  createTestSession(): Observable<StripeSessionResponse> {
    console.log('🧪 Création session test Stripe...');
    
    return this.http.post<StripeSessionResponse>(
      `${this.apiUrl}/stripe/test-simple`,
      {}
    ).pipe(
      tap(response => {
        console.log('✅ Session test créée:', response);
      }),
      catchError(error => {
        console.error('❌ Erreur session test:', error);
        return throwError(() => new Error('Erreur lors du test Stripe'));
      })
    );
  }
}
