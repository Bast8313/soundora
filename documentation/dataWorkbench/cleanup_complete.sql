-- Script de nettoyage complet pour Supabase - Soundora
-- Supprime TOUTES les tables existantes (anglais ET français)

-- =================================
-- SUPPRESSION COMPLÈTE
-- =================================

-- Supprimer toutes les policies RLS possibles
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON produits;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON catégories;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON brands;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON marques;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON commandes;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON panier;

-- Supprimer tous les triggers possibles
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_categories_updated_at ON catégories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_products_updated_at ON produits;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_users_updated_at ON utilisateurs;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_orders_updated_at ON commandes;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON panier;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_slug(TEXT) CASCADE;

-- Supprimer TOUTES les tables possibles (anglais et français)
-- Tables de liaison d'abord
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS panier CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS commande_items CASCADE;
DROP TABLE IF EXISTS products_has_orders CASCADE;
DROP TABLE IF EXISTS produits_has_commandes CASCADE;
DROP TABLE IF EXISTS products_has_users CASCADE;
DROP TABLE IF EXISTS produits_has_utilisateurs CASCADE;

-- Tables principales
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS commandes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS marques CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS catégories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Message de confirmation
SELECT 'Nettoyage complet terminé! Toutes les tables ont été supprimées.' AS status;
