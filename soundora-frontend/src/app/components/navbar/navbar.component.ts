import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService, Category } from '../../services/category.service';
import { AuthService, User } from '../../services/auth.service';

/**
 * =====================================
 * COMPOSANT NAVBAR PRINCIPALE
 * =====================================
 * 
 * Contient :
 * - Logo Soundora
 * - Menu de catégories
 * - Actions utilisateur (panier, connexion/déconnexion)
 * - Menu burger pour mobile
 * 
 * NOUVEAUTÉ : Gestion de l'authentification
 * - Affiche "Connexion/Inscription" si utilisateur NON connecté
 * - Affiche "Bonjour [prénom] | Déconnexion" si utilisateur CONNECTÉ
 * 
 * CONCEPTS CLÉS :
 * 
 * 1. Subscription (import rxjs) :
 *    Permet de "s'abonner" à un Observable et de recevoir les notifications
 *    IMPORTANT : Il faut se désabonner quand le composant est détruit (pour éviter les fuites mémoire)
 * 
 * 2. OnDestroy :
 *    Interface Angular qui permet d'exécuter du code quand le composant est détruit
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  // État du menu burger (ouvert/fermé)
  isMenuOpen: boolean = false;

  // État du dropdown catégories (ouvert/fermé)
  isCategoriesDropdownOpen: boolean = false;

  // Nombre d'articles dans le panier (à remplacer par la vraie valeur du service)
  cartItemCount: number = 0;

  // Liste des catégories avec leurs sous-catégories
  categories: Category[] = [];

  // === NOUVEAUTÉ : GESTION DE L'UTILISATEUR ===
  
  // L'utilisateur actuellement connecté (ou null si déconnecté)
  currentUser: User | null = null;
  
  // Subscription pour écouter les changements d'utilisateur
  // On doit stocker la subscription pour pouvoir se désabonner plus tard
  private userSubscription!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,  // Injection du service d'authentification
    private router: Router              // Pour naviguer après déconnexion
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // === NOUVEAUTÉ : S'ABONNER AUX CHANGEMENTS D'UTILISATEUR ===
    // Quand l'utilisateur se connecte ou se déconnecte,
    // le AuthService émet une nouvelle valeur via son BehaviorSubject
    // La navbar reçoit automatiquement la notification et se met à jour !
    console.log('🔔 Navbar : Abonnement aux changements utilisateur');
    
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('👤 Navbar : Nouvel état utilisateur:', user);
      this.currentUser = user;
    });
  }
  
  /**
   * === NOUVEAUTÉ : NETTOYAGE À LA DESTRUCTION ===
   * ngOnDestroy() est appelé automatiquement par Angular
   * quand le composant est détruit (changement de page, etc.)
   * 
   * IMPORTANT : On doit se désabonner pour éviter les fuites mémoire !
   * Si on ne le fait pas, la subscription continue d'écouter même après
   * la destruction du composant.
   */
  ngOnDestroy(): void {
    // Se désabonner si la subscription existe
    if (this.userSubscription) {
      console.log('🔕 Navbar : Désabonnement des changements utilisateur');
      this.userSubscription.unsubscribe();
    }
  }

  // Charge les catégories depuis l'API
  loadCategories(): void {
    console.log('Chargement des catégories...');
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log('Réponse catégories:', response);
        if (response.success) {
          // Organise les catégories en structure hiérarchique
          this.categories = this.categoryService.organizeCategoriesHierarchy(response.data);
          console.log('Catégories organisées:', this.categories);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  // Bascule l'état du menu burger
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Ferme le menu burger (utile après un clic sur un lien)
  closeMenu(): void {
    this.isMenuOpen = false;
    this.isCategoriesDropdownOpen = false;
  }

  // Bascule le dropdown des catégories
  toggleCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }

  // Ouvre le dropdown des catégories
  openCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = true;
  }

  // Ferme le dropdown des catégories (menu)
  closeCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = false;
  }
  
  // === NOUVEAUTÉ : MÉTHODES D'AUTHENTIFICATION ===
  
  /**
   * Vérifie si un utilisateur est connecté
   * Utilisé dans le template avec *ngIf pour afficher conditionnellement
   * les boutons de connexion/déconnexion
   * 
   * @returns true si connecté, false sinon
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  /**
   * Déconnecte l'utilisateur et le redirige vers la page d'accueil
   * 
   * FONCTIONNEMENT :
   * 1. Appelle authService.logout() qui :
   *    - Supprime le token du localStorage
   *    - Met à jour le BehaviorSubject à null
   * 2. Le BehaviorSubject notifie automatiquement la navbar
   * 3. La navbar se met à jour toute seule grâce à la subscription
   * 4. Redirection vers l'accueil
   */
  logout(): void {
    console.log('🚪 Navbar : Déconnexion demandée');
    this.authService.logout();
    this.router.navigate(['/']); // Redirige vers l'accueil
    this.closeMenu(); // Ferme le menu burger si ouvert
  }
}
