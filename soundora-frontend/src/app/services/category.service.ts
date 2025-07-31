// =====================================
// IMPORTS POUR LE SERVICE CATÉGORIES/MARQUES
// =====================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Client HTTP pour requêtes API
import { Observable } from 'rxjs'; // Observables pour programmation réactive

/**
 * INTERFACE CATÉGORIE
 * Structure de données pour une catégorie d'instruments
 */
export interface Category {
  id: string;                    // Identifiant unique UUID
  name: string;                  // Nom affiché ("Guitares", "Basses", etc.)
  slug: string;                  // Slug pour URLs ("guitares", "basses", etc.)
  description: string;           // Description de la catégorie
  parent_id?: string;            // ID parent pour hiérarchie (optionnel)
  sort_order?: number;           // Ordre d'affichage (optionnel)
}

/**
 * INTERFACE MARQUE
 * Structure de données pour une marque d'instruments
 */
export interface Brand {
  id: string;                    // Identifiant unique UUID
  name: string;                  // Nom de la marque ("Fender", "Gibson", etc.)
  slug: string;                  // Slug pour URLs ("fender", "gibson", etc.)
  description: string;           // Description de la marque
}

/**
 * SERVICE CATÉGORIES ET MARQUES
 * Gère la récupération des catégories et marques pour la navigation et les filtres
 */
@Injectable({
  providedIn: 'root'             // Service singleton
})
export class CategoryService {
  
  // =====================================
  // CONFIGURATION API
  // =====================================
  private apiUrl = 'http://localhost:3010/api'; // URL de base API backend

  /**
   * CONSTRUCTEUR - INJECTION HTTP CLIENT
   * @param http - Client HTTP Angular pour requêtes API
   */
  constructor(private http: HttpClient) { }

  // =====================================
  // MÉTHODES CATÉGORIES
  // =====================================

  /**
   * RÉCUPÈRE TOUTES LES CATÉGORIES
   * Utilisé pour la navbar et les filtres de recherche
   * 
   * @returns Observable<Category[]> - Liste de toutes les catégories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * RÉCUPÈRE TOUTES LES CATÉGORIES (ALIAS)
   * Méthode alternative avec type de retour générique
   * 
   * @returns Observable<any> - Réponse API brute
   */
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  /**
   * RÉCUPÈRE UNE CATÉGORIE PAR SON SLUG
   * Utilisé pour afficher les détails d'une catégorie
   * 
   * @param slug - Slug de la catégorie ("guitares", etc.)
   * @returns Observable<Category> - Données de la catégorie
   */
  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${slug}`);
  }

  // =====================================
  // MÉTHODES MARQUES
  // =====================================

  /**
   * RÉCUPÈRE TOUTES LES MARQUES
   * Utilisé pour la navbar et les filtres de recherche
   * 
   * @returns Observable<Brand[]> - Liste de toutes les marques
   */
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`);
  }

  /**
   * RÉCUPÈRE UNE MARQUE PAR SON SLUG
   * Utilisé pour afficher les détails d'une marque
   * 
   * @param slug - Slug de la marque ("fender", etc.)
   * @returns Observable<Brand> - Données de la marque
   */
  getBrandBySlug(slug: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brands/${slug}`);
  }
}
