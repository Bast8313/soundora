import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * ==============================================
 * SERVICE D'AUTHENTIFICATION - auth.service.ts
 * ==============================================
 * 
 * Ce service gère TOUTE l'authentification de l'application :
 * - Connexion / Déconnexion
 * - Stockage du token et des infos utilisateur
 * - Vérification si l'utilisateur est connecté
 * 
 * CONCEPTS CLÉS :
 * 
 * 1. BehaviorSubject :
 *    C'est comme une "boîte" qui contient une valeur ET prévient automatiquement
 *    tous ceux qui l'écoutent quand la valeur change.
 *    Exemple : Si user passe de null à {id: 1, email: "test@test.com"},
 *    la navbar sera automatiquement notifiée et se mettra à jour !
 * 
 * 2. localStorage :
 *    Stockage permanent dans le navigateur (survit aux rafraîchissements de page)
 *    Comme une petite base de données locale
 * 
 * 3. Observable :
 *    Permet aux composants de "s'abonner" pour recevoir les notifications
 */

// Interface pour typer les données utilisateur
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

@Injectable({
  providedIn: 'root' // Le service est disponible partout dans l'application
})
export class AuthService {
  
  // URL de l'API backend
  private apiUrl = 'http://localhost:3000/api';

  // === BEHAVIORSUBJECT : État de l'utilisateur ===
  // BehaviorSubject<User | null> signifie : "contient un User OU null"
  // null = pas connecté, User = connecté
  private currentUserSubject: BehaviorSubject<User | null>;
  
  // Observable public : les composants peuvent s'y abonner pour recevoir les mises à jour
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    // === INITIALISATION AU DÉMARRAGE ===
    // On vérifie si un utilisateur est déjà connecté (token stocké)
    const storedUser = localStorage.getItem('currentUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    
    // On initialise le BehaviorSubject avec l'utilisateur trouvé (ou null)
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    console.log('🔐 AuthService initialisé, utilisateur:', initialUser ? initialUser.email : 'non connecté');
  }

  // =========================================
  // GETTER : Valeur actuelle de l'utilisateur
  // =========================================
  // Permet d'accéder rapidement à l'utilisateur sans s'abonner
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // =========================================
  // MÉTHODE : Vérifier si l'utilisateur est connecté
  // =========================================
  /**
   * Retourne true si un utilisateur est connecté, false sinon
   * Utilisé dans les *ngIf de la navbar pour afficher/masquer des boutons
   */
  public isLoggedIn(): boolean {
    const isLogged = !!this.currentUserValue; // !! convertit en boolean (null devient false, objet devient true)
    console.log('🔍 Vérification connexion:', isLogged);
    return isLogged;
  }

  // =========================================
  // MÉTHODE : Connexion (LOGIN)
  // =========================================
  /**
   * Envoie email/password au backend
   * Si succès : stocke le token et les infos utilisateur
   * 
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Observable avec la réponse du serveur
   */
  login(email: string, password: string): Observable<any> {
    console.log('📤 Tentative de connexion pour:', email);
    
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          // tap() permet d'exécuter du code quand la requête réussit
          // sans modifier la réponse
          
          if (response.success && response.user) {
            console.log('✅ Connexion réussie !', response.user);
            
            // 1. Stocker le token dans localStorage (pour les futures requêtes API)
            if (response.access_token) {
              localStorage.setItem('access_token', response.access_token);
            }
            
            // 2. Stocker les infos utilisateur
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // 3. Mettre à jour le BehaviorSubject
            // IMPORTANT : Ceci notifie automatiquement TOUS les composants qui écoutent !
            // La navbar va se mettre à jour toute seule grâce à ça
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  // =========================================
  // MÉTHODE : Déconnexion (LOGOUT)
  // =========================================
  /**
   * Déconnecte l'utilisateur :
   * - Supprime le token
   * - Supprime les infos utilisateur
   * - Notifie tous les composants
   */
  logout(): void {
    console.log('🚪 Déconnexion...');
    
    // 1. Supprimer toutes les données stockées
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    
    // 2. Mettre à jour le BehaviorSubject avec null
    // Ceci notifie automatiquement la navbar et tous les autres composants
    this.currentUserSubject.next(null);
    
    console.log('✅ Déconnexion terminée');
  }

  // =========================================
  // MÉTHODE : Inscription (REGISTER)
  // =========================================
  /**
   * Envoie les données d'inscription au backend
   * Si succès : connecte automatiquement l'utilisateur
   * 
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @param firstName - Prénom (optionnel)
   * @param lastName - Nom (optionnel)
   * @returns Observable avec la réponse du serveur
   */
  register(email: string, password: string, firstName?: string, lastName?: string): Observable<any> {
    console.log('📤 Tentative d\'inscription pour:', email);
    
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { 
      email, 
      password,
      first_name: firstName,
      last_name: lastName
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          console.log('✅ Inscription réussie !', response.user);
          
          // 1. Stocker le token dans localStorage
          if (response.session?.access_token) {
            localStorage.setItem('access_token', response.session.access_token);
          }
          
          // 2. Stocker les infos utilisateur
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // 3. Mettre à jour le BehaviorSubject (notifie tous les composants)
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // =========================================
  // MÉTHODE : Récupérer le token d'accès
  // =========================================
  /**
   * Utilisé par les autres services pour ajouter le token
   * dans les en-têtes des requêtes HTTP
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
