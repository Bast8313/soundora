import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string;
  sort_order?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3010/api';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les catégories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Récupérer toutes les catégories (alias)
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  // Récupérer toutes les marques
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`);
  }

  // Récupérer une catégorie par slug
  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${slug}`);
  }

  // Récupérer une marque par slug
  getBrandBySlug(slug: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brands/${slug}`);
  }
}
