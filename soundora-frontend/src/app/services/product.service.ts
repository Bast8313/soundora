import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3010/api/products'; // URL de l'API

  constructor(private http: HttpClient) { }

  // Récupérer tous les produits
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
}
  // Récupérer un produit par son ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
}
}