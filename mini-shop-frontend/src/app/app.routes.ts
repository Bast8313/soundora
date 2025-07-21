import { Routes } from '@angular/router';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent }, // Page d'accueil = catalogue
  { path: 'product/:id', component: ProductDetailComponent }, // Détail produit
  { path: 'cart', component: CartComponent }, // Panier
  { path: 'order', component: OrderComponent }, // Commande
  { path: 'login', component: LoginComponent }, // Authentification
  { path: '**', redirectTo: '' } // Redirection vers l'accueil pour toute route inconnue
];
