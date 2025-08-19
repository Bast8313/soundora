// =====================================
// IMPORTS POUR LE SERVICE DE CHECKOUT
// =====================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Configuration API URL

// =====================================
// INTERFACES TYPESCRIPT POUR LE CHECKOUT
// =====================================

/**
 * INTERFACE POUR UN ARTICLE DU PANIER
 * Définit la structure d'un produit lors du checkout
 * Utilisée pour standardiser les données envoyées à Stripe
 */
export interface CheckoutItem {
  id: string;        // ID unique du produit en base de données
  name: string;      // Nom commercial du produit (affiché sur la facture)
  price: number;     // Prix unitaire en euros (ex: 119.00)
  quantity: number;  // Quantité commandée par le client
}

/**
 * INTERFACE POUR LA REQUÊTE DE CHECKOUT
 * Structure des données envoyées au backend pour créer une session Stripe
 * Contient tous les éléments nécessaires au paiement
 */
export interface CheckoutRequest {
  items: CheckoutItem[];  // Liste complète des articles du panier
  customerEmail: string;  // Email obligatoire pour la facturation Stripe
}

/**
 * INTERFACE POUR LA RÉPONSE DU BACKEND
 * Structure des données renvoyées après création de la session Stripe
 * Permet de savoir si l'opération a réussi et où rediriger l'utilisateur
 */
export interface CheckoutResponse {
  success: boolean;    // Indique si la session Stripe a été créée avec succès
  sessionId: string;   // ID unique de la session (pour le suivi)
  checkoutUrl: string; // URL sécurisée Stripe où rediriger l'utilisateur
}

// =====================================
// SERVICE DE CHECKOUT STRIPE
// =====================================

/**
 * SERVICE RESPONSABLE DU PROCESSUS DE PAIEMENT
 * 
 * Ce service fait le pont entre le frontend Angular et l'API backend
 * pour gérer le processus de checkout avec Stripe.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * 1. Authentification automatique des requêtes
 * 2. Création de sessions de paiement Stripe
 * 3. Redirection sécurisée vers les pages de paiement
 * 
 * FLUX COMPLET :
 * Panier → Service → Backend → Stripe → Paiement → Confirmation
 */
@Injectable({
  providedIn: 'root' // Service singleton disponible dans toute l'application
})
export class CheckoutService {
  // URL de base pour toutes les requêtes Stripe (ex: http://localhost:3010/api/stripe)
  private apiUrl = `${environment.apiUrl}/stripe`;

  /**
   * CONSTRUCTEUR - INJECTION DU CLIENT HTTP
   * @param http - Service Angular pour les requêtes HTTP
   */
  constructor(private http: HttpClient) { }

  // =====================================
  // MÉTHODES D'AUTHENTIFICATION
  // =====================================

  /**
   * RÉCUPÈRE LE TOKEN D'AUTHENTIFICATION JWT
   * 
   * Fonction utilitaire qui récupère le token stocké localement
   * après que l'utilisateur se soit connecté.
   * 
   * POURQUOI C'EST NÉCESSAIRE :
   * - L'API backend exige une authentification pour les paiements
   * - Cela assure la sécurité et associe les commandes aux utilisateurs
   * 
   * @returns Token JWT string ou null si non connecté
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * CRÉE LES HEADERS HTTP AVEC AUTHENTIFICATION
   * 
   * Cette fonction prépare les en-têtes HTTP nécessaires pour
   * communiquer avec l'API backend de manière sécurisée.
   * 
   * PROCESS DÉTAILLÉ :
   * 1. Récupère le token d'authentification
   * 2. Crée les headers de base (Content-Type)
   * 3. Ajoute l'Authorization si l'utilisateur est connecté
   * 
   * FORMAT AUTHORIZATION : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   * 
   * @returns Headers HTTP prêts pour l'envoi
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken(); // Récupération du token JWT
    
    // Headers de base pour toutes les requêtes JSON
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Si l'utilisateur est connecté, ajouter l'authentification
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // =====================================
  // MÉTHODE PRINCIPALE DE CHECKOUT
  // =====================================

  /**
   * CRÉE UNE SESSION DE CHECKOUT STRIPE
   * 
   * Cette méthode est le CŒUR du processus de paiement.
   * Elle transforme un panier d'achat en session de paiement Stripe.
   * 
   * PROCESSUS ÉTAPE PAR ÉTAPE :
   * 
   * 1. PRÉPARATION DES DONNÉES
   *    - Combine les articles du panier + email client
   *    - Structure les données selon l'API backend
   * 
   * 2. AUTHENTIFICATION
   *    - Récupère le token JWT de l'utilisateur connecté
   *    - Ajoute l'autorisation aux headers HTTP
   * 
   * 3. APPEL API BACKEND
   *    - POST vers /api/stripe/create-checkout-session
   *    - Envoie les données du panier sécurisées
   * 
   * 4. RÉPONSE STRIPE
   *    - Le backend communique avec Stripe
   *    - Stripe crée une session de paiement sécurisée
   *    - Renvoie une URL de checkout temporaire
   * 
   * EXEMPLE DE DONNÉES ENVOYÉES :
   * {
   *   items: [
   *     {id: "abc123", name: "Shure SM58", price: 119, quantity: 2}
   *   ],
   *   customerEmail: "client@soundora.com"
   * }
   * 
   * EXEMPLE DE RÉPONSE :
   * {
   *   success: true,
   *   sessionId: "cs_test_abc123...",
   *   checkoutUrl: "https://checkout.stripe.com/pay/cs_test_abc123#abc"
   * }
   * 
   * @param items - Articles du panier à acheter
   * @param customerEmail - Email du client pour la facturation
   * @returns Observable avec l'URL de redirection Stripe
   */
  createCheckoutSession(items: CheckoutItem[], customerEmail: string): Observable<CheckoutResponse> {
    // ÉTAPE 1 : Préparation des données pour l'API
    const checkoutData: CheckoutRequest = {
      items,          // Articles du panier
      customerEmail   // Email obligatoire pour Stripe
    };

    // ÉTAPE 2 : Préparation de l'authentification
    const headers = this.getAuthHeaders();

    // ÉTAPE 3 : Appel HTTP vers le backend
    // Le backend va créer la session Stripe et nous renvoyer l'URL
    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/create-checkout-session`, // Endpoint backend
      checkoutData,  // Corps de la requête
      { headers }    // Headers avec authentification
    );
  }

  // =====================================
  // MÉTHODE DE REDIRECTION
  // =====================================

  /**
   * REDIRIGE VERS LA PAGE DE PAIEMENT STRIPE
   * 
   * Une fois la session créée, cette méthode redirige l'utilisateur
   * vers la page de paiement sécurisée de Stripe.
   * 
   * POURQUOI UNE REDIRECTION :
   * - Stripe gère entièrement le processus de paiement
   * - Page sécurisée avec formulaire de carte bancaire
   * - Gestion des erreurs et validation automatique
   * - Retour automatique vers votre site après paiement
   * 
   * EXEMPLE D'URL STRIPE :
   * https://checkout.stripe.com/pay/cs_test_a1b2c3#fidkdWxOYHwnPyd1blpxYHZxWjA0SWtAa...
   * 
   * APRÈS LE PAIEMENT :
   * - Succès → Redirection vers /order/success
   * - Échec → Redirection vers /order/cancel
   * 
   * @param checkoutUrl - URL sécurisée fournie par Stripe
   */
  redirectToCheckout(checkoutUrl: string): void {
    // Redirection immédiate vers Stripe
    // L'utilisateur quitte temporairement votre site
    window.location.href = checkoutUrl;
  }
}
