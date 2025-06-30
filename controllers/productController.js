const db = require("../config/db");

// ------------------------
// Récupère tous les produits avec leur catégorie associée (si existante)
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT products.*, categories.name AS category_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ------------------------
// Récupère un produit par ID
exports.getProductById = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Produit non trouvé" });
      res.json(results[0]);
    }
  );
};

// ------------------------
// Crée un nouveau produit
exports.createProduct = (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Nom et prix obligatoires" });
  }

  db.query(
    "INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)",
    [name, description || null, price, image_url || null, category_id || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({
        id: result.insertId,
        name,
        description,
        price,
        image_url,
        category_id,
      });
    }
  );
};

// ------------------------
// Met à jour un produit existant
exports.updateProduct = (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;

  db.query(
    "UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ? WHERE id = ?",
    [name, description, price, image_url, category_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Produit mis à jour" });
    }
  );
};

// ------------------------
// Supprime un produit par ID
exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Produit supprimé" });
  });
};
