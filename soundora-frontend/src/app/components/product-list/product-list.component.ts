import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product, ProductsResponse } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // Données
  products: Product[] = [];
  total: number = 0;
  
  // Pagination
  currentPage: number = 1;
  limit: number = 12;
  totalPages: number = 0;
  
  // État du chargement
  isLoading: boolean = false;
  error: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts(); // Charge les produits au démarrage
  }

  // Charge les produits depuis l'API
  loadProducts(): void {
    this.isLoading = true;
    this.error = '';

    this.productService.getProducts(this.currentPage, this.limit).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.total = response.total;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  // Change de page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo(0, 0); // Remonte en haut de la page
    }
  }

  // Navigation page suivante
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Navigation page précédente
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Génère un tableau pour les numéros de page
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
