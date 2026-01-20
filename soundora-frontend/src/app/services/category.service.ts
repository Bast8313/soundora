import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * =====================================
 * SERVICE CATEGORY - CategoryService
 * =====================================
 * 
 * Ce service gère TOUTES les opérations liées aux catégories de produits.
 * Il communique avec l'API backend pour récupérer les catégories et les organiser.
 * 
 * RÔLE :
 * - Récupérer les catégories depuis l'API
 * - Organiser les catégories en structure hiérarchique (parent -> enfants)
 * - Fournir les données aux composants
 * 
 * UTILISATION :
 * Dans un composant : 
 * constructor(private categoryService: CategoryService) {}
 * this.categoryService.getAllCategories().subscribe(...)
 */

// =====================================
// INTERFACE CATEGORY
// =====================================
// Définit la structure d'une catégorie (contrat de données)
export interface Category {
  id: number;                        // Identifiant unique
  name: string;                      // Nom affiché (ex: "Guitares électriques")
  slug: string;                      // URL-friendly (ex: "guitares-electriques")
  description?: string;              // Description optionnelle
  parent_id?: number;                // ID de la catégorie parente (null si catégorie principale)
  subcategories?: Category[];        // Liste des sous-catégories (ajouté par organizeCategoriesHierarchy)
}

// =====================================
// INTERFACE RESPONSE API
// =====================================
// Structure de la réponse de l'API pour les catégories
export interface CategoriesResponse {
  success: boolean;                  // Indique si la requête a réussi
  data: Category[];                  // Tableau de catégories
}

@Injectable({
  providedIn: 'root'                 // Service disponible dans toute l'application (singleton)
})
export class CategoryService {
  // URL de base de l'API backend
  private apiUrl = 'http://localhost:3000/api';

  /**
   * CONSTRUCTEUR
   * HttpClient : Permet de faire des requêtes HTTP (GET, POST, etc.)
   * Injecté automatiquement par Angular
   */
  constructor(private http: HttpClient) { }

  /**
   * =====================================
   * RÉCUPÈRE TOUTES LES CATÉGORIES
   * =====================================
   * 
   * Fait une requête GET à l'API : GET /api/categories
   * 
   * RETOUR : Observable<CategoriesResponse>
   * - Observable = flux de données asynchrone (on s'abonne avec .subscribe())
   * - CategoriesResponse = structure de la réponse
   * 
   * EXEMPLE D'UTILISATION :
   * this.categoryService.getAllCategories().subscribe({
   *   next: (response) => console.log(response.data),
   *   error: (err) => console.error(err)
   * });
   */
  getAllCategories(): Observable<CategoriesResponse> {
    // http.get<Type>() : Requête GET typée, Angular sait que la réponse sera de type CategoriesResponse
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`);
  }

  /**
   * =====================================
   * RÉCUPÈRE UNE CATÉGORIE PAR ID
   * =====================================
   * 
   * Fait une requête GET : GET /api/categories/5
   * 
   * @param id - Identifiant de la catégorie
   * @returns Observable<Category> - La catégorie correspondante
   * 
   * EXEMPLE : getCategoryById(5) → Catégorie avec id=5
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  }

  /**
   * =====================================
   * RÉCUPÈRE UNE CATÉGORIE PAR SLUG
   * =====================================
   * 
   * Fait une requête GET : GET /api/categories/slug/guitares-electriques
   * 
   * @param slug - Slug de la catégorie (URL-friendly)
   * @returns Observable<Category> - La catégorie correspondante
   * 
   * AVANTAGE DU SLUG : URLs plus lisibles et meilleures pour le SEO
   * Exemple : /categories/slug/guitares-electriques (lisible)
   * vs /categories/5 (pas explicite)
   */
  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/slug/${slug}`);
  }

  /**
   * =====================================
   * ORGANISE LES CATÉGORIES EN HIÉRARCHIE
   * =====================================
   * 
   * Transforme un tableau plat de catégories en structure hiérarchique.
   * 
   * ENTRÉE (tableau plat) :
   * [
   *   { id: 1, name: "Guitares", parent_id: null },
   *   { id: 2, name: "Électriques", parent_id: 1 },
   *   { id: 3, name: "Acoustiques", parent_id: 1 }
   * ]
   * 
   * SORTIE (hiérarchie) :
   * [
   *   { 
   *     id: 1, 
   *     name: "Guitares", 
   *     subcategories: [
   *       { id: 2, name: "Électriques" },
   *       { id: 3, name: "Acoustiques" }
   *     ]
   *   }
   * ]
   * 
   * @param categories - Tableau plat de catégories
   * @returns Category[] - Catégories racines avec leurs sous-catégories imbriquées
   */
  organizeCategoriesHierarchy(categories: Category[]): Category[] {
    // MAP : Structure de données clé-valeur optimisée pour la recherche rapide
    // Permet de retrouver une catégorie par son ID en O(1) au lieu de O(n)
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // =====================================
    // PREMIÈRE PASSE : CRÉER LA MAP
    // =====================================
    // Crée une copie de chaque catégorie avec un tableau subcategories vide
    categories.forEach(cat => {
      // { ...cat } : Spread operator, crée une copie de l'objet
      // Évite de modifier l'objet original
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // =====================================
    // DEUXIÈME PASSE : CONSTRUIRE LA HIÉRARCHIE
    // =====================================
    categories.forEach(cat => {
      // Récupère la catégorie depuis la map
      // Le ! indique à TypeScript que categoryMap.get(cat.id) ne sera jamais undefined
      const category = categoryMap.get(cat.id)!;
      
      if (cat.parent_id) {
        // ========== CAS 1 : SOUS-CATÉGORIE ==========
        // Cette catégorie a un parent (parent_id existe)
        // On l'ajoute au tableau subcategories de son parent
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          // parent.subcategories! : Le ! indique que subcategories existe forcément
          parent.subcategories!.push(category);
        }
      } else {
        // ========== CAS 2 : CATÉGORIE RACINE ==========
        // Cette catégorie n'a pas de parent (parent_id = null)
        // C'est une catégorie principale, on l'ajoute au tableau de résultat
        rootCategories.push(category);
      }
    });

    // Retourne uniquement les catégories racines
    // Les sous-catégories sont imbriquées dans leurs parents
    return rootCategories;
  }
}
