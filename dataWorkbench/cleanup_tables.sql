-- Script de nettoyage pour Supabase - Soundora
-- À exécuter AVANT supabase_init.sql si tu as des anciennes tables

-- =================================
-- SUPPRESSION DES ANCIENNES TABLES
-- =================================

-- Supprimer les policies RLS d'abord
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON brands;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_slug(TEXT);

-- Supprimer les tables dans l'ordre correct (à cause des contraintes)
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Message de confirmation
SELECT 'Tables nettoyées avec succès! Vous pouvez maintenant exécuter supabase_init.sql' AS status;
