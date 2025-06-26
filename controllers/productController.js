//   =========  CRUD API pour les produits  =========

const db = require("../config/db"); // Import de la configuration de la base de données, prevoir un fichier db.js qui exporte une instance de connexion à la base de données

// recuperer tous les produits
exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    // execute un SELECT pour récupérer tous les produits
    if (err) return res.status(500).json({ error: err }); // si erreur, retourne un status 500 avec l'erreur
    res.json(results); // sinon envoie la liste au client.
  });
};

// récupérer un produit par son ID
exports.getProductById = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?", // récupère un produit par son ID
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Produit non trouvé" }); // si pas de produit trouvé, retourne un status 404
      res.json(results[0]); // envoie le produit trouvé
    }
  );
};

// créer un nouveau produit
exports.createProduct = (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Nom et prix obligatoires" }); // vérifie que le nom et le prix sont fournis

    db.query(
      "INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, image_url, category_id], // prend les données du produit depuis le corps de la requête
      (err, result) => {
        if (err) return res.status(500).json({ error: err }); // insère un nouveau produit dans la base de données

        res.status(201).json({
          id: result.insertId,
          name,
          description,
          price,
          image_url,
          category_id,
        }); // Renvoie une réponse 201 (créé) avec les détails du produit créé
      }
    );
  }

  db.query(
    "INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)", // prend les données du produit depuis le corps de la requête
    [name, description, price, image_url, category_id, req.params.id], // les nouvelles données sont prises depuis le corps de la requête
    (err, result) => {
      if (err) return res.status(500).json({ error: err }); // si erreur, retourne un status 500 avec l'erreur
      // insère un nouveau produit dans la base de données

      if (err) return res.status(500).json({ error: err });
      res.status(201).json({
        // Renvoie une réponse 201 (créé) avec les détails du produit créé
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

// mettre à jour un produit existant
exports.updateProduct = (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;
  db.query(
    "UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ? WHERE id = ?", // met à jour un produit existant (dont l'ID est passé dans l'URL)
    [name, description, price, image_url, category_id, req.params.id],
    (err) => {
      // les noouvelles données sont prises depuis le corps de la requête
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Produit mis à jour" });
    }
  );
};

// supprimer un produit existant
exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err }); // supprime un produit existant par son ID
    res.json({ message: "Produit supprimé" }); // envoie un message de confirmation
  });
};
