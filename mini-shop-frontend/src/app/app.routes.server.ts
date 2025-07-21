import { RenderMode, ServerRoute } from '@angular/ssr';
import { CartComponent } from './components/cart/cart.component';
import path from 'path';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

export const routes =[
  { path: 'cart', component: CartComponent},
];
