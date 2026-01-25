import supabase from "../config/supabase.js";

// =================================
// CONTRÔLEUR PRODUITS - Version Supabase
// Gère toutes les opérations liées aux produits avec fonctionnalités avancées
// =================================

/**
 * Récupérer tous les produits avec pagination et filtres
 * API: GET /api/products?page=1&limit=10&category=guitares&brand=fender&min_price=100&max_price=1000&search=stratocaster
 
-->  ? : début des parametres de requête (query parameters), separe l'URL de la requête des paramètres
--> & : sépare les différents paramètres de la requête ( permet de chaîner plusieurs paramètres)

*/
export const getAllProducts = async (req, res) => {
  try {
    // EXTRACTION DES PARAMÈTRES DE LA REQUÊTE
    // Récupère les paramètres de l'URL avec valeurs par défaut
    const {
      page = 1, // Page actuelle (pagination)
      limit = 10, // Nombre de produits par page
      category, // Filtre par catégorie (slug)
      brand, // Filtre par marque (slug)
      min_price, // Prix minimum
      max_price, // Prix maximum
      search, // Recherche textuelle
      sort = "created_at", // Champ de tri (par défaut: date de création)
      order = "desc", // Ordre de tri (desc = plus récent d'abord)
    } = req.query;

    // CONSTRUCTION DE LA REQUÊTE SUPABASE
    // Crée la requête de base avec jointures (relations entre tables)
    let query = supabase
      .from("products") // Table principale
      .select(
        `
        *,                                 
        category:categories!category_id(id, name, slug),  
        brand:brands!brand_id(id, name, slug)             
      `,
        { count: "exact" } // Compte le nombre total de résultats pour la pagination
      )
      .eq("is_active", true); // Seulement les produits actifs

    // APPLICATION DES FILTRES
    // Chaque filtre s'ajoute à la requête seulement s'il est fourni

    // FILTRE PAR CATÉGORIE (via slug)
    // Gère à la fois les catégories parentes et les sous-catégories
    if (category) {
      console.log("🔍 Filtrage par catégorie (slug):", category);

      // Récupère la catégorie à partir de son slug
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, parent_id")
        .eq("slug", category)
        .single();

      if (categoryError) {
        console.error("❌ Erreur récupération catégorie:", categoryError);
      } else if (categoryData) {
        console.log("✅ Catégorie trouvée, ID:", categoryData.id);
        
        // Si c'est une catégorie parente (parent_id = null), on récupère toutes ses sous-catégories
        if (categoryData.parent_id === null) {
          console.log("📁 Catégorie parente détectée, recherche des sous-catégories...");
          
          // Récupère tous les IDs des sous-catégories
          const { data: subCategories } = await supabase
            .from("categories")
            .select("id")
            .eq("parent_id", categoryData.id);
          
          if (subCategories && subCategories.length > 0) {
            const subCategoryIds = subCategories.map(sub => sub.id);
            console.log(`✅ ${subCategoryIds.length} sous-catégories trouvées`);
            
            // Filtre par la catégorie parente OU ses sous-catégories
            query = query.or(`category_id.eq.${categoryData.id},category_id.in.(${subCategoryIds.join(',')})`);
          } else {
            // Pas de sous-catégories, filtre juste par la catégorie elle-même
            query = query.eq("category_id", categoryData.id);
          }
        } else {
          // C'est une sous-catégorie, filtre directement
          console.log("📄 Sous-catégorie, filtrage direct");
          query = query.eq("category_id", categoryData.id);
        }
      } else {
        // Si la catégorie n'existe pas, on retourne 0 résultat
        console.log("⚠️ Catégorie non trouvée");
        return res.json({
          success: true,
          data: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            total: 0,
            totalItems: 0,
            itemsPerPage: parseInt(limit),
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }
    }

    // FILTRE PAR MARQUE (via slug)
    if (brand) {
      console.log("🔍 Filtrage par marque (slug):", brand);

      // Récupère l'ID de la marque à partir de son slug
      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", brand)
        .single();

      if (brandError) {
        console.error("❌ Erreur récupération marque:", brandError);
      } else if (brandData) {
        console.log("✅ Marque trouvée, ID:", brandData.id);
        // Filtre les produits par brand_id
        query = query.eq("brand_id", brandData.id);
      }
    }

    if (min_price) {
      // Prix minimum: WHERE price >= 100
      query = query.gte("price", min_price);
    }

    if (max_price) {
      // Prix maximum: WHERE price <= 1000
      query = query.lte("price", max_price);
    }

    if (search) {
      // Recherche textuelle dans nom ET description
      // ILIKE = insensible à la casse, % = caractères joker
      // I (ILIKE) : insensible à la casse (ignore majuscule/minuscule)
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
      // `` : backticks pour insérer des variables
      // % : wilcard (n'importe quel caractère)
      // ${search} : variable injectable dans la requête
      // deuxième % : wilcard pour la fin de la chaîne
    }

    // TRI DES RÉSULTATS
    // Exemple: ORDER BY created_at DESC
    query = query.order(sort, { ascending: order === "asc" });

    // PAGINATION
    // Calcul des indices pour limiter les résultats
    const from = (page - 1) * limit; // Index de début (0, 10, 20...)
    const to = from + limit - 1; // Index de fin (9, 19, 29...)
    query = query.range(from, to); // LIMIT et OFFSET

    // EXÉCUTION DE LA REQUÊTE
    const { data: products, error, count } = await query;

    // GESTION DES ERREURS
    if (error) {
      console.error("❌ Erreur Supabase:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des produits",
        error: error.message,
      });
    }

    console.log(`✅ ${count} produits trouvés (page ${page})`);

    // CALCUL DES MÉTADONNÉES DE PAGINATION
    const totalPages = Math.ceil((count || 0) / limit);

    // RÉPONSE AVEC DONNÉES ET PAGINATION
    res.json({
      success: true,
      data: products || [],
      pagination: {
        currentPage: parseInt(page), // Page actuelle
        totalPages, // Nombre total de pages
        total: count || 0, // AJOUT : total pour compatibilité frontend
        totalItems: count || 0, // Nombre total d'éléments
        itemsPerPage: parseInt(limit), // Éléments par page
        hasNextPage: page < totalPages, // Y a-t-il une page suivante ?
        hasPrevPage: page > 1, // Y a-t-il une page précédente ?
      },
    });
  } catch (error) {
    // GESTION DES ERREURS SERVEUR
    console.error("Erreur getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des produits",
    });
  }
};

/**
 * Récupérer un produit par son slug (URL SEO-friendly)
 * API: GET /api/products/gibson-les-paul-standard-2024
 * Utilise le slug au lieu de l'ID pour des URLs lisibles
 */
export const getProductBySlug = async (req, res) => {
  try {
    // EXTRACTION DU SLUG DEPUIS L'URL
    // Exemple: /api/products/gibson-les-paul-standard → slug = "gibson-les-paul-standard"
    const { slug } = req.params;

    // REQUÊTE SUPABASE AVEC JOINTURES DÉTAILLÉES
    // CORRECTION : Suppression des commentaires SQL qui causent l'erreur PGRST100
    // Les commentaires ne sont pas supportés dans les requêtes Supabase .select()
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories!inner(id, name, slug, parent_id),
        brands(id, name, slug, description, logo_url)
      `,
      )
      .eq("slug", slug) // WHERE slug = 'gibson-les-paul-standard'
      .eq("is_active", true) // AND is_active = true
      .single(); // Récupère UN SEUL résultat (pas un tableau)

    //  GESTION DES ERREURS SPÉCIFIQUES
    if (error) {
      // Code PGRST116 = "Aucun résultat trouvé" ou "Plus d'un résultat"
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }

      // Autres erreurs Supabase (problème de connexion, syntaxe SQL, etc.)
      console.error("Erreur Supabase:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du produit",
      });
    }

    // SUCCÈS - Retourne le produit avec toutes ses relations
    res.json({
      success: true,
      data: product, // Contient le produit + catégorie + marque
    });
  } catch (error) {
    // GESTION DES ERREURS SERVEUR (erreurs JavaScript)
    console.error("Erreur getProductBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du produit",
    });
  }
};

/**
 * Récupérer les produits mis en avant/featured
 * API: GET /api/products/featured?limit=6
 * Affiche les produits avec is_featured = true
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    // PARAMÈTRE DE LIMITE AVEC VALEUR PAR DÉFAUT
    // Exemple: ?limit=8 → affiche 8 produits | pas de ?limit → affiche 6 produits
    const limit = parseInt(req.query.limit) || 6;

    //  REQUÊTE SUPABASE POUR PRODUITS FEATURED
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        description,
        short_description,
        price,
        compare_price,
        images,
        stock,
        is_featured,
        categories!inner(id, name, slug),
        brands(id, name, slug)
      `,
      )
      .eq("is_active", true) // WHERE is_active = true
      .eq("is_featured", true) // AND is_featured = true
      .order("created_at", { ascending: false }) // ORDER BY created_at DESC (plus récents en premier)
      .limit(limit); // LIMIT X (défini par le paramètre)

    //  GESTION DES ERREURS SUPABASE
    if (error) {
      console.error(
        "Erreur lors de la récupération des produits featured:",
        error,
      );
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des produits featured",
      });
    }

    // SUCCÈS - Retourne les produits mis en avant
    res.json({
      success: true,
      data: products, // Tableau des produits featured
      count: products.length, // Nombre de produits retournés
    });
  } catch (error) {
    // GESTION DES ERREURS SERVEUR
    console.error("Erreur getFeaturedProducts:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des produits featured",
    });
  }
};

/**
 * Rechercher des produits par mot-clé (version simplifiée)
 * API: GET /api/products/search?q=guitare&limit=10
 * Recherche dans le nom, description courte et modèle
 */
export const searchProducts = async (req, res) => {
  try {
    //  EXTRACTION DES PARAMÈTRES DE RECHERCHE
    const { q: query, limit = 10 } = req.query;

    //  VALIDATION: Minimum 2 caractères pour éviter les recherches trop larges
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "La recherche doit contenir au moins 2 caractères",
      });
    }

    // REQUÊTE SUPABASE AVEC RECHERCHE TEXTUELLE SIMPLIFIÉE
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        id,                           // ID unique du produit
        name,                         // Nom du produit
        slug,                         // URL SEO-friendly
        short_description,            // Description courte
        price,                        // Prix
        images,                       // Images du produit
        categories!inner(name, slug), // Infos catégorie (obligatoire)
        brands(name, slug)            // Infos marque (optionnel)
      `,
      )
      .eq("is_active", true) // WHERE is_active = true
      .or(
        // AND (
        `name.ilike.%${query}%,` + //   name ILIKE '%guitare%'
          ` short_description.ilike.%${query}%,` + //   OR short_description ILIKE '%guitare%'
          ` model.ilike.%${query}%`, //   OR model ILIKE '%guitare%'
      ) // )
      .limit(limit); // LIMIT X (défini par le paramètre)

    //  GESTION DES ERREURS SUPABASE
    if (error) {
      console.error("Erreur search:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche",
      });
    }

    // SUCCÈS - Retourne les résultats de recherche
    res.json({
      success: true,
      data: products, // Résultats de la recherche
      query: query.trim(), // Mot-clé recherché (nettoyé)
    });
  } catch (error) {
    // GESTION DES ERREURS SERVEUR
    console.error("Erreur searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recherche",
    });
  }
};
