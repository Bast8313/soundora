import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku: string;
  category_id: string;
  brand_id: string;
  model: string;
  color: string;
  images: string[];
  specifications: any;
  is_featured: boolean;
  categories: {
    id: string;
    name: string;
    slug: string;
  };
  brands: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductFilters {
  page?: number;
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3010/api/products';

  constructor(private http: HttpClient) { }

  // Récupérer tous les produits avec filtres et pagination
  getProducts(filters: ProductFilters = {}): Observable<ApiResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  // Récupérer les produits mis en avant
  getFeaturedProducts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/featured`);
  }

  // Récupérer un produit par son slug
  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  // Récupérer un produit par son ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des produits
  searchProducts(query: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ search: query, page });
  }

  // Filtrer par catégorie
  getProductsByCategory(category: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ category, page });
  }

  // Filtrer par marque
  getProductsByBrand(brand: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ brand, page });
  }
}