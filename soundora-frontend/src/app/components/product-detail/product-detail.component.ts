import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  error: string | null = null;
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Récupération du slug depuis l'URL (ex: /product/gibson-les-paul-standard)
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      console.log('Chargement du produit avec slug:', slug);
      
      // Utilise getProductBySlug au lieu de getProductById pour correspondre à l'API backend
      this.productService.getProductBySlug(slug).subscribe({
        next: (response) => {
          // L'API retourne { success: true, data: product }
          if (response.success && response.data) {
            this.product = response.data;
            console.log('Produit chargé:', this.product);
          } else {
            console.error('Réponse API invalide:', response);
            this.error = 'Produit introuvable';
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement du produit:', error);
          this.error = 'Produit introuvable';
        }
      });
    } else {
      this.error = 'Aucun slug fourni dans l\'URL';
    }
  }

  getStockStatus(): string {
    if (!this.product) return 'unknown';
    if (this.product.stock === 0) return 'out';
    if (this.product.stock < 5) return 'low';
    return 'available';
  }

  getStockText(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Rupture de stock';
    if (this.product.stock < 5) return `Stock limité (${this.product.stock} restants)`;
    return 'En stock';
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  increaseQuantity() {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  addToCart(product: any, quantity: number = 1) {
    // Ajouter la quantité sélectionnée au panier
    for (let i = 0; i < quantity; i++) {
      this.cartService.addToCart(product);
    }
    console.log(`${quantity} x ${product.name} ajouté(s) au panier`);
  }

  onImageError(event: any) {
    // Remplacer par une image par défaut en cas d'erreur
    event.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
  }

  getSpecifications() {
    if (!this.product?.specifications) return [];
    return Object.keys(this.product.specifications).map(key => ({
      key: this.formatSpecKey(key),
      value: this.product.specifications[key]
    }));
  }

  private formatSpecKey(key: string): string {
    // Formatter la clé pour l'affichage (première lettre en majuscule)
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  // Exposer Object pour le template
  Object = Object;
}