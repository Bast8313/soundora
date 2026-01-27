// Importation des modules Angular nécessaires
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Décorateur Component : définit les métadonnées du composant
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Propriétés du formulaire
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  // Constructeur : injection des services nécessaires
  // Constructeur : injection des services nécessaires
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Méthode appelée lors de la soumission du formulaire
   * Valide les champs et envoie les données au service d'authentification
   */
  onSubmit(): void {
    // Réinitialisation du message d'erreur
    this.errorMessage = '';

    // Validation : vérifier que les champs ne sont pas vides
    // Validation : vérifier que les champs ne sont pas vides
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Validation : vérifier le format de l'email avec une expression régulière
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Email invalide';
      return;
    }

    // Activer le loader pendant la requête
    this.loading = true;

    // Appel au service d'authentification (Observable)
    this.authService.login(this.email, this.password).subscribe({
      // Fonction exécutée si la connexion réussit
      // Fonction exécutée si la connexion réussit
      next: (response) => {
        console.log('Connexion réussie', response);
        this.loading = false;
        this.router.navigate(['/products']);
      },
      // Fonction exécutée si la connexion échoue
      error: (error) => {
        console.error('Erreur de connexion', error);
        this.loading = false;
        
        // Gestion des différents types d'erreurs
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur';
        } else {
          this.errorMessage = 'Une erreur est survenue';
        }
      }
    });
  }

  /**
   * Bascule l'affichage du mot de passe (texte visible ou caché)
   */
  /**
   * Bascule l'affichage du mot de passe (texte visible ou caché)
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Navigation vers la page d'inscription
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
