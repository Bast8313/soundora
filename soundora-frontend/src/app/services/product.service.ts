// =====================================
// IMPORTS POUR LE SERVICE PRODUITS
// =====================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // HTTP client pour les requêtes API
import { Observable } from 'rxjs'; // Observables pour la programmation réactive

/**
 * INTERFACE PRODUIT - DÉFINITION COMPLÈTE
 * Structure de données pour un produit Soundora
 * Utilisée dans tout le frontend pour assurer la cohérence des types
 */
export interface Product {
  id: string;                    // Identifiant unique du produit (UUID)
  name: string;                  // Nom commercial du produit
  slug: string;                  // Slug pour URLs SEO-friendly (/product/fender-stratocaster)
  description: string;           // Description complète (affichée sur page détail)
  short_description: string;     // Description courte (affichée sur cartes produit)
  price: number;                 // Prix actuel en euros
  compare_price?: number;        // Prix de comparaison/ancien prix (optionnel pour promotions)
  stock: number;                 // Quantité disponible en stock
  sku: string;                   // Référence produit/code article
  category_id: string;           // ID de la catégorie (relation foreign key)
  brand_id: string;              // ID de la marque (relation foreign key)
  model: string;                 // Modèle spécifique du produit
  color: string;                 // Couleur du produit
  images: string[];              // Tableau des URLs d'images (première = image principale)
  specifications: any;           // Spécifications techniques (objet JSON flexible)
  is_featured: boolean;          // Produit vedette/coup de cœur pour mise en avant
  
  // Relations avec autres entités (populated par l'API)
  categories: {                  // Informations de catégorie associée
    id: string;
    name: string;                // "Guitares", "Basses", etc.
    slug: string;                // "guitares", "basses", etc.
  };
  brands: {                      // Informations de marque associée
    id: string;
    name: string;                // "Fender", "Gibson", etc.
    slug: string;                // "fender", "gibson", etc.
  };
}

/**
 * INTERFACE RÉPONSE API STANDARDISÉE
 * Format de réponse uniforme de l'API backend Node.js/Supabase
 */
export interface ApiResponse {
  success: boolean;              // Indicateur de succès de la requête
  data: Product[];               // Tableau des produits retournés
  pagination?: {                 // Informations de pagination (présentes si pagination activée)
    currentPage: number;         // Page actuelle (1-indexed)
    totalPages: number;          // Nombre total de pages
    totalItems: number;          // Nombre total d'éléments
    itemsPerPage: number;        // Nombre d'éléments par page (généralement 10)
    hasNextPage: boolean;        // Indique s'il y a une page suivante
    hasPrevPage: boolean;        // Indique s'il y a une page précédente
  };
}

/**
 * INTERFACE FILTRES DE RECHERCHE
 * Définit tous les filtres possibles pour la recherche et le filtrage de produits
 */
export interface ProductFilters {
  page?: number;                 // Numéro de page pour pagination (1-indexed)
  category?: string;             // Slug de catégorie pour filtrer ("guitares", "basses", etc.)
  brand?: string;                // Slug de marque pour filtrer ("fender", "gibson", etc.)
  search?: string;               // Terme de recherche textuelle (nom, description)
  minPrice?: number;             // Prix minimum pour fourchette de prix
  maxPrice?: number;             // Prix maximum pour fourchette de prix
}

/**
 * SERVICE PRODUITS - GESTION DES DONNÉES PRODUITS
 * Service injectable pour toutes les opérations liées aux produits
 * Centralise les appels API et la logique métier
 */
@Injectable({
  providedIn: 'root'             // Service singleton disponible dans toute l'application
})
export class ProductService {
  
  // =====================================
  // CONFIGURATION API
  // =====================================
  private apiUrl = 'http://localhost:3010/api/products'; // URL de base de l'API backend

  /**
    CONSTRUCTEUR - INJECTION HTTP CLIENT
    @param http - Client HTTP Angular pour les requêtes API
   */
  constructor(private http: HttpClient) { }

  // =====================================
  // MÉTHODES DE RÉCUPÉRATION DES PRODUITS
  // =====================================

  /**
   * RÉCUPÈRE LA LISTE DES PRODUITS AVEC FILTRES
   * Méthode principale pour obtenir des produits avec pagination et filtres
   * 
   * @param filters - Objet contenant tous les filtres (optionnel)
   * @returns Observable<ApiResponse> - Réponse contenant produits et pagination
   * 
   * EXEMPLES D'UTILISATION :
   * - getProducts() : Tous les produits (page 1)
   * - getProducts({category: 'guitares'}) : Guitares uniquement
   * - getProducts({search: 'fender', page: 2}) : Recherche "fender" page 2
   */
  getProducts(filters: ProductFilters = {}): Observable<ApiResponse> {
    let params = new HttpParams(); // Construction dynamique des paramètres URL
    
    // Construction conditionnelle des paramètres selon les filtres fournis
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  /**
   * RÉCUPÈRE LES PRODUITS VEDETTES
   * Produits sélectionnés pour mise en avant (is_featured = true)
   * 
   * @returns  //Observable<ApiResponse> - Produits vedettes pour page d'accueil
   */
  getFeaturedProducts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/featured`);
  }

  /**
   * RÉCUPÈRE UN PRODUIT PAR SON SLUG
   * Utilisé pour les pages de détail produit avec URLs SEO-friendly
   * 
   * @param slug - Slug du produit (ex: "fender-player-stratocaster")
   * @returns Observable<any> - Données complètes du produit
   */
  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  /**
   * RÉCUPÈRE UN PRODUIT PAR SON ID
   * Méthode alternative pour récupération par identifiant unique
   * 
   * @param id - Identifiant UUID du produit
   * @returns Observable<any> - Données complètes du produit
   */
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // =====================================
  // MÉTHODES DE CONVENANCE (SHORTCUTS)
  // =====================================

  /**
   * RECHERCHE TEXTUELLE DE PRODUITS
   * Méthode simplifiée pour recherche par terme
   * 
   * @param query - Terme de recherche
   * @param page - Numéro de page (défaut: 1)
   * @returns Observable<ApiResponse> - Résultats de recherche
   */
  searchProducts(query: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ search: query, page });
  }

  /**
   * FILTRAGE PAR CATÉGORIE
   * Méthode simplifiée pour obtenir les produits d'une catégorie
   * 
   * @param category - Slug de la catégorie
   * @param page - Numéro de page (défaut: 1)
   * @returns Observable<ApiResponse> - Produits de la catégorie
   */
  getProductsByCategory(category: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ category, page });
  }

  /**
   * FILTRAGE PAR MARQUE
   * Méthode simplifiée pour obtenir les produits d'une marque
   * 
   * @param brand - Slug de la marque
   * @param page - Numéro de page (défaut: 1)
   * @returns Observable<ApiResponse> - Produits de la marque
   */
  getProductsByBrand(brand: string, page: number = 1): Observable<ApiResponse> {
    return this.getProducts({ brand, page });
  }
}