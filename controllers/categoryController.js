const db = require("../config/db"); // Import de la connexion DB

// ------------------------
// Récupère toutes les catégories
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err }); // Erreur SQL
    }
    res.json(results); // Renvoie toutes les catégories
  });
};

// ------------------------
// Récupère une catégorie par ID
exports.getCategoryById = (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.json(results[0]);
    }
  );
};

// ------------------------
// Crée une nouvelle catégorie
exports.createCategory = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nom de la catégorie requis" });
  }

  db.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(201).json({
        id: result.insertId,
        name,
        description,
      });
    }
  );
};

// ------------------------
// Met à jour une catégorie existante
exports.updateCategory = (req, res) => {
  const { name, description } = req.body;

  db.query(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [name, description, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Catégorie mise à jour avec succès" });
    }
  );
};

// ------------------------
// Supprime une catégorie par ID
exports.deleteCategory = (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Catégorie supprimée avec succès" });
  });
};
