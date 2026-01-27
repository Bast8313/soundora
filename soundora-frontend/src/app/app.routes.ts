import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FaqComponent } from './components/faq/faq.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

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
  {
    path: 'products',
    component: ProductListComponent,
    data: { title: 'Catalogue des produits' }
  },

  // ========================================
  // ROUTE DÉTAILS D'UN PRODUIT
  // ========================================
  // Le :slug est un paramètre dynamique
  // Exemple : /product/gibson-les-paul
  {
    path: 'product/:slug',
    component: ProductDetailComponent,
    data: { title: 'Détails du produit' }
  },

  // ========================================
  // ROUTE CATÉGORIES
  // ========================================
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Nos catégories' }
  },

  // ========================================
  // ROUTES AUTHENTIFICATION
  // ========================================
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Connexion' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Inscription' }
  },

  // ========================================
  // ROUTE FAQ (Questions Fréquentes)
  // ========================================
  {
    path: 'faq',
    component: FaqComponent,
    data: { title: 'Questions Fréquentes' }
  },

  // ========================================
  // ROUTE À PROPOS
  // ========================================
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'À propos de Soundora' }
  },

  // ========================================
  // ROUTE CONTACT
  // ========================================
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Nous contacter' }
  },

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
