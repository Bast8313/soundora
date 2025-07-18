const db = require("../config/db");

// ========================
// Créer une commande à partir du panier
exports.createOrder = (req, res) => {
  const userId = req.user.id;
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ message: "Adresse de livraison requise" });
  }

  // Récupérer le panier avec tous les articles
  const getCartSql = `
    SELECT 
      c.id as cart_id,
      ci.id as cart_item_id,
      ci.product_id,
      ci.quantity,
      ci.price as cart_price,
      p.name as product_name,
      p.stock,
      p.price as current_price
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
    const stockErrors = [];
    let totalAmount = 0;

    cartItems.forEach((item) => {
      if (item.stock < item.quantity) {
        stockErrors.push({
          product_name: item.product_name,
          requested: item.quantity,
          available: item.stock,
        });
      }
      totalAmount += item.cart_price * item.quantity;
    });

    if (stockErrors.length > 0) {
      return res.status(400).json({
        message: "Stock insuffisant pour certains articles",
        stock_errors: stockErrors,
      });
    }

    // Commencer une transaction pour créer la commande
    db.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: err });

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return res.status(500).json({ error: err });
        }

        // Créer la commande
        const createOrderSql = `
        INSERT INTO orders (user_id, total_amount, shipping_address, status, order_date)
        VALUES (?, ?, ?, 'confirmed', NOW())
      `;

        connection.query(
          createOrderSql,
          [userId, totalAmount, shipping_address],
          (err, orderResult) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: err });
              });
            }

            const orderId = orderResult.insertId;

            // Créer les articles de commande et mettre à jour le stock
            let completedItems = 0;
            let hasError = false;

            cartItems.forEach((item) => {
              // Insérer l'article dans order_items
              const insertOrderItemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
            VALUES (?, ?, ?, ?, ?)
          `;

              connection.query(
                insertOrderItemSql,
                [
                  orderId,
                  item.product_id,
                  item.quantity,
                  item.cart_price,
                  item.product_name,
                ],
                (err) => {
                  if (err && !hasError) {
                    hasError = true;
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: err });
                    });
                  }

                  // Mettre à jour le stock du produit
                  const updateStockSql = `
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ?
              `;

                  connection.query(
                    updateStockSql,
                    [item.quantity, item.product_id],
                    (err) => {
                      if (err && !hasError) {
                        hasError = true;
                        return connection.rollback(() => {
                          connection.release();
                          res.status(500).json({ error: err });
                        });
                      }

                      completedItems++;

                      // Si tous les articles sont traités, finaliser
                      if (completedItems === cartItems.length && !hasError) {
                        // Vider le panier
                        const clearCartSql = `
                    DELETE FROM cart_items 
                    WHERE cart_id = ?
                  `;

                        connection.query(
                          clearCartSql,
                          [cartItems[0].cart_id],
                          (err) => {
                            if (err) {
                              return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: err });
                              });
                            }

                            // Confirmer la transaction
                            connection.commit((err) => {
                              connection.release();
                              if (err) {
                                return res.status(500).json({ error: err });
                              }

                              res.status(201).json({
                                message: "Commande créée avec succès",
                                order_id: orderId,
                                total_amount: totalAmount,
                                items_count: cartItems.length,
                              });
                            });
                          }
                        );
                      }
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
  });
};

// ========================
// Récupérer les commandes de l'utilisateur
exports.getUserOrders = (req, res) => {
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
exports.getOrderDetails = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.order_id;

  const sql = `
    SELECT 
      o.id as order_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.order_date,
      o.created_at,
      oi.product_id,
      oi.product_name,
      oi.quantity,
      oi.price,
      p.image_url,
      p.description
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(sql, [orderId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Structurer la réponse
    const order = {
      order_id: results[0].order_id,
      total_amount: results[0].total_amount,
      status: results[0].status,
      shipping_address: results[0].shipping_address,
      order_date: results[0].order_date,
      created_at: results[0].created_at,
      items: [],
    };

    results.forEach((row) => {
      if (row.product_id) {
        order.items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
          image_url: row.image_url,
          description: row.description,
          subtotal: row.price * row.quantity,
        });
      }
    });

    res.json(order);
  });
};
