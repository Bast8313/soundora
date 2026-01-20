import supabase from "../config/supabase.js"; // Import du client Supabase

// ------------------------
// Récupère toutes les catégories depuis la base de données
export const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des catégories",
    });
  }
};

// ------------------------
// Récupère une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération de la catégorie",
    });
  }
};

// ------------------------
// Récupère une catégorie par slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", req.params.slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération de la catégorie",
    });
  }
};

// ------------------------
// Crée une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, slug } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nom de la catégorie requis",
      });
    }

    const categoryData = {
      name,
      description: description || null,
      parent_id: parent_id || null,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    };

    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la création de la catégorie",
    });
  }
};

// ------------------------
// Met à jour une catégorie existante
export const updateCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (parent_id !== undefined) updateData.parent_id = parent_id;

    const { data, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la mise à jour de la catégorie",
    });
  }
};

// ------------------------
// Supprime une catégorie par ID
export const deleteCategory = async (req, res) => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la suppression de la catégorie",
    });
  }
};
