-- =====================================
-- TABLE ORDERS POUR STRIPE CHECKOUT (NON OBLIGATOIRE MAIS PRATIQUE ^^)
-- =====================================
-- Stocke les commandes après paiement Stripe confirmé

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    
    -- IDENTIFIANTS STRIPE
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,      -- ID de la session Stripe
    stripe_payment_intent_id VARCHAR(255),               -- ID de l'intent de paiement
    
    -- INFORMATIONS CLIENT
    user_email VARCHAR(255) NOT NULL,                    -- Email de l'utilisateur
    user_id UUID REFERENCES auth.users(id),              -- Lien vers utilisateur Supabase (optionnel)
    
    -- MONTANTS ET DEVISES
    total_amount DECIMAL(10,2) NOT NULL,                 -- Montant total en euros
    currency VARCHAR(3) DEFAULT 'eur',                   -- Devise (EUR par défaut)
    
    -- STATUTS
    payment_status VARCHAR(50) DEFAULT 'pending',        -- Statut paiement: pending, completed, failed
    order_status VARCHAR(50) DEFAULT 'confirmed',        -- Statut commande: confirmed, processing, shipped, delivered
    
    -- ADRESSES (JSON pour flexibilité)
    billing_address JSONB,                               -- Adresse de facturation
    shipping_address JSONB,                              -- Adresse de livraison
    
    -- MÉTADONNÉES ET TRACKING
    metadata JSONB,                                      -- Métadonnées Stripe et autres infos
    tracking_number VARCHAR(255),                        -- Numéro de suivi colis
    notes TEXT,                                          -- Notes internes
    
    -- TIMESTAMPS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- Date de création
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()   -- Date de modification
);

-- =====================================
-- INDEX POUR PERFORMANCES
-- =====================================
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =====================================
-- RLS (ROW LEVEL SECURITY) POUR SUPABASE
-- =====================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Un utilisateur peut voir ses propres commandes
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.email() = user_email OR
        auth.uid() = user_id
    );

-- Policy: Seuls les administrateurs peuvent créer/modifier les commandes
-- (En production, cette création se fait via le webhook Stripe)
CREATE POLICY "Service can manage orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================
-- TABLE ITEMS DE COMMANDE (OPTIONNEL)
-- =====================================
-- Pour stocker le détail des articles de chaque commande

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    
    -- INFORMATIONS PRODUIT
    product_id INTEGER,                                  -- ID du produit
    product_name VARCHAR(255) NOT NULL,                 -- Nom du produit
    product_sku VARCHAR(100),                           -- Référence produit
    brand_name VARCHAR(255),                            -- Marque
    category_name VARCHAR(255),                         -- Catégorie
    
    -- PRIX ET QUANTITÉ
    unit_price DECIMAL(10,2) NOT NULL,                  -- Prix unitaire
    quantity INTEGER NOT NULL DEFAULT 1,                -- Quantité
    total_price DECIMAL(10,2) NOT NULL,                 -- Prix total (unit_price * quantity)
    
    -- MÉTADONNÉES
    product_image_url TEXT,                             -- URL de l'image produit
    product_metadata JSONB,                             -- Autres infos produit
    
    -- TIMESTAMPS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les items de commande
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- RLS pour order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_email = auth.email() OR orders.user_id = auth.uid())
        )
    );

-- =====================================
-- COMMENTAIRES ET DOCUMENTATION
-- =====================================

COMMENT ON TABLE orders IS 'Commandes créées après paiement Stripe confirmé';
COMMENT ON COLUMN orders.stripe_session_id IS 'ID unique de la session Stripe Checkout';
COMMENT ON COLUMN orders.payment_status IS 'Statut du paiement: pending, completed, failed, refunded';
COMMENT ON COLUMN orders.order_status IS 'Statut de la commande: confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN orders.billing_address IS 'Adresse de facturation au format JSON';
COMMENT ON COLUMN orders.shipping_address IS 'Adresse de livraison au format JSON';

COMMENT ON TABLE order_items IS 'Détail des articles pour chaque commande';
COMMENT ON COLUMN order_items.total_price IS 'Prix total = prix_unitaire × quantité';
