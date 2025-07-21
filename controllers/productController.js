import db from "../config/db.js"; // Import du pool MySQL

// ========================
// Récupérer tous les produits
export const getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ========================
// Récupérer un produit par son id
export const getProductById = (req, res) => {
  const productId = req.params.id;
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Produit non trouvé" });
      res.json(results[0]);
    }
  );
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
