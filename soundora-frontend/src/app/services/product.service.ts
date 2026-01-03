import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface pour typer les produits
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id?: number;
  brand_id?: number;
  featured?: boolean;
}

// Interface pour la réponse paginée
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3010/api/products'; // URL de l'API backend

  constructor(private http: HttpClient) { }

  // Récupère la liste des produits avec pagination et filtres
  getProducts(page: number = 1, limit: number = 12, filters?: any): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Ajoute les filtres optionnels (catégorie, marque, recherche, etc.)
    if (filters) {
      if (filters.category_id) params = params.set('category_id', filters.category_id);
      if (filters.brand_id) params = params.set('brand_id', filters.brand_id);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.min_price) params = params.set('min_price', filters.min_price);
      if (filters.max_price) params = params.set('max_price', filters.max_price);
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  // Récupère un produit par son slug
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}`);
  }

  // Récupère les produits mis en avant
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  // Recherche des produits
  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }
}
