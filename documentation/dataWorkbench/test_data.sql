-- Script de données de test pour Soundora
-- À exécuter après supabase_init.sql

-- =================================
-- 1. INSERTION DES MARQUES
-- =================================
INSERT INTO brands (name, slug, description) VALUES
('Fender', 'fender', 'Marque légendaire de guitares électriques et amplificateurs'),
('Gibson', 'gibson', 'Fabricant emblématique de guitares depuis 1902'),
('Marshall', 'marshall', 'Amplificateurs de guitare mondialement reconnus'),
('Roland', 'roland', 'Instruments électroniques et équipements audio professionnels'),
('Yamaha', 'yamaha', 'Fabricant d instruments de musique polyvalent'),
('Shure', 'shure', 'Microphones et équipements audio professionnels'),
('Boss', 'boss', 'Pédales d effets et équipements pour guitaristes'),
('Ibanez', 'ibanez', 'Guitares électriques et acoustiques');

-- =================================
-- 2. INSERTION DES CATÉGORIES PRINCIPALES
-- =================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Instruments', 'instruments', 'Tous les instruments de musique', 1),
('Amplification', 'amplification', 'Amplificateurs et systèmes de sonorisation', 2),
('Effets & Processing', 'effets-processing', 'Pédales d effets et processeurs audio', 3),
('Studio & Enregistrement', 'studio-enregistrement', 'Équipements pour home studio et enregistrement', 4),
('Accessoires', 'accessoires', 'Câbles, supports et accessoires divers', 5);

-- =================================
-- 3. SOUS-CATÉGORIES INSTRUMENTS
-- =================================
DO $$
DECLARE
    instruments_id UUID;
BEGIN
    -- Récupérer l'ID de la catégorie Instruments
    SELECT id INTO instruments_id FROM categories WHERE slug = 'instruments';
    
    -- Insérer les sous-catégories
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Guitares', 'guitares', 'Guitares électriques, acoustiques et classiques', instruments_id, 1),
    ('Basses', 'basses', 'Guitares basses électriques et acoustiques', instruments_id, 2),
    ('Claviers & Pianos', 'claviers-pianos', 'Pianos numériques, synthétiseurs et claviers', instruments_id, 3),
    ('Batterie & Percussion', 'batterie-percussion', 'Batteries, cymbales et percussions', instruments_id, 4),
    ('Vents', 'vents', 'Saxophones, trompettes, clarinettes', instruments_id, 5),
    ('Cordes', 'cordes', 'Violons, altos, violoncelles', instruments_id, 6);
END $$;

-- =================================
-- 4. SOUS-CATÉGORIES AMPLIFICATION
-- =================================
DO $$
DECLARE
    ampli_id UUID;
BEGIN
    SELECT id INTO ampli_id FROM categories WHERE slug = 'amplification';
    
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Amplis Guitare', 'amplis-guitare', 'Amplificateurs pour guitares électriques', ampli_id, 1),
    ('Amplis Basse', 'amplis-basse', 'Amplificateurs pour guitares basses', ampli_id, 2),
    ('Systèmes PA', 'systemes-pa', 'Sonorisation et systèmes de diffusion', ampli_id, 3);
END $$;

-- =================================
-- 5. PRODUITS D'EXEMPLE
-- =================================
DO $$
DECLARE
    guitares_id UUID;
    amplis_guitare_id UUID;
    fender_id UUID;
    marshall_id UUID;
    gibson_id UUID;
BEGIN
    -- Récupérer les IDs nécessaires
    SELECT id INTO guitares_id FROM categories WHERE slug = 'guitares';
    SELECT id INTO amplis_guitare_id FROM categories WHERE slug = 'amplis-guitare';
    SELECT id INTO fender_id FROM brands WHERE slug = 'fender';
    SELECT id INTO marshall_id FROM brands WHERE slug = 'marshall';
    SELECT id INTO gibson_id FROM brands WHERE slug = 'gibson';
    
    -- Guitares Fender
    INSERT INTO products (
        name, slug, description, short_description, price, stock, sku,
        category_id, brand_id, model, color,
        images, specifications,
        is_featured
    ) VALUES
    (
        'Fender Player Stratocaster',
        'fender-player-stratocaster-sunburst',
        'La légendaire Stratocaster dans sa version Player Series, offrant le son authentique Fender avec des améliorations modernes.',
        'Guitare électrique Stratocaster avec micros Player Series',
        899.00, 5, 'FEND-STRAT-PLY-SB',
        guitares_id, fender_id, 'Player Stratocaster', 'Sunburst',
        '["https://example.com/images/fender-strat-1.jpg", "https://example.com/images/fender-strat-2.jpg"]',
        '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "Player Series Alnico 5", "vibrato": "Vintage-Style Synchronized"}',
        true
    ),
    (
        'Fender Player Telecaster',
        'fender-player-telecaster-butterscotch',
        'La Telecaster iconique avec le son cristallin et la polyvalence légendaire de Fender.',
        'Guitare électrique Telecaster avec micros Player Series',
        849.00, 3, 'FEND-TELE-PLY-BS',
        guitares_id, fender_id, 'Player Telecaster', 'Butterscotch Blonde',
        '["https://example.com/images/fender-tele-1.jpg"]',
        '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "Player Series Alnico 5", "chevalet": "6-Saddle Vintage-Style"}',
        true
    ),
    
    -- Gibson Les Paul
    (
        'Gibson Les Paul Standard 50s',
        'gibson-les-paul-standard-50s-tobacco',
        'La Les Paul Standard dans sa configuration des années 50, avec des micros P.A.F. et un son vintage authentique.',
        'Guitare électrique Les Paul avec micros Burstbucker',
        2499.00, 2, 'GIBS-LP-STD50-TB',
        guitares_id, gibson_id, 'Les Paul Standard 50s', 'Tobacco Burst',
        '["https://example.com/images/gibson-lp-1.jpg", "https://example.com/images/gibson-lp-2.jpg"]',
        '{"corps": "Acajou", "table": "Érable", "manche": "Acajou", "touche": "Palissandre", "micros": "Burstbucker Pro", "chevalet": "Tune-o-matic"}',
        true
    ),
    
    -- Ampli Marshall
    (
        'Marshall DSL40CR',
        'marshall-dsl40cr-combo',
        'Amplificateur combo 40W avec deux canaux et réverb numérique, parfait pour le studio et la scène.',
        'Ampli combo 40W avec lampes et réverb',
        749.00, 4, 'MARS-DSL40CR',
        amplis_guitare_id, marshall_id, 'DSL40CR', 'Noir',
        '["https://example.com/images/marshall-dsl40-1.jpg"]',
        '{"puissance": "40W", "haut_parleur": "Celestion V-Type 12", "lampes": "ECC83, EL34", "canaux": "2", "reverb": "Numérique", "effets": "Réverb"}',
        false
    );
END $$;
