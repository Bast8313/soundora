// =====================================
// IMPORTS POUR LE COMPOSANT LOGIN
// =====================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Directives Angular de base (ngIf, ngFor, etc.)
import { FormsModule } from '@angular/forms'; // Module pour liaison de formulaires [(ngModel)]
import { Router } from '@angular/router'; // Service de navigation Angular
import { AuthService } from '../../services/auth.service'; // Service d'authentification

/**
 * COMPOSANT DE CONNEXION/INSCRIPTION
 * Gère l'authentification des utilisateurs avec double fonctionnalité :
 * - Mode login : Connexion utilisateur existant
 * - Mode register : Inscription nouvel utilisateur
 * Includes validation, gestion d'erreurs et redirection automatique
 */
@Component({
  selector: 'app-login',              // Sélecteur HTML : <app-login></app-login>
  standalone: true,                  // Composant autonome (Angular 14+)
  imports: [CommonModule, FormsModule], // Modules requis pour directives et formulaires
  templateUrl: './login.component.html', // Template HTML associé
  styleUrls: ['./login.component.css']   // Styles CSS associés
})
export class LoginComponent {
  
  // =====================================
  // PROPRIÉTÉS DU FORMULAIRE
  // =====================================
  email = '';           // Email utilisateur (requis pour connexion/inscription)
  password = '';        // Mot de passe (requis)
  
  // =====================================
  // GESTION DES ÉTATS INTERFACE
  // =====================================
  error = '';           // Message d'erreur à afficher à l'utilisateur
  isLoading = false;    // État de chargement (désactive formulaire pendant requête)
  
  // =====================================
  // MODE D'AFFICHAGE DU COMPOSANT
  // =====================================
  mode: 'login' | 'register' = 'login'; // Bascule entre connexion et inscription
  
  // =====================================
  // CHAMPS SUPPLÉMENTAIRES INSCRIPTION
  // =====================================
  firstName = '';       // Prénom utilisateur (optionnel pour inscription)
  lastName = '';        // Nom utilisateur (optionnel pour inscription)
  confirmPassword = ''; // Confirmation mot de passe (validation inscription)

  /**
   * CONSTRUCTEUR - INJECTION DES DÉPENDANCES
   * @param authService - Service pour gestion authentification
   * @param router - Service pour navigation après connexion
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // =====================================
  // MÉTHODES D'AUTHENTIFICATION
  // =====================================

  /**
   * CONNEXION UTILISATEUR EXISTANT
   * Authentifie un utilisateur avec email/mot de passe
   */
  login(): void {
    // VALIDATION CÔTÉ CLIENT
    if (!this.email || !this.password) {
      this.error = 'Email et mot de passe requis';
      return;
    }

    // Validation format email basique avec regex
    if (!this.isValidEmail(this.email)) {
      this.error = 'Format d\'email invalide';
      return;
    }

    // === PRÉPARATION DE LA REQUÊTE ===
    this.isLoading = true;  // Active l'indicateur de chargement
    this.error = '';        // Efface les erreurs précédentes

    // === APPEL AU SERVICE D'AUTHENTIFICATION ===
    this.authService.login(this.email, this.password).subscribe({
      // Cas de succès
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Connexion réussie:', response.user);
          // Redirection vers la page d'accueil après connexion réussie
          this.router.navigate(['/']);
        } else {
          // Erreur retournée par l'API
          this.error = response.message || 'Erreur de connexion';
        }
      },
      // Cas d'erreur HTTP
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur de connexion:', err);
        
        // === GESTION DES DIFFÉRENTS TYPES D'ERREURS ===
        if (err.status === 401) {
          this.error = 'Email ou mot de passe incorrect';
        } else if (err.status === 400) {
          this.error = err.error?.message || 'Données invalides';
        } else if (err.status === 0) {
          this.error = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  /**
   * === MÉTHODE D'INSCRIPTION ===
   * Gère l'inscription d'un nouvel utilisateur
   */
  register(): void {
    // === VALIDATIONS ÉTENDUES POUR L'INSCRIPTION ===
    // Validation des champs requis
    if (!this.email || !this.password) {
      this.error = 'Email et mot de passe requis';
      return;
    }

    // Validation format email avec regex
    if (!this.isValidEmail(this.email)) {
      this.error = 'Format d\'email invalide';
      return;
    }

    // Validation longueur mot de passe (sécurité)
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    // Validation confirmation mot de passe
    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    // === PRÉPARATION DE LA REQUÊTE ===
    this.isLoading = true;
    this.error = '';

    // === APPEL AU SERVICE POUR L'INSCRIPTION ===
    // Envoie firstName et lastName même s'ils sont vides (optionnels)
    this.authService.register(this.email, this.password, this.firstName, this.lastName).subscribe({
      // Cas de succès
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Inscription réussie:', response.user);
          // Redirection vers la page d'accueil après inscription réussie
          this.router.navigate(['/']);
        } else {
          // Erreur retournée par l'API
          this.error = response.message || 'Erreur lors de l\'inscription';
        }
      },
      // Cas d'erreur HTTP
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur d\'inscription:', err);
        
        // === GESTION DES ERREURS SPÉCIFIQUES À L'INSCRIPTION ===
        if (err.status === 400) {
          // Erreur de validation côté serveur (ex: email déjà utilisé)
          this.error = err.error?.message || 'Données invalides';
        } else if (err.status === 0) {
          // Problème de connexion réseau
          this.error = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          // Erreur générique
          this.error = 'Une erreur est survenue lors de l\'inscription.';
        }
      }
    });
  }

  // === MÉTHODES UTILITAIRES ===

  /**
   * Basculer entre les modes connexion et inscription
   * Réinitialise le formulaire et les erreurs pour éviter la confusion
   */
  toggleMode(): void {
    // Bascule entre 'login' et 'register'
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = '';        // Efface les erreurs précédentes
    this.clearForm();       // Vide tous les champs
  }

  /**
   * Vide tous les champs du formulaire
   * Utilisée lors du changement de mode ou après une action
   */
  private clearForm(): void {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.firstName = '';
    this.lastName = '';
  }

  /**
   * Validation basique du format email avec regex
   * Vérifie la structure générale : xxx@xxx.xxx
   * @param email - Email à valider
   * @returns true si le format est valide, false sinon
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * === GESTION DE LA SOUMISSION DU FORMULAIRE ===
   * Point d'entrée unique pour la soumission
   * Redirige vers login() ou register() selon le mode actuel
   */
  onSubmit(): void {
    if (this.mode === 'login') {
      this.login();
    } else {
      this.register();
    }
  }
}
