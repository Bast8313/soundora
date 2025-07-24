import supabase from "../config/supabase.js"; // Import du client Supabase

// ========================
// Créer une commande à partir du panier
export const createOrder = (req, res) => {
  const userId = req.user.id;
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ message: "Adresse de livraison requise" });
  }

  // Récupérer le panier avec tous les articles
  const getCartSql = `
    SELECT 
      c.id as cart_id,
      ci.product_id,
      ci.quantity,
      ci.price as cart_price,
      p.stock
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(getCartSql, [userId], (err, cartItems) => {
    if (err) return res.status(500).json({ error: err });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // Vérifier le stock pour tous les articles
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuffisant pour le produit ${item.product_id}`,
        });
      }
    }

    // Calculer le montant total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.cart_price * item.quantity,
      0
    );

    // Créer la commande
    const createOrderSql = `
      INSERT INTO orders (user_id, total_amount, shipping_address, status, order_date)
      VALUES (?, ?, ?, 'confirmed', NOW())
    `;
    db.query(
      createOrderSql,
      [userId, totalAmount, shipping_address],
      (err, orderResult) => {
        if (err) return res.status(500).json({ error: err });

        const orderId = orderResult.insertId;

        // Insérer les articles de la commande
        let completed = 0;
        for (const item of cartItems) {
          const insertOrderItemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
          `;
          db.query(
            insertOrderItemSql,
            [orderId, item.product_id, item.quantity, item.cart_price],
            (err) => {
              if (err) return res.status(500).json({ error: err });

              // Mettre à jour le stock
              const updateStockSql = `
                UPDATE products SET stock = stock - ? WHERE id = ?
              `;
              db.query(
                updateStockSql,
                [item.quantity, item.product_id],
                (err) => {
                  if (err) return res.status(500).json({ error: err });

                  completed++;
                  // Quand tous les articles sont traités, vider le panier
                  if (completed === cartItems.length) {
                    const clearCartSql = `
                      DELETE FROM cart_items WHERE cart_id = ?
                    `;
                    db.query(clearCartSql, [cartItems[0].cart_id], (err) => {
                      if (err) return res.status(500).json({ error: err });

                      res.status(201).json({
                        message: "Commande créée avec succès",
                        order_id: orderId,
                        total_amount: totalAmount,
                      });
                    });
                  }
                }
              );
            }
          );
        }
      }
    );
  });
};

// ========================
// Récupérer les commandes de l'utilisateur
export const getUserOrders = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      o.id as order_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.order_date,
      o.created_at,
      COUNT(oi.id) as items_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ========================
// Récupérer les détails d'une commande
export const getOrderDetails = (req, res) => {
  const userId = req.user.id;
  const { order_id } = req.params;

  const sql = `
    SELECT 
      o.id as order_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.order_date,
      o.created_at,
      oi.product_id,
      oi.quantity,
      oi.price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND o.id = ?
  `;

  db.query(sql, [userId, order_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.json(results);
  });
};
