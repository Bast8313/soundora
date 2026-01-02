import { Routes } from '@angular/router';

/**
 * =====================================
 * CONFIGURATION DES ROUTES - app.routes.ts
 * =====================================
 * 
 * Ce fichier définit TOUTES les routes/pages de l'application.
 * Chaque route mappe une URL vers un composant.
 * 
 * STRUCTURE D'UNE ROUTE :
 * {
 *   path: 'url-de-la-route',              // L'URL affichée dans le navigateur
 *   component: MonComposant,               // Le composant à afficher
 *   data: { titre: 'Mon page' }           // Données optionnelles
 * }
 * 
 * EXEMPLE DE NAVIGATION :
 * - URL: http://localhost:4200/products
 * - Angular cherche path: 'products'
 * - Affiche ProductListComponent dans <router-outlet>
 */

export const routes: Routes = [
  // ========================================
  // ROUTE PAR DÉFAUT (homepage)
  // ========================================
  {
    path: '',
    // path: '' = URL racine (http://localhost:4200)
    // Redirige vers /products pour afficher la liste des produits
    redirectTo: 'products',
    pathMatch: 'full'
    // pathMatch: 'full' = la route doit matcher exactement (pas de sous-routes)
  },

  // ========================================
  // ROUTE PRODUITS (LISTE)
  // ========================================
  // Exemple à implémenter plus tard :
  // {
  //   path: 'products',
  //   component: ProductListComponent,
  //   data: { title: 'Catalogue des produits' }
  // },

  // ========================================
  // ROUTE DÉTAIL D'UN PRODUIT
  // ========================================
  // Exemple à implémenter plus tard :
  // {
  //   path: 'product/:slug',
  //   component: ProductDetailComponent,
  //   // :slug = paramètre dynamique (guitare-fender-stratocaster)
  //   data: { title: 'Détail du produit' }
  // },

  // ========================================
  // ROUTE PANIER
  // ========================================
  // Exemple à implémenter plus tard :
  // {
  //   path: 'cart',
  //   component: CartComponent,
  //   data: { title: 'Mon panier' }
  // },

  // ========================================
  // ROUTE AUTHENTIFICATION
  // ========================================
  // Exemple à implémenter plus tard :
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   data: { title: 'Connexion' }
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: { title: 'Inscription' }
  // },

  // ========================================
  // ROUTE CATCH-ALL (page 404)
  // ========================================
  // Cette route DOIT être la dernière !
  // Elle capture toute URL non définie et affiche une page 404
  {
    path: '**',
    // path: '**' = wildcard (attrape toutes les routes non trouvées)
    // Exemple : http://localhost:4200/page-inexistante
    redirectTo: ''
    // Redirige vers la page d'accueil
  }
];
