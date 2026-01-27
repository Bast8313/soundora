// === IMPORTS ANGULAR ===
import { Component } from '@angular/core';           // Décorateur pour créer un composant
import { CommonModule } from '@angular/common';     // Directives Angular (*ngIf, *ngFor, pipes)
import { FormsModule } from '@angular/forms';       // Pour les formulaires (ngModel)
import { Router } from '@angular/router';           // Pour la navigation entre pages

// === IMPORT DU SERVICE ===
import { AuthService } from '../../services/auth.service';

/**
 * ===============================================
 * COMPOSANT REGISTER - register.component.ts
 * ===============================================
 * 
 * Ce composant gère la PAGE D'INSCRIPTION de l'application.
 * 
 * RÔLE :
 * - Afficher un formulaire d'inscription complet
 * - Valider les données en temps réel (force du mot de passe)
 * - Vérifier la correspondance des mots de passe
 * - Envoyer les données au backend via AuthService
 * - Connecter automatiquement l'utilisateur après inscription
 * 
 * DIFFÉRENCES AVEC LOGIN :
 * - Plus de champs (prénom, nom, confirmation mot de passe)
 * - Validation du mot de passe plus stricte (majuscule, minuscule, chiffre)
 * - Indicateurs visuels de validation en temps réel
 * 
 * CONCEPTS PÉDAGOGIQUES :
 * - Validation côté client (JAMAIS faire confiance à l'utilisateur)
 * - Expressions régulières (regex) pour valider format de données
 * - Méthodes de validation réutilisables
 * - UX : feedback visuel immédiat à l'utilisateur
 */

@Component({
  selector: 'app-register',                   // Tag HTML : <app-register>
  standalone: true,                           // Composant autonome
  imports: [CommonModule, FormsModule],       // Modules nécessaires
  templateUrl: './register.component.html',   // Template HTML
  styleUrls: ['./register.component.css']     // Styles CSS
})
export class RegisterComponent {
  
  // =========================================
  // PROPRIÉTÉS : DONNÉES DU FORMULAIRE
  // =========================================
  // Liées aux champs via [(ngModel)] = binding bidirectionnel
  // TS ↔ HTML : si l'utilisateur tape dans l'input, la propriété est mise à jour
  
  email = '';                                 // Email de l'utilisateur
  password = '';                              // Mot de passe choisi
  confirmPassword = '';                       // Confirmation du mot de passe
  firstName = '';                             // Prénom (optionnel)
  lastName = '';                              // Nom (optionnel)
  
  // =========================================
  // PROPRIÉTÉS : ÉTATS DU COMPOSANT
  // =========================================
  // Ces booléens contrôlent l'affichage d'éléments dans le template
  
  loading = false;                            // true = requête en cours (affiche spinner)
  errorMessage = '';                          // Message d'erreur à afficher
  showPassword = false;                       // true = affiche password en clair
  showConfirmPassword = false;                // true = affiche confirmPassword en clair
  
  // =========================================
  // PROPRIÉTÉ : ERREURS DE VALIDATION
  // =========================================
  // Tableau des erreurs de validation du mot de passe
  // Exemple : ['Au moins 6 caractères', 'Au moins une majuscule']
  passwordErrors: string[] = [];

  // =========================================
  // CONSTRUCTEUR : INJECTION DE DÉPENDANCES
  // =========================================
  /**
   * Angular injecte automatiquement les services nécessaires.
   * private = accessible uniquement dans cette classe
   */
  constructor(
    private authService: AuthService,         // Service d'authentification
    private router: Router                    // Service de navigation
  ) {}

  // =========================================
  // MÉTHODE : Validation de la force du mot de passe
  // =========================================
  /**
   * Vérifie que le mot de passe respecte les critères de sécurité.
   * 
   * CRITÈRES :
   * - Au moins 6 caractères
   * - Au moins une majuscule (A-Z)
   * - Au moins une minuscule (a-z)
   * - Au moins un chiffre (0-9)
   * 
   * CONCEPT : Expressions régulières (REGEX)
   * Une regex est un pattern pour rechercher/valider du texte.
   * 
   * Exemples :
   * - /[A-Z]/ : Cherche une lettre majuscule de A à Z
   * - /[a-z]/ : Cherche une lettre minuscule de a à z
   * - /[0-9]/ : Cherche un chiffre de 0 à 9
   * - .test(string) : Retourne true si le pattern est trouvé
   * 
   * @returns true si le mot de passe est valide, false sinon
   */
  validatePassword(): boolean {
    // Réinitialiser le tableau des erreurs
    this.passwordErrors = [];

    // TEST 1 : Longueur minimale
    if (this.password.length < 6) {
      this.passwordErrors.push('Au moins 6 caractères');
    }
    
    // TEST 2 : Au moins une majuscule
    // /[A-Z]/ = cherche une lettre de A à Z
    // ! devant = inverse le résultat (! = NOT)
    // Donc : si AUCUNE majuscule n'est trouvée
    if (!/[A-Z]/.test(this.password)) {
      this.passwordErrors.push('Au moins une majuscule');
    }
    
    // TEST 3 : Au moins une minuscule
    if (!/[a-z]/.test(this.password)) {
      this.passwordErrors.push('Au moins une minuscule');
    }
    
    // TEST 4 : Au moins un chiffre
    if (!/[0-9]/.test(this.password)) {
      this.passwordErrors.push('Au moins un chiffre');
    }

    // Retourne true si AUCUNE erreur (tableau vide)
    // .length === 0 signifie "tableau vide"
    return this.passwordErrors.length === 0;
  }

  // =========================================
  // MÉTHODES DE VALIDATION POUR LE TEMPLATE
  // =========================================
  /**
   * Ces méthodes sont appelées depuis le template HTML pour afficher
   * les indicateurs visuels de validation (✓ vert ou gris).
   * 
   * POURQUOI DES MÉTHODES SÉPARÉES ?
   * Angular ne peut pas utiliser les regex directement dans le HTML.
   * Il faut créer des méthodes TypeScript qui retournent un boolean.
   * 
   * EXEMPLE D'UTILISATION dans le HTML :
   * <div [class.valid]="hasMinLength()">
   *   ✓ Au moins 6 caractères
   * </div>
   * 
   * Si hasMinLength() retourne true, la classe "valid" est ajoutée
   */
  
  /**
   * Vérifie si le mot de passe a au moins 6 caractères
   */
  hasMinLength(): boolean {
    return this.password.length >= 6;
  }

  /**
   * Vérifie si le mot de passe contient au moins une majuscule
   * Regex : [A-Z] = une lettre de A à Z
   */
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  /**
   * Vérifie si le mot de passe contient au moins une minuscule
   * Regex : [a-z] = une lettre de a à z
   */
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password);
  }

  /**
   * Vérifie si le mot de passe contient au moins un chiffre
   * Regex : [0-9] = un chiffre de 0 à 9
   */
  hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  // =========================================
  // MÉTHODE PRINCIPALE : Soumission du formulaire
  // =========================================
  /**
   * Appelée quand l'utilisateur clique sur "Créer mon compte".
   * 
   * ÉTAPES DÉTAILLÉES :
   * 1. Réinitialisation des erreurs
   * 2. Validation de tous les champs
   * 3. Appel à l'API d'inscription
   * 4. Gestion succès/erreur
   * 
   * VALIDATIONS EFFECTUÉES :
   * - Champs obligatoires remplis
   * - Format email valide
   * - Mot de passe assez fort
   * - Mots de passe identiques
   */
  onSubmit(): void {
    // === ÉTAPE 1 : RÉINITIALISATION ===
    this.errorMessage = '';
    this.passwordErrors = [];

    // === ÉTAPE 2 : VALIDATIONS CÔTÉ CLIENT ===
    
    // VALIDATION 1 : Champs obligatoires
    // Les champs email, password et confirmPassword sont OBLIGATOIRES
    // ! signifie "si c'est vide/null/undefined"
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;  // Arrête l'exécution si validation échoue
    }

    // VALIDATION 2 : Format de l'email
    // Regex expliquée :
    // ^        = début de la chaîne
    // [^\s@]+  = un ou plusieurs caractères qui ne sont ni espace ni @
    // @        = le symbole arobase
    // [^\s@]+  = encore des caractères (nom de domaine)
    // \.       = un point (échappé avec \)
    // [^\s@]+  = extension (.com, .fr, etc.)
    // $        = fin de la chaîne
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Email invalide';
      return;
    }

    // VALIDATION 3 : Force du mot de passe
    // Appelle notre méthode validatePassword() définie plus haut
    if (!this.validatePassword()) {
      this.errorMessage = 'Le mot de passe ne respecte pas les critères de sécurité';
      return;
    }

    // VALIDATION 4 : Correspondance des mots de passe
    // Opérateur !== signifie "différent de"
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    // === ÉTAPE 3 : APPEL À L'API ===
    // Toutes les validations sont OK, on peut envoyer les données
    this.loading = true;  // Active le spinner de chargement

    // Appel au service d'authentification
    // register() retourne un Observable (flux asynchrone)
    this.authService.register(
      this.email,           // Email (obligatoire)
      this.password,        // Mot de passe (obligatoire)
      this.firstName,       // Prénom (optionnel, peut être vide)
      this.lastName         // Nom (optionnel, peut être vide)
    ).subscribe({
      // === CAS DE SUCCÈS ===
      // next: se déclenche si la requête HTTP retourne 200/201
      next: (response) => {
        console.log('✅ Inscription réussie', response);
        this.loading = false;
        
        // Le service a déjà stocké le token et connecté l'utilisateur
        // On redirige vers la page des produits
        this.router.navigate(['/products']);
      },
      
      // === CAS D'ERREUR ===
      // error: se déclenche si la requête échoue (4xx, 5xx)
      error: (error) => {
        console.error('❌ Erreur d\'inscription', error);
        this.loading = false;
        
        // Gestion des différents types d'erreurs
        if (error.error?.message) {
          // Message personnalisé du serveur
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          // 400 Bad Request = données invalides ou email déjà utilisé
          this.errorMessage = 'Données invalides ou email déjà utilisé';
        } else if (error.status === 0) {
          // Status 0 = impossible de joindre le serveur
          this.errorMessage = 'Impossible de contacter le serveur';
        } else {
          // Erreur générique pour tout autre cas
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  // =========================================
  // MÉTHODES UTILITAIRES
  // =========================================
  
  /**
   * Bascule l'affichage du mot de passe (masqué ↔ visible)
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Bascule l'affichage de la confirmation du mot de passe
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Navigation vers la page de connexion
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Vérifie si le formulaire peut être soumis.
   * 
   * CONDITIONS :
   * - Pas de requête en cours (loading = false)
   * - Email rempli
   * - Mot de passe rempli
   * - Confirmation remplie
   * 
   * OPÉRATEURS LOGIQUES :
   * && = ET (toutes les conditions doivent être vraies)
   * ! = NON (inverse le booléen)
   * .length > 0 = vérifie que la chaîne n'est pas vide
   * 
   * @returns true si le formulaire peut être soumis
   */
  canSubmit(): boolean {
    return !this.loading &&                    // Pas de chargement en cours
           this.email.length > 0 &&            // Email rempli
           this.password.length > 0 &&         // Mot de passe rempli
           this.confirmPassword.length > 0;    // Confirmation remplie
  }

  /**
   * Retour à la page précédente
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
