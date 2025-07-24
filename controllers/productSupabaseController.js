import supabase from '../config/supabase.js'

// =================================
// CONTRÔLEUR PRODUITS - Version Supabase
// =================================

/**
 * Récupérer tous les produits avec pagination et filtres
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      min_price,
      max_price,
      search,
      sort = 'created_at',
      order = 'desc'
    } = req.query

    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug),
        brands(id, name, slug)
      `)
      .eq('is_active', true)

    // Filtres
    if (category) {
      query = query.eq('categories.slug', category)
    }
    
    if (brand) {
      query = query.eq('brands.slug', brand)
    }
    
    if (min_price) {
      query = query.gte('price', min_price)
    }
    
    if (max_price) {
      query = query.lte('price', max_price)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`)
    }

    // Tri
    query = query.order(sort, { ascending: order === 'asc' })

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Erreur Supabase:', error)
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits',
        error: error.message
      })
    }

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(count / limit)
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Erreur getAllProducts:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits'
    })
  }
}

/**
 * Récupérer un produit par son slug
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug, parent_id),
        brands(id, name, slug, description, logo_url)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        })
      }
      
      console.error('Erreur Supabase:', error)
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du produit'
      })
    }

    res.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('Erreur getProductBySlug:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit'
    })
  }
}

/**
 * Récupérer les produits en vedette
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug),
        brands(id, name, slug)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erreur Supabase:', error)
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits en vedette'
      })
    }

    res.json({
      success: true,
      data: products
    })

  } catch (error) {
    console.error('Erreur getFeaturedProducts:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

/**
 * Recherche de produits avec suggestions
 */
export const searchProducts = async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La recherche doit contenir au moins 2 caractères'
      })
    }

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id, name, slug, short_description, price, images,
        categories!inner(name, slug),
        brands(name, slug)
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%, short_description.ilike.%${query}%, model.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Erreur search:', error)
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      })
    }

    res.json({
      success: true,
      data: products,
      query: query.trim()
    })

  } catch (error) {
    console.error('Erreur searchProducts:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche'
    })
  }
}
