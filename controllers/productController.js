import supabase from "../config/supabase.js"; // Import du client Supabase

// ========================
// Récupérer tous les produits
export const getAllProducts = async (req, res) => {
  try {
    // Test simple de connexion d'abord
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(products || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// Récupérer un produit par son id
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// Ajouter un produit
export const addProduct = (req, res) => {
  const { name, price, stock, description, image_url, category_id } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Nom, prix et stock requis" });
  }

  db.query(
    "INSERT INTO products (name, price, stock, description, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, stock, description, image_url, category_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({
          id: result.insertId,
          name,
          price,
          stock,
          description,
          image_url,
          category_id,
        });
    }
  );
};

// ========================
// Mettre à jour un produit
export const updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, price, stock, description, image_url, category_id } = req.body;

  db.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ?, image_url = ?, category_id = ? WHERE id = ?",
    [name, price, stock, description, image_url, category_id, productId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Produit mis à jour" });
    }
  );
};

// ========================
// Supprimer un produit
export const deleteProduct = (req, res) => {
  const productId = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Produit supprimé" });
  });
};
