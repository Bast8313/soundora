// === IMPORTS NÉCESSAIRES ===
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// === INTERFACES POUR TYPAGE TYPESCRIPT ===

// Interface pour la réponse de connexion du backend
// Définit la structure des données renvoyées par l'API d'authentification
interface AuthResponse {
  success: boolean;     // Indique si l'opération a réussi
  message: string;      // Message descriptif (succès ou erreur)
  user?: {              // Données utilisateur (optionnel)
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  access_token?: string; // Token JWT pour l'authentification (optionnel)
  session?: any;         // Session Supabase (optionnel)
}

// Interface pour les données utilisateur
// Structure simplifiée des informations utilisateur utilisées dans l'app
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

// === SERVICE D'AUTHENTIFICATION ===
// @Injectable: Décorateur qui permet l'injection de dépendances
// providedIn: 'root' : Service singleton disponible dans toute l'application
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL de base de l'API backend
  private apiUrl = 'http://localhost:3010/api';
  
    // === GESTION D'ÉTAT AVEC BEHAVIORSUBJECT ===
  // BehaviorSubject : Observable qui garde la dernière valeur émise
  // Permet aux composants de s'abonner aux changements d'état
  
  // Gestion de l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Gestion de l'état de connexion (connecté/déconnecté)
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * CONSTRUCTEUR DU SERVICE D'AUTHENTIFICATION
   * Injection des dépendances nécessaires au fonctionnement
   * Initialise l'état d'authentification au démarrage
   * 
   * @param http - Client HTTP pour les appels API
   * @param router - Service de navigation pour les redirections
   */
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // INITIALISATION : Vérifier si l'utilisateur est déjà connecté
    // Appel au démarrage pour restaurer l'état d'authentification
    this.checkAuthState();
  }

  /**
   * MÉTHODE DE VÉRIFICATION D'ÉTAT AU DÉMARRAGE
   * Vérifie l'état d'authentification au démarrage de l'application
   * en cherchant un token dans le localStorage
   */
  private checkAuthState(): void {
    const token = this.getToken();
    if (token) {
      // Si un token existe, vérifier s'il est encore valide
      this.getCurrentUser().subscribe({
        next: (response) => {
          if (response.success && response.user) {
            // Token valide : mettre à jour l'état
            this.currentUserSubject.next(response.user);
            this.isLoggedInSubject.next(true);
            console.log('État de connexion mis à jour:', true);
            console.log('Utilisateur actuel mis à jour:', response.user);
          } else {
            // Token invalide, nettoyer le localStorage
            this.clearAuthData();
          }
        },
        error: () => {
          // Erreur lors de la vérification, nettoyer le localStorage
          this.clearAuthData();
        }
      });
    }
  }

  /**
   * MÉTHODE D'INSCRIPTION
   * Inscription d'un nouvel utilisateur avec Supabase
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @param firstName - Prénom (optionnel)
   * @param lastName - Nom (optionnel)
   * @returns Observable contenant la réponse de l'API
   */
  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    // Préparation des données à envoyer au backend
    const registerData = {
      email,
      password,
      first_name: firstName || '',
      last_name: lastName || ''
    };

    // Requête HTTP POST vers l'endpoint d'inscription
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        // tap() : opérateur RxJS qui permet d'effectuer des actions sans modifier le flux
        tap(response => {
          if (response.success && response.access_token && response.user) {
            // Si l'inscription est réussie :
            // 1. Sauvegarder le token dans localStorage
            this.setToken(response.access_token);
            // 2. Mettre à jour l'état utilisateur
            this.currentUserSubject.next(response.user);
            // 3. Marquer comme connecté
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  /**
   * MÉTHODE DE CONNEXION
   * Connexion d'un utilisateur existant avec email/mot de passe
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Observable contenant la réponse de l'API
   */
  login(email: string, password: string): Observable<AuthResponse> {
    // Requête HTTP POST vers l'endpoint de connexion
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.access_token && response.user) {
            // Si la connexion est réussie :
            // 1. Sauvegarder le token dans localStorage
            this.setToken(response.access_token);
            // 2. Mettre à jour l'état utilisateur
            this.currentUserSubject.next(response.user);
            // 3. Marquer comme connecté
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  /**
   * MÉTHODE DE DÉCONNEXION
   * Déconnexion de l'utilisateur (côté serveur + nettoyage local)
   * @returns Observable pour la requête de déconnexion
   */
  logout(): Observable<any> {
    // Requête HTTP POST vers l'endpoint de déconnexion
    return this.http.post(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          // Nettoyer les données locales peu importe la réponse du serveur
          this.clearAuthData();
          // Rediriger vers la page d'accueil après déconnexion
          this.router.navigate(['/']);
        })
      );
  }

  /**
   * MÉTHODE DE RÉCUPÉRATION UTILISATEUR
   * Récupère les informations de l'utilisateur actuel depuis le serveur
   * Utilisée pour vérifier la validité du token au démarrage
   * @returns Observable contenant les données utilisateur
   */
  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`, {
      headers: {
        // Ajout du token dans l'en-tête Authorization
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR LE TOKEN
  // =====================================

  /**
   * RÉCUPÈRE LE TOKEN JWT STOCKÉ
   * Récupère le token JWT stocké dans le localStorage
   * Vérification de l'environnement pour éviter les erreurs SSR
   * @returns Token JWT ou null si absent
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * STOCKE LE TOKEN JWT
   * Stocke le token JWT dans le localStorage de manière sécurisée
   * @param token - Token JWT à stocker
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * NETTOIE LES DONNÉES D'AUTHENTIFICATION
   * Nettoie toutes les données d'authentification
   * - Supprime le token du localStorage
   * - Remet à zéro l'état utilisateur
   * - Marque comme déconnecté
   */
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // =====================================
  // MÉTHODES D'AIDE POUR LES COMPOSANTS
  // =====================================

  /**
   * VÉRIFIE SI L'UTILISATEUR EST CONNECTÉ
   * Vérifie si l'utilisateur est actuellement connecté
   * Retourne la valeur actuelle du BehaviorSubject
   * @returns true si connecté, false sinon
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * RÉCUPÈRE LES DONNÉES UTILISATEUR ACTUELLES
   * Récupère les données de l'utilisateur actuel
   * Retourne la valeur actuelle du BehaviorSubject utilisateur
   * @returns Données utilisateur ou null si déconnecté
   */
  getCurrentUserData(): User | null {
    return this.currentUserSubject.value;
  }
}
