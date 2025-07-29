import { RenderMode, ServerRoute } from '@angular/ssr';
import { CartComponent } from './components/cart/cart.component';
import path from 'path';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/**',
    renderMode: RenderMode.Server // Rendu côté serveur pour les routes avec paramètres
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // Pré-rendu pour toutes les autres routes
  }
];

export const routes =[
  { path: 'cart', component: CartComponent},
];
