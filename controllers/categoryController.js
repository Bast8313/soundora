// on i mporte la connexion à la base de données depuis le fichier db.js
const db = require("../config/db");

// ------------------------

// GET ALL CATEGORIES
// ------------------------
// Récupère toutes les catégories dans la table categories
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      // Si erreur, retourne un status 500 avec l'erreur
      return res.status(500).json({ error: err });
    }

    // sinon envoie la liste des catégories au client
    res.json(results);
  });
};

// ------------------------

// GET CATEGORY BY ID
// ------------------------
// fonction pour récupérer une catégorie par son ID
exports.getCategoryById = (req, res) => {
  //'req.params.id' contient l'ID de la catégorie passé dans l'URL
  db.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        // Si erreur, retourne un status 500 avec l'erreur
        return res.status(500).json({ error: err }); // erreur sql
      }

      if (results.length === 0) {
        // Si pas de catégorie trouvée, retourne un status 404
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      // sinnon envoie la catégorie trouvée
      res.json(results[0]);
    }
  );
};

// ------------------------

// CREATE CATEGORY
// ------------------------
// Fonction pour créer une nouvelle catégorie
exports.createCategory = (req, res) => {
  const { name } = req.body; // Récupère le nom de la catégorie depuis le corps de la requête

  // Vérifie que le nom est bien fourni
  if (!name) {
    return res.status(400).json({ message: "Nom de la catégorie requis" });
  }

  // requete SQL pour insérer une nouvlle ligne dans la table categories
  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err }); // Erreur SQL sur l'insertion
      }

      // Renvoie une réponse 201 (créé) avec les détails de la catégorie créée
      res.status(201).json({
        id: result.insertId, // ID de la nouvelle catégorie
        name, // Nom de la catégorie
      });
    }
  );
};

// ------------------------

// UPDATE CATEGORY
// ------------------------
// Fonction pour mettre à jour une catégorie existante
exports.updateCategory = (req, res) => {
  const { name } = req.body; // Récupère le nouveau nom de la catégorie depuis le corps de la requête

  // requete SQL pour mettre à jour le nom selon l ' id passé dans l'url
  db.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err }); // Erreur SQL sur la mise à jour
      }

      // Renvoie une réponse 200 (OK) pour indiquer que la catégorie a été mise à jour
      res.json({ message: "Catégorie mise à jour avec succès" });
    }
  );
};

// ------------------------

// DELETE CATEGORY
// ------------------------
// Fonction pour supprimer une catégorie par son ID
exports.deleteCategory = (req, res) => {
  // requete SQL pour supprimer la catégorie selon l'ID passé dans l'URL
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err }); // Erreur SQL sur la suppression
    }

    // Renvoie une réponse 200 (OK) pour indiquer que la catégorie a été supprimée
    res.json({ message: "Catégorie supprimée avec succès" });
  });
};
