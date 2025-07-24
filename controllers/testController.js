import supabase from "../config/supabase.js";

// Test de connexion Supabase
export const testConnection = async (req, res) => {
  try {
    // Test de base - lister les tables
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        details: error
      });
    }
    
    res.json({ 
      success: true, 
      message: "Connexion Supabase OK",
      categoriesCount: data 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Lister toutes les tables disponibles
export const listTables = async (req, res) => {
  try {
    // Essayons différentes tables pour voir lesquelles existent
    const tables = ['categories', 'brands', 'products', 'users', 'orders'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          results[table] = { exists: false, error: error.message };
        } else {
          results[table] = { exists: true, sampleData: data };
        }
      } catch (err) {
        results[table] = { exists: false, error: err.message };
      }
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
