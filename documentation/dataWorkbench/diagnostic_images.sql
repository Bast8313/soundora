-- Script de diagnostic pour vérifier les images des produits
-- À exécuter dans Supabase SQL Editor

-- =================================
-- 1. VÉRIFICATION DES AMPLIS
-- =================================
SELECT 
    '🔊 AMPLIS' AS categorie,
    p.name AS nom_produit,
    p.model AS modele_bdd,
    p.slug,
    COALESCE(p.images->0, p.image_url, 'NULL') AS image_url,
    c.name AS categorie_nom,
    b.name AS marque
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE c.name ILIKE '%ampli%'
ORDER BY p.name;

-- =================================
-- 2. VÉRIFICATION DES PÉDALES
-- =================================
SELECT 
    '🎛️ PÉDALES' AS categorie,
    p.name AS nom_produit,
    p.model AS modele_bdd,
    p.slug,
    COALESCE(p.images->0, p.image_url, 'NULL') AS image_url,
    c.name AS categorie_nom,
    b.name AS marque
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE c.slug = 'pedales-effets'
ORDER BY p.name;

-- =================================
-- 3. COMPTAGE PAR CATÉGORIE
-- =================================
SELECT 
    c.name AS categorie,
    c.slug,
    COUNT(p.id) AS nombre_produits,
    COUNT(CASE WHEN p.model IS NOT NULL THEN 1 END) AS avec_modele,
    COUNT(CASE WHEN p.images IS NOT NULL AND p.images != '[]'::jsonb THEN 1 END) AS avec_images
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.slug IN ('amplis-guitare', 'amplis-basse', 'pedales-effets')
GROUP BY c.id, c.name, c.slug
ORDER BY c.name;

-- =================================
-- 4. PRODUITS SANS MODÈLE
-- =================================
SELECT 
    '⚠️ PRODUITS SANS MODÈLE' AS alerte,
    p.name,
    p.slug,
    c.name AS categorie
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.model IS NULL OR p.model = ''
ORDER BY c.name, p.name;

-- =================================
-- 5. VÉRIFICATION DES MARQUES DE PÉDALES
-- =================================
SELECT 
    name AS marque,
    slug,
    is_active
FROM brands
WHERE slug IN ('boss', 'electro-harmonix', 'mxr', 'tc-electronic')
ORDER BY name;
