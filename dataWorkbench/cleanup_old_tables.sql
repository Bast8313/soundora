-- Script de nettoyage pour Supabase - Soundora
-- À exécuter AVANT supabase_init.sql pour supprimer les anciennes tables

-- =================================
-- SUPPRESSION DES ANCIENNES TABLES
-- =================================

-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Supprimer les fonctions si elles existent
DROP FUNCTION IF EXISTS generate_slug(TEXT);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Message de confirmation
SELECT 'Anciennes tables supprimées avec succès' AS status;
