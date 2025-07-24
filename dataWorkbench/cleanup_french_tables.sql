-- Script de nettoyage ciblé pour les tables françaises existantes
-- Supabase - Soundora

-- =================================
-- SUPPRESSION DES TABLES FRANÇAISES EXISTANTES
-- =================================

-- Supprimer les policies sur les tables françaises
DROP POLICY IF EXISTS "Products are viewable by everyone" ON produits;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categorie;
DROP POLICY IF EXISTS "Users can view own orders" ON "ordre d'ordre";
DROP POLICY IF EXISTS "Users can manage own cart" ON carte;

-- Supprimer les triggers sur les tables françaises
DROP TRIGGER IF EXISTS update_categorie_updated_at ON categorie;
DROP TRIGGER IF EXISTS update_produits_updated_at ON produits;
DROP TRIGGER IF EXISTS update_utilisateur_updated_at ON utilisateur;

-- Supprimer les tables françaises dans l'ordre correct
-- (Tables de liaison d'abord pour éviter les contraintes)
DROP TABLE IF EXISTS carte CASCADE;
DROP TABLE IF EXISTS facture CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS "ordre d'ordre" CASCADE;
DROP TABLE IF EXISTS "sous-categorie" CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS categorie CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;

-- Supprimer aussi les éventuelles variantes
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_slug(TEXT) CASCADE;

-- Message de confirmation
SELECT 'Toutes les tables françaises et anglaises ont été supprimées. Prêt pour la création!' AS status;
