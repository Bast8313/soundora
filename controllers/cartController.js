import supabase from "../config/supabase.js"; // Import du client Supabase

// ========================
// Récupère le panier d'un utilisateur avec tous ses articles
export const getCart = (req, res) => {
  const userId = req.user.id; // Récupéré depuis le token JWT

  const sql = `
    SELECT 
      c.id as cart_id,
      ci.id as cart_item_id,
      ci.quantity,
      ci.price as cart_price,
      ci.added_at,
      p.id as product_id,
      p.name as product_name,
      p.description as product_description,
      p.price as current_price,
      p.image_url,
      p.stock,
      cat.name as category_name
    FROM carts c
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    LEFT JOIN products p ON ci.product_id = p.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE c.user_id = ?
    ORDER BY ci.added_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.json({
        cart_id: null,
        items: [],
        total_amount: 0,
        total_items: 0,
      });
    }

    // Transformation des données pour une réponse plus claire
    const cartData = {
      cart_id: results[0].cart_id,
      items: [],
      total_amount: 0,
      total_items: 0,
    };

    results.forEach((row) => {
      if (row.product_id) {
        const item = {
          cart_item_id: row.cart_item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          product_description: row.product_description,
          current_price: row.current_price,
          cart_price: row.cart_price,
          quantity: row.quantity,
          image_url: row.image_url,
          stock: row.stock,
          category_name: row.category_name,
          subtotal: row.cart_price * row.quantity,
          added_at: row.added_at,
        };

        cartData.items.push(item);
        cartData.total_amount += item.subtotal;
        cartData.total_items += row.quantity;
      }
    });

    res.json(cartData);
  });
};

// ========================
// Ajoute un produit au panier
export const addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  if (!product_id || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "product_id et quantity (>0) requis" });
  }

  db.query(
    "SELECT price, stock FROM products WHERE id = ?",
    [product_id],
    (err, productResults) => {
      if (err) return res.status(500).json({ error: err });

      if (productResults.length === 0) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      const product = productResults[0];

      if (product.stock < quantity) {
        return res.status(400).json({
          message: "Stock insuffisant",
          available_stock: product.stock,
        });
      }

      db.query(
        "SELECT id FROM carts WHERE user_id = ?",
        [userId],
        (err, cartResults) => {
          if (err) return res.status(500).json({ error: err });

          let cartId;

          if (cartResults.length === 0) {
            db.query(
              "INSERT INTO carts (user_id) VALUES (?)",
              [userId],
              (err, result) => {
                if (err) return res.status(500).json({ error: err });
                cartId = result.insertId;
                addItemToCart();
              }
            );
          } else {
            cartId = cartResults[0].id;
            addItemToCart();
          }

          function addItemToCart() {
            db.query(
              "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
              [cartId, product_id],
              (err, existingItems) => {
                if (err) return res.status(500).json({ error: err });

                if (existingItems.length > 0) {
                  const newQuantity = existingItems[0].quantity + quantity;

                  if (product.stock < newQuantity) {
                    return res.status(400).json({
                      message: "Stock insuffisant pour cette quantité",
                      available_stock: product.stock,
                      current_cart_quantity: existingItems[0].quantity,
                    });
                  }

                  db.query(
                    "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
                    [newQuantity, cartId, product_id],
                    (err) => {
                      if (err) return res.status(500).json({ error: err });
                      res.json({
                        message: "Quantité mise à jour dans le panier",
                        new_quantity: newQuantity,
                      });
                    }
                  );
                } else {
                  db.query(
                    "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                    [cartId, product_id, quantity, product.price],
                    (err) => {
                      if (err) return res.status(500).json({ error: err });
                      res.status(201).json({
                        message: "Produit ajouté au panier",
                        quantity: quantity,
                      });
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  );
};

// ========================
// Met à jour la quantité d'un article dans le panier
export const updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { cart_item_id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantité doit être supérieure à 0" });
  }

  const sql = `
    SELECT ci.*, p.stock 
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    WHERE ci.id = ? AND c.user_id = ?
  `;

  db.query(sql, [cart_item_id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Article non trouvé dans votre panier" });
    }

    const item = results[0];

    if (item.stock < quantity) {
      return res.status(400).json({
        message: "Stock insuffisant",
        available_stock: item.stock,
      });
    }

    db.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, cart_item_id],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Quantité mise à jour" });
      }
    );
  });
};

// ========================
// Supprime un article du panier
export const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { cart_item_id } = req.params;

  const sql = `
    SELECT ci.id 
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    WHERE ci.id = ? AND c.user_id = ?
  `;

  db.query(sql, [cart_item_id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Article non trouvé dans votre panier" });
    }

    db.query("DELETE FROM cart_items WHERE id = ?", [cart_item_id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Article supprimé du panier" });
    });
  });
};

// ========================
// Vide complètement le panier
export const clearCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
    DELETE ci FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Panier vidé avec succès" });
  });
};

// ========================
// Récupère le nombre total d'articles dans le panier (pour badge)
export const getCartCount = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT COALESCE(SUM(ci.quantity), 0) as total_items
    FROM carts c
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      total_items: results[0].total_items || 0,
    });
  });
};
