import supabase from "../config/supabase.js";

// ------------------------
// Récupère toutes les marques
export const getAllBrands = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération des marques' 
    });
  }
};

// ------------------------
// Récupère une marque par ID
export const getBrandById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'Marque non trouvée' 
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération de la marque' 
    });
  }
};

// ------------------------
// Récupère une marque par slug
export const getBrandBySlug = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'Marque non trouvée' 
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération de la marque' 
    });
  }
};
