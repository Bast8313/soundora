-- Script SQL pour Supabase - Soundora (Boutique d'instruments de musique)
-- À exécuter dans l'interface Supabase SQL Editor

-- =================================
-- NETTOYAGE : Suppression des tables existantes (si elles existent)
-- =================================
-- ATTENTION : Ceci va supprimer toutes les données existantes !
-- Ordre important : supprimer les tables avec foreign keys en premier

DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Suppression des fonctions si elles existent
DROP FUNCTION IF EXISTS generate_slug(TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- =================================
-- 1. TABLE CATEGORIES (hiérarchique)
-- =================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes hiérarchiques
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =================================
-- 2. TABLE BRANDS (marques)
-- =================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================
-- 3. TABLE PRODUCTS (enrichie pour les instruments)
-- =================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2), -- Prix barré pour promotions
  cost_price DECIMAL(10,2), -- Prix d'achat (privé)
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE, -- Code produit
  
  -- Relations
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  
  -- Données spécifiques aux instruments
  model VARCHAR(255),
  year_released INTEGER,
  country_origin VARCHAR(100),
  color VARCHAR(100),
  
  -- Images (JSON array)
  images JSONB DEFAULT '[]',
  
  -- Spécifications techniques (JSON flexible)
  specifications JSONB DEFAULT '{}',
  
  -- Dimensions & poids
  weight DECIMAL(8,2), -- en kg
  dimensions JSONB, -- {length, width, height} en cm
  
  -- SEO & Status
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);

-- =================================
-- 4. TABLE PROFILES (données utilisateur complémentaires)
-- Utilise auth.users de Supabase pour l'authentification
-- Cette table stocke les infos supplémentaires (adresse, téléphone, etc.)
-- =================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Lié à auth.users de Supabase
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  
  -- Adresse de facturation par défaut
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'France',
  
  -- Préférences utilisateur
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  
  -- Métadonnées
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches sur les profils
CREATE INDEX idx_profiles_email ON profiles(id); -- L'email est dans auth.users

-- =================================
-- 5. TABLE ORDERS (commandes)
-- user_id fait référence à auth.users (authentification Supabase)
-- =================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT, -- Référence auth.users de Supabase
  
  -- Montants
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Status de commande
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  
  -- Adresses (JSON pour flexibilité)
  shipping_address JSONB, -- {name, line1, line2, city, postal_code, country}
  billing_address JSONB,  -- Structure identique
  
  -- Notes et commentaires
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Suivi temporel
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les commandes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- =================================
-- 6. TABLE ORDER_ITEMS (articles de commande)
-- =================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Données au moment de la commande (pour historique)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================
-- 7. TABLE CART_ITEMS (panier temporaire)
-- user_id fait référence à auth.users (authentification Supabase)
-- =================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, --Référence auth.users de Supabase
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Métadonnées temporelles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- CONTRAINTE : Un utilisateur ne peut avoir qu'un seul item de chaque produit dans son panier
  UNIQUE(user_id, product_id)
);

-- =================================
-- 8. FONCTIONS UTILITAIRES
-- =================================

-- Fonction pour générer des slugs automatiquement
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(
      regexp_replace(text_input, '[éèêë]', 'e', 'g'),
      '[àâä]', 'a', 'g'
    ),
    '[^a-z0-9]+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- FONCTION : Création automatique d'un profil lors de l'inscription
-- Cette fonction est déclenchée quand un utilisateur s'inscrit via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER : Déclenche la création du profil lors de l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

--  TRIGGERS pour mise à jour automatique de updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- profiles au lieu de users
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================
-- 9. RLS (Row Level Security) - Politiques de sécurité
-- Utilise auth.uid() pour identifier l'utilisateur connecté via Supabase Auth
-- =================================

-- LECTURE PUBLIQUE : Tous peuvent voir les produits actifs
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);

--  LECTURE PUBLIQUE : Tous peuvent voir les catégories actives  
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);

-- LECTURE PUBLIQUE : Tous peuvent voir les marques actives
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are viewable by everyone" ON brands FOR SELECT USING (is_active = true);

-- DONNÉES PRIVÉES : Les utilisateurs ne voient que leurs propres profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- DONNÉES PRIVÉES : Les utilisateurs ne voient que leurs propres commandes
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- DONNÉES PRIVÉES : Les utilisateurs ne gèrent que leur propre panier
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- COMMENTAIRES DE DOCUMENTATION
COMMENT ON TABLE categories IS 'Catégories hiérarchiques pour les instruments de musique (guitares → guitares électriques)';
COMMENT ON TABLE products IS 'Produits - instruments, accessoires, équipements audio avec spécifications complètes';
COMMENT ON TABLE brands IS 'Marques d instruments et équipements musicaux (Fender, Gibson, etc.)';
COMMENT ON TABLE profiles IS 'Profils utilisateur complémentaires à auth.users (adresse, préférences)';
COMMENT ON TABLE orders IS 'Commandes des clients avec statuts et adresses';
COMMENT ON TABLE order_items IS 'Articles dans chaque commande (historique des prix)';
COMMENT ON TABLE cart_items IS 'Panier temporaire des utilisateurs connectés';
