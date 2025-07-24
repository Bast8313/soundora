import supabase from "../config/supabase.js"; // Import du client Supabase

// ------------------------
// Récupère toutes les catégories
export const getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      // Erreur SQL
      return res.status(500).json({ error: err });
    }
    // Renvoie toutes les catégories
    res.json(results);
  });
};

// ------------------------
// Récupère une catégorie par ID
export const getCategoryById = (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        // Erreur SQL
        return res.status(500).json({ error: err });
      }
      if (results.length === 0) {
        // Catégorie non trouvée
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      // Renvoie la catégorie trouvée
      res.json(results[0]);
    }
  );
};

// ------------------------
// Crée une nouvelle catégorie
export const createCategory = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    // Nom obligatoire
    return res.status(400).json({ message: "Nom de la catégorie requis" });
  }

  db.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description || null],
    (err, result) => {
      if (err) {
        // Erreur SQL
        return res.status(500).json({ error: err });
      }
      // Renvoie la nouvelle catégorie créée
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
export const updateCategory = (req, res) => {
  const { name, description } = req.body;

  db.query(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [name, description, req.params.id],
    (err, result) => {
      if (err) {
        // Erreur SQL
        return res.status(500).json({ error: err });
      }
      // Renvoie un message de succès
      res.json({ message: "Catégorie mise à jour avec succès" });
    }
  );
};

// ------------------------
// Supprime une catégorie par ID
export const deleteCategory = (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      // Erreur SQL
      return res.status(500).json({ error: err });
    }
    // Renvoie un message de succès
    res.json({ message: "Catégorie supprimée avec succès" });
  });
};
