-- Script d'enrichissement complet pour Soundora
-- Catégories hiérarchiques + Large gamme de produits musicaux

-- =================================
-- 1. NETTOYAGE PRÉALABLE (optionnel)
-- =================================
-- Décommentez si vous voulez repartir à zéro
-- DELETE FROM cart_items;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM products;
-- DELETE FROM categories WHERE parent_id IS NOT NULL;
-- DELETE FROM categories WHERE parent_id IS NULL;
-- DELETE FROM brands;

-- =================================
-- 2. MARQUES COMPLÈTES
-- =================================
INSERT INTO brands (name, slug, description, logo_url, website_url, is_active) VALUES
-- Guitares
('Fender', 'fender', 'Marque légendaire américaine de guitares et amplificateurs', 'https://logo.com/fender.png', 'https://www.fender.com', true),
('Gibson', 'gibson', 'Fabricant emblématique de guitares premium depuis 1902', 'https://logo.com/gibson.png', 'https://www.gibson.com', true),
('Martin', 'martin', 'Guitares acoustiques de prestige depuis 1833', 'https://logo.com/martin.png', 'https://www.martinguitar.com', true),
('Taylor', 'taylor', 'Guitares acoustiques innovantes et modernes', 'https://logo.com/taylor.png', 'https://www.taylorguitars.com', true),
('Ibanez', 'ibanez', 'Guitares électriques pour rock et metal', 'https://logo.com/ibanez.png', 'https://www.ibanez.com', true),
('PRS', 'prs', 'Paul Reed Smith - Guitares artisanales haut de gamme', 'https://logo.com/prs.png', 'https://www.prsguitars.com', true),

-- Amplification
('Marshall', 'marshall', 'Amplificateurs de guitare iconiques', 'https://logo.com/marshall.png', 'https://www.marshall.com', true),
('Orange', 'orange', 'Amplificateurs britanniques avec caractère', 'https://logo.com/orange.png', 'https://www.orangeamps.com', true),
('Mesa Boogie', 'mesa-boogie', 'Amplificateurs haut de gamme américains', 'https://logo.com/mesa.png', 'https://www.mesaboogie.com', true),
('Vox', 'vox', 'Amplificateurs britanniques vintage', 'https://logo.com/vox.png', 'https://www.voxamps.com', true),

-- Claviers/Électronique
('Roland', 'roland', 'Instruments électroniques et équipements audio professionnels', 'https://logo.com/roland.png', 'https://www.roland.com', true),
('Yamaha', 'yamaha', 'Fabricant polyvalent d''instruments de musique', 'https://logo.com/yamaha.png', 'https://www.yamaha.com', true),
('Korg', 'korg', 'Synthétiseurs et instruments électroniques innovants', 'https://logo.com/korg.png', 'https://www.korg.com', true),
('Native Instruments', 'native-instruments', 'Logiciels et contrôleurs MIDI avancés', 'https://logo.com/ni.png', 'https://www.native-instruments.com', true),

-- Batterie
('DW', 'dw', 'Drum Workshop - Batteries haut de gamme', 'https://logo.com/dw.png', 'https://www.dwdrums.com', true),
('Pearl', 'pearl', 'Batteries et percussions japonaises', 'https://logo.com/pearl.png', 'https://www.pearldrum.com', true),
('Tama', 'tama', 'Batteries rock et metal de référence', 'https://logo.com/tama.png', 'https://www.tama.com', true),

-- Vents
('Selmer', 'selmer', 'Saxophones et clarinettes professionnels', 'https://logo.com/selmer.png', 'https://www.selmer.fr', true),
('Bach', 'bach', 'Cuivres professionnels de prestige', 'https://logo.com/bach.png', 'https://www.bachbrass.com', true),

-- Audio/Studio
('Shure', 'shure', 'Microphones et équipements audio professionnels', 'https://logo.com/shure.png', 'https://www.shure.com', true),
('Audio-Technica', 'audio-technica', 'Microphones et casques de studio', 'https://logo.com/at.png', 'https://www.audio-technica.com', true),
('Focusrite', 'focusrite', 'Interfaces audio et préamplis', 'https://logo.com/focusrite.png', 'https://www.focusrite.com', true),

-- Effets
('Boss', 'boss', 'Pédales d''effets et équipements pour guitaristes', 'https://logo.com/boss.png', 'https://www.boss.info', true),
('TC Electronic', 'tc-electronic', 'Processeurs d''effets professionnels', 'https://logo.com/tc.png', 'https://www.tcelectronic.com', true),
('Electro-Harmonix', 'electro-harmonix', 'Pédales d''effets créatives et vintage', 'https://logo.com/ehx.png', 'https://www.ehx.com', true);

-- =================================
-- 3. HIÉRARCHIE COMPLÈTE DES CATÉGORIES
-- =================================

-- Catégories principales
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Instruments', 'instruments', 'Tous les instruments de musique', NULL, 1, true),
('Amplification', 'amplification', 'Amplificateurs et systèmes audio', NULL, 2, true),
('Effets & Processing', 'effets-processing', 'Pédales d''effets et processeurs', NULL, 3, true),
('Studio & Enregistrement', 'studio-enregistrement', 'Matériel de studio et enregistrement', NULL, 4, true),
('Accessoires', 'accessoires', 'Accessoires et consommables', NULL, 5, true);

-- Sous-catégories INSTRUMENTS
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
-- Cordes
('Guitares', 'guitares', 'Guitares électriques, acoustiques et classiques', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 1, true),
('Basses', 'basses', 'Guitares basses électriques et acoustiques', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 2, true),
('Violons & Cordes Classiques', 'violons-cordes-classiques', 'Violons, altos, violoncelles', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 3, true),

-- Claviers
('Claviers & Pianos', 'claviers-pianos', 'Pianos, synthétiseurs, claviers', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 4, true),

-- Vents
('Instruments à Vent', 'instruments-vent', 'Saxophones, trompettes, clarinettes', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 5, true),

-- Percussions
('Batterie & Percussion', 'batterie-percussion', 'Batteries, cymbales, percussions', 
    (SELECT id FROM categories WHERE slug = 'instruments'), 6, true);

-- Sous-catégories GUITARES (niveau 3)
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Guitares Électriques', 'guitares-electriques', 'Guitares électriques solid body et hollow body', 
    (SELECT id FROM categories WHERE slug = 'guitares'), 1, true),
('Guitares Acoustiques', 'guitares-acoustiques', 'Guitares acoustiques folk et fingerstyle', 
    (SELECT id FROM categories WHERE slug = 'guitares'), 2, true),
('Guitares Classiques', 'guitares-classiques', 'Guitares classiques et flamenco', 
    (SELECT id FROM categories WHERE slug = 'guitares'), 3, true),
('Guitares 12 Cordes', 'guitares-12-cordes', 'Guitares acoustiques et électriques 12 cordes', 
    (SELECT id FROM categories WHERE slug = 'guitares'), 4, true);

-- Sous-catégories BASSES (niveau 3)
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Basses Électriques', 'basses-electriques', 'Basses électriques 4, 5 et 6 cordes', 
    (SELECT id FROM categories WHERE slug = 'basses'), 1, true),
('Basses Acoustiques', 'basses-acoustiques', 'Basses acoustiques et électro-acoustiques', 
    (SELECT id FROM categories WHERE slug = 'basses'), 2, true),
('Contrebasses', 'contrebasses', 'Contrebasses classiques et jazz', 
    (SELECT id FROM categories WHERE slug = 'basses'), 3, true);

-- Sous-catégories CLAVIERS (niveau 3)
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Pianos Numériques', 'pianos-numeriques', 'Pianos numériques et arrangeurs', 
    (SELECT id FROM categories WHERE slug = 'claviers-pianos'), 1, true),
('Synthétiseurs', 'synthetiseurs', 'Synthétiseurs analogiques et numériques', 
    (SELECT id FROM categories WHERE slug = 'claviers-pianos'), 2, true),
('Claviers Maîtres', 'claviers-maitres', 'Contrôleurs MIDI et claviers de studio', 
    (SELECT id FROM categories WHERE slug = 'claviers-pianos'), 3, true),
('Orgues', 'orgues', 'Orgues Hammond et électroniques', 
    (SELECT id FROM categories WHERE slug = 'claviers-pianos'), 4, true);

-- Sous-catégories VENTS (niveau 3)
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Saxophones', 'saxophones', 'Saxophones alto, ténor, soprano, baryton', 
    (SELECT id FROM categories WHERE slug = 'instruments-vent'), 1, true),
('Trompettes & Cuivres', 'trompettes-cuivres', 'Trompettes, cornets, flugelhorns', 
    (SELECT id FROM categories WHERE slug = 'instruments-vent'), 2, true),
('Clarinettes', 'clarinettes', 'Clarinettes si bémol, la, basse', 
    (SELECT id FROM categories WHERE slug = 'instruments-vent'), 3, true),
('Flûtes', 'flutes', 'Flûtes traversières, piccolos', 
    (SELECT id FROM categories WHERE slug = 'instruments-vent'), 4, true);

-- Sous-catégories BATTERIE (niveau 3)
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Batteries Acoustiques', 'batteries-acoustiques', 'Kits de batterie acoustique complets', 
    (SELECT id FROM categories WHERE slug = 'batterie-percussion'), 1, true),
('Batteries Électroniques', 'batteries-electroniques', 'Kits électroniques et modules', 
    (SELECT id FROM categories WHERE slug = 'batterie-percussion'), 2, true),
('Cymbales', 'cymbales', 'Cymbales ride, crash, hi-hat, splash', 
    (SELECT id FROM categories WHERE slug = 'batterie-percussion'), 3, true),
('Percussions', 'percussions', 'Djembés, congas, cajóns, timbales', 
    (SELECT id FROM categories WHERE slug = 'batterie-percussion'), 4, true);

-- Sous-catégories AMPLIFICATION
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Amplis Guitare', 'amplis-guitare', 'Amplificateurs pour guitares électriques', 
    (SELECT id FROM categories WHERE slug = 'amplification'), 1, true),
('Amplis Basse', 'amplis-basse', 'Amplificateurs pour guitares basses', 
    (SELECT id FROM categories WHERE slug = 'amplification'), 2, true),
('Systèmes PA', 'systemes-pa', 'Sonorisation et systèmes de diffusion', 
    (SELECT id FROM categories WHERE slug = 'amplification'), 3, true),
('Moniteurs Studio', 'moniteurs-studio', 'Enceintes de monitoring et référence', 
    (SELECT id FROM categories WHERE slug = 'amplification'), 4, true);

-- Sous-catégories STUDIO
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Microphones', 'microphones', 'Microphones de studio et scène', 
    (SELECT id FROM categories WHERE slug = 'studio-enregistrement'), 1, true),
('Interfaces Audio', 'interfaces-audio', 'Cartes son et interfaces d''enregistrement', 
    (SELECT id FROM categories WHERE slug = 'studio-enregistrement'), 2, true),
('Casques & Écoute', 'casques-ecoute', 'Casques de studio et monitoring', 
    (SELECT id FROM categories WHERE slug = 'studio-enregistrement'), 3, true),
('Contrôleurs MIDI', 'controleurs-midi', 'Surfaces de contrôle et séquenceurs', 
    (SELECT id FROM categories WHERE slug = 'studio-enregistrement'), 4, true);

-- Sous-catégories EFFETS
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Pédales Guitare', 'pedales-guitare', 'Pédales d''effets pour guitare', 
    (SELECT id FROM categories WHERE slug = 'effets-processing'), 1, true),
('Racks d''Effets', 'racks-effets', 'Processeurs multi-effets rack', 
    (SELECT id FROM categories WHERE slug = 'effets-processing'), 2, true),
('Processeurs Vocaux', 'processeurs-vocaux', 'Effets et traitements pour voix', 
    (SELECT id FROM categories WHERE slug = 'effets-processing'), 3, true);

-- Sous-catégories ACCESSOIRES
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Câbles', 'cables', 'Câbles jack, XLR, MIDI, USB', 
    (SELECT id FROM categories WHERE slug = 'accessoires'), 1, true),
('Supports & Pieds', 'supports-pieds', 'Pieds de micro, stands guitare, pupitres', 
    (SELECT id FROM categories WHERE slug = 'accessoires'), 2, true),
('Étuis & Housses', 'etuis-housses', 'Protection et transport d''instruments', 
    (SELECT id FROM categories WHERE slug = 'accessoires'), 3, true),
('Cordes & Consommables', 'cordes-consommables', 'Cordes, peaux, anches, médiators', 
    (SELECT id FROM categories WHERE slug = 'accessoires'), 4, true),
('Partitions & Méthodes', 'partitions-methodes', 'Livres de musique et méthodes d''apprentissage', 
    (SELECT id FROM categories WHERE slug = 'accessoires'), 5, true);

-- Message de confirmation
SELECT 'Structure des catégories créée avec succès!' AS status,
       (SELECT COUNT(*) FROM categories WHERE parent_id IS NULL) AS categories_principales,
       (SELECT COUNT(*) FROM categories WHERE parent_id IS NOT NULL) AS sous_categories,
       (SELECT COUNT(*) FROM brands) AS marques;
