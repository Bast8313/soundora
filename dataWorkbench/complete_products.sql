-- Script de produits complets pour Soundora
-- Large gamme d'instruments à exécuter après complete_catalog.sql

-- =================================
-- PRODUITS GUITARES ÉLECTRIQUES
-- =================================
DO $$
DECLARE
    cat_guitares_elec UUID;
    brand_fender UUID;
    brand_gibson UUID;
    brand_ibanez UUID;
    brand_prs UUID;
BEGIN
    SELECT id INTO cat_guitares_elec FROM categories WHERE slug = 'guitares-electriques';
    SELECT id INTO brand_fender FROM brands WHERE slug = 'fender';
    SELECT id INTO brand_gibson FROM brands WHERE slug = 'gibson';
    SELECT id INTO brand_ibanez FROM brands WHERE slug = 'ibanez';
    SELECT id INTO brand_prs FROM brands WHERE slug = 'prs';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Fender
    ('Fender Player Stratocaster HSS', 'fender-player-strat-hss', 'Stratocaster Player Series avec configuration HSS pour plus de polyvalence', 'Stratocaster HSS mexicaine', 949.00, 8, 'FEND-STRAT-HSS-3TS', cat_guitares_elec, brand_fender, 'Player Stratocaster HSS', '3-Color Sunburst', '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "Player Series Alnico 5 + Humbucker", "vibrato": "2-Point Synchronized"}', true, true),
    
    ('Fender American Professional II Telecaster', 'fender-am-pro-ii-tele', 'Telecaster haut de gamme américaine avec micros V-Mod II', 'Telecaster américaine Pro II', 1899.00, 3, 'FEND-TELE-AMPRO2-MN', cat_guitares_elec, brand_fender, 'American Professional II', 'Miami Blue', '{"corps": "Aulne", "manche": "Érable", "touche": "Érable", "micros": "V-Mod II Single-Coil", "chevalet": "6-Saddle String-Through-Body"}', true, true),
    
    -- Gibson
    ('Gibson Les Paul Standard 60s', 'gibson-lp-std-60s', 'Les Paul Standard avec profil de manche années 60 et micros Burstbucker Pro', 'Les Paul Standard profil 60s', 2699.00, 4, 'GIBS-LP-STD60-UB', cat_guitares_elec, brand_gibson, 'Les Paul Standard 60s', 'Unburst', '{"corps": "Acajou + Table Érable", "manche": "Acajou Profil 60s", "touche": "Palissandre", "micros": "Burstbucker Pro", "chevalet": "Tune-O-Matic + Stopbar"}', true, true),
    
    ('Gibson SG Standard', 'gibson-sg-standard', 'SG Standard avec le son Gibson emblématique et accès facilité aux aigus', 'SG Standard classique', 1899.00, 5, 'GIBS-SG-STD-CR', cat_guitares_elec, brand_gibson, 'SG Standard', 'Cherry Red', '{"corps": "Acajou", "manche": "Acajou", "touche": "Palissandre", "micros": "490R/498T Humbuckers", "chevalet": "Tune-O-Matic"}', true, false),
    
    -- Ibanez
    ('Ibanez RG550', 'ibanez-rg550', 'Guitare rock/metal avec chevalet Floyd Rose et micros humbuckers', 'RG Series pour rock/metal', 899.00, 6, 'IBAN-RG550-RF', cat_guitares_elec, brand_ibanez, 'RG550', 'Road Flare Red', '{"corps": "Basswood", "manche": "Érable/Bubinga", "touche": "Érable", "micros": "Quantum Humbuckers", "chevalet": "Edge Tremolo"}', true, false),
    
    -- PRS
    ('PRS SE Custom 24', 'prs-se-custom-24', 'PRS SE avec table érable flammé et micros 85/15 S', 'PRS SE haut de gamme', 1299.00, 3, 'PRS-SE-C24-VS', cat_guitares_elec, brand_prs, 'SE Custom 24', 'Vintage Sunburst', '{"corps": "Acajou + Table Érable", "manche": "Acajou", "touche": "Palissandre", "micros": "85/15 S Humbuckers", "chevalet": "PRS Tremolo"}', true, true);
END $$;

-- =================================
-- PRODUITS GUITARES ACOUSTIQUES
-- =================================
DO $$
DECLARE
    cat_guitares_ac UUID;
    brand_martin UUID;
    brand_taylor UUID;
    brand_yamaha UUID;
BEGIN
    SELECT id INTO cat_guitares_ac FROM categories WHERE slug = 'guitares-acoustiques';
    SELECT id INTO brand_martin FROM brands WHERE slug = 'martin';
    SELECT id INTO brand_taylor FROM brands WHERE slug = 'taylor';
    SELECT id INTO brand_yamaha FROM brands WHERE slug = 'yamaha';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Martin
    ('Martin D-28', 'martin-d28', 'Dreadnought légendaire avec table épicéa Sitka et fond palissandre', 'Dreadnought Martin iconique', 3299.00, 2, 'MART-D28-NAT', cat_guitares_ac, brand_martin, 'D-28', 'Natural', '{"forme": "Dreadnought", "table": "Épicéa Sitka massif", "fond_eclisses": "Palissandre Est-Indien", "manche": "Acajou sélectionné", "touche": "Ébène"}', true, true),
    
    ('Martin 000-28', 'martin-000-28', 'Auditorium Martin avec un son équilibré et une jouabilité exceptionnelle', 'Auditorium Martin premium', 3599.00, 1, 'MART-000-28-NAT', cat_guitares_ac, brand_martin, '000-28', 'Natural', '{"forme": "Auditorium", "table": "Épicéa Sitka massif", "fond_eclisses": "Palissandre Est-Indien", "manche": "Acajou sélectionné", "touche": "Ébène"}', true, true),
    
    -- Taylor
    ('Taylor 814ce', 'taylor-814ce', 'Grand Auditorium avec table épicéa et fond palissandre, électronique ES2', 'Taylor Grand Auditorium électro', 3999.00, 2, 'TAYL-814CE-NAT', cat_guitares_ac, brand_taylor, '814ce', 'Natural', '{"forme": "Grand Auditorium", "table": "Épicéa Sitka massif", "fond_eclisses": "Palissandre Indien", "electronique": "ES2", "chevalet": "Ébène"}', true, true),
    
    ('Taylor Big Baby BBT', 'taylor-big-baby-bbt', 'Dreadnought abordable avec le son Taylor signature', 'Dreadnought Taylor entrée de gamme', 599.00, 8, 'TAYL-BBT-NAT', cat_guitares_ac, brand_taylor, 'Big Baby BBT', 'Natural', '{"forme": "Dreadnought", "table": "Épicéa Sitka massif", "fond_eclisses": "Sapele stratifié", "manche": "Sapele", "touche": "Ébène"}', true, false),
    
    -- Yamaha
    ('Yamaha FG830', 'yamaha-fg830', 'Dreadnought avec table épicéa massif, excellent rapport qualité-prix', 'Dreadnought Yamaha populaire', 299.00, 12, 'YAMA-FG830-NT', cat_guitares_ac, brand_yamaha, 'FG830', 'Natural', '{"forme": "Western", "table": "Épicéa massif", "fond_eclisses": "Palissandre", "manche": "Nato", "touche": "Palissandre"}', true, true),
    
    ('Yamaha LL6 ARE', 'yamaha-ll6-are', 'Jumbo avec traitement A.R.E. pour un son vintage naturel', 'Jumbo Yamaha haut de gamme', 899.00, 4, 'YAMA-LL6-NT', cat_guitares_ac, brand_yamaha, 'LL6 ARE', 'Natural', '{"forme": "Jumbo", "table": "Épicéa Engelmann massif A.R.E.", "fond_eclisses": "Palissandre massif", "manche": "Acajou", "touche": "Ébène"}', true, false);
END $$;

-- =================================
-- PRODUITS BASSES ÉLECTRIQUES
-- =================================
DO $$
DECLARE
    cat_basses_elec UUID;
    brand_fender UUID;
    brand_gibson UUID;
BEGIN
    SELECT id INTO cat_basses_elec FROM categories WHERE slug = 'basses-electriques';
    SELECT id INTO brand_fender FROM brands WHERE slug = 'fender';
    SELECT id INTO brand_gibson FROM brands WHERE slug = 'gibson';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Fender
    ('Fender Player Precision Bass', 'fender-player-pbass', 'P-Bass mexicaine avec le son Precision classique', 'Precision Bass Player Series', 849.00, 7, 'FEND-PBASS-PLAY-3TS', cat_basses_elec, brand_fender, 'Player Precision Bass', '3-Color Sunburst', '{"cordes": "4", "diapason": "34 pouces", "micros": "Split Single-Coil", "manche": "Érable", "touche": "Pau Ferro"}', true, true),
    
    ('Fender Player Jazz Bass', 'fender-player-jbass', 'Jazz Bass avec le son clair et défini légendaire', 'Jazz Bass Player Series', 899.00, 5, 'FEND-JBASS-PLAY-PF', cat_basses_elec, brand_fender, 'Player Jazz Bass', 'Polar White', '{"cordes": "4", "diapason": "34 pouces", "micros": "2x Single-Coil", "manche": "Érable", "touche": "Pau Ferro"}', true, true),
    
    ('Fender American Professional II Jazz Bass V', 'fender-am-pro-ii-jbass-v', 'Jazz Bass 5 cordes américaine haut de gamme', 'Jazz Bass 5 cordes Pro II', 2199.00, 2, 'FEND-JBASS-V-AMPRO2', cat_basses_elec, brand_fender, 'American Professional II Jazz Bass V', 'Olympic White', '{"cordes": "5", "diapason": "34 pouces", "micros": "V-Mod II Jazz Bass", "manche": "Érable", "touche": "Palissandre"}', true, false);
END $$;

-- =================================
-- PRODUITS PIANOS & CLAVIERS
-- =================================
DO $$
DECLARE
    cat_pianos UUID;
    cat_synths UUID;
    brand_roland UUID;
    brand_yamaha UUID;
    brand_korg UUID;
BEGIN
    SELECT id INTO cat_pianos FROM categories WHERE slug = 'pianos-numeriques';
    SELECT id INTO cat_synths FROM categories WHERE slug = 'synthetiseurs';
    SELECT id INTO brand_roland FROM brands WHERE slug = 'roland';
    SELECT id INTO brand_yamaha FROM brands WHERE slug = 'yamaha';
    SELECT id INTO brand_korg FROM brands WHERE slug = 'korg';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Pianos Numériques
    ('Roland FP-30X', 'roland-fp30x', 'Piano numérique portable 88 touches avec sons SuperNATURAL', 'Piano portable Roland', 699.00, 6, 'ROL-FP30X-BK', cat_pianos, brand_roland, 'FP-30X', 'Noir', '{"touches": "88 touches pondérées", "sons": "SuperNATURAL Piano", "polyphonie": "256 voix", "connectivite": "Bluetooth MIDI/Audio"}', true, true),
    
    ('Yamaha P-145', 'yamaha-p145', 'Piano numérique 88 touches avec action GHS et sons CFX', 'Piano Yamaha compact', 549.00, 8, 'YAMA-P145-B', cat_pianos, brand_yamaha, 'P-145', 'Noir', '{"touches": "88 touches GHS", "sons": "10 sons incluant CFX", "polyphonie": "192 voix", "dimensions": "Compact et léger"}', true, true),
    
    ('Roland RD-2000', 'roland-rd2000', 'Piano de scène professionnel avec sons acoustiques et électriques', 'Piano de scène Roland haut de gamme', 2699.00, 2, 'ROL-RD2000', cat_pianos, brand_roland, 'RD-2000', 'Noir', '{"touches": "88 touches Hybrid Grand", "sons": "SuperNATURAL + ZEN-Core", "polyphonie": "Illimitée", "stockage": "Expansion possible"}', true, true),
    
    -- Synthétiseurs
    ('Korg Minilogue XD', 'korg-minilogue-xd', 'Synthétiseur analogique polyphonique avec moteur digital', 'Synthé analogique Korg', 649.00, 4, 'KORG-MNLG-XD', cat_synths, brand_korg, 'Minilogue XD', 'Noir', '{"voix": "4 voix", "oscillateurs": "2 VCO + Digital", "filtre": "Analogique 2-pôles", "effets": "Reverb, Delay, Modulation"}', true, true),
    
    ('Roland JUNO-X', 'roland-juno-x', 'Synthétiseur moderne basé sur l''héritage JUNO avec moteur ZEN-Core', 'Synthé Roland JUNO moderne', 1999.00, 3, 'ROL-JUNO-X', cat_synths, brand_roland, 'JUNO-X', 'Blanc', '{"moteur": "ZEN-Core + Analog Circuit Behavior", "polyphonie": "256 voix", "preset": "4000+ sons", "interface": "Contrôles dédiés"}', true, true);
END $$;

-- =================================
-- PRODUITS AMPLIFICATION
-- =================================
DO $$
DECLARE
    cat_amplis_guitare UUID;
    cat_amplis_basse UUID;
    brand_marshall UUID;
    brand_orange UUID;
    brand_mesa UUID;
BEGIN
    SELECT id INTO cat_amplis_guitare FROM categories WHERE slug = 'amplis-guitare';
    SELECT id INTO cat_amplis_basse FROM categories WHERE slug = 'amplis-basse';
    SELECT id INTO brand_marshall FROM brands WHERE slug = 'marshall';
    SELECT id INTO brand_orange FROM brands WHERE slug = 'orange';
    SELECT id INTO brand_mesa FROM brands WHERE slug = 'mesa-boogie';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Amplis Guitare
    ('Marshall DSL40CR', 'marshall-dsl40cr', 'Combo 40W 2 canaux avec reverb numérique', 'Combo Marshall polyvalent', 749.00, 8, 'MARS-DSL40CR', cat_amplis_guitare, brand_marshall, 'DSL40CR', 'Noir', '{"puissance": "40W", "haut_parleur": "Celestion V-Type 12\"", "lampes": "ECC83, EL34", "canaux": "2", "reverb": "Numérique"}', true, true),
    
    ('Marshall JCM800 2203', 'marshall-jcm800-2203', 'Tête légendaire 100W pour rock et metal', 'Tête Marshall iconique', 1899.00, 3, 'MARS-JCM800-2203', cat_amplis_guitare, brand_marshall, 'JCM800 2203', 'Noir', '{"puissance": "100W", "lampes": "ECC83, EL34", "canaux": "1", "caracteristiques": "Son rock légendaire"}', true, true),
    
    ('Orange Rocker 30', 'orange-rocker-30', 'Combo 30W à lampes avec le son Orange caractéristique', 'Combo Orange vintage', 1299.00, 4, 'ORAN-ROCK30-OR', cat_amplis_guitare, brand_orange, 'Rocker 30', 'Orange', '{"puissance": "30W", "haut_parleur": "Celestion Vintage 30", "lampes": "EL84", "canaux": "2", "caracteristiques": "Son British vintage"}', true, false),
    
    ('Mesa Boogie Mark V:25', 'mesa-mark-v25', 'Tête 25W avec 3 canaux et technologie Mesa', 'Tête Mesa Boogie compacte', 1699.00, 2, 'MESA-MKV25', cat_amplis_guitare, brand_mesa, 'Mark V:25', 'Noir', '{"puissance": "25W", "lampes": "6L6", "canaux": "3", "caracteristiques": "Son Mesa légendaire"}', true, false),
    
    -- Amplis Basse
    ('Orange Terror Bass 500', 'orange-terror-bass-500', 'Tête de basse 500W avec le caractère Orange', 'Tête basse Orange', 699.00, 5, 'ORAN-TB500', cat_amplis_basse, brand_orange, 'Terror Bass 500', 'Orange', '{"puissance": "500W", "preampli": "Hybrid", "eq": "4 bandes", "sortie": "DI XLR"}', true, true);
END $$;

-- =================================
-- PRODUITS MICROPHONES
-- =================================
DO $$
DECLARE
    cat_micros UUID;
    brand_shure UUID;
    brand_audio_technica UUID;
BEGIN
    SELECT id INTO cat_micros FROM categories WHERE slug = 'microphones';
    SELECT id INTO brand_shure FROM brands WHERE slug = 'shure';
    SELECT id INTO brand_audio_technica FROM brands WHERE slug = 'audio-technica';

    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Shure
    ('Shure SM58', 'shure-sm58', 'Microphone dynamique légendaire pour le chant live', 'Micro chant dynamique de référence', 119.00, 20, 'SHUR-SM58-LC', cat_micros, brand_shure, 'SM58', 'Noir', '{"type": "Dynamique", "directivite": "Cardioïde", "reponse": "50Hz-15kHz", "application": "Chant live"}', true, true),
    
    ('Shure SM57', 'shure-sm57', 'Microphone dynamique polyvalent pour instruments et voix', 'Micro universel Shure', 109.00, 15, 'SHUR-SM57-LC', cat_micros, brand_shure, 'SM57', 'Noir', '{"type": "Dynamique", "directivite": "Cardioïde", "reponse": "40Hz-15kHz", "application": "Instruments/Voix"}', true, true),
    
    ('Shure Beta 58A', 'shure-beta-58a', 'Version améliorée du SM58 avec plus de présence', 'Micro chant Beta Shure', 179.00, 12, 'SHUR-BETA58A', cat_micros, brand_shure, 'Beta 58A', 'Noir', '{"type": "Dynamique", "directivite": "Supercardioïde", "reponse": "50Hz-16kHz", "application": "Chant professionnel"}', true, false),
    
    -- Audio-Technica
    ('Audio-Technica AT2020', 'audio-technica-at2020', 'Microphone à condensateur pour studio d''enregistrement', 'Micro studio condensateur', 99.00, 18, 'AT-AT2020', cat_micros, brand_audio_technica, 'AT2020', 'Noir', '{"type": "Condensateur", "directivite": "Cardioïde", "reponse": "20Hz-20kHz", "application": "Studio"}', true, true),
    
    ('Audio-Technica AT4040', 'audio-technica-at4040', 'Microphone à condensateur haut de gamme avec capsule large', 'Micro studio premium AT', 349.00, 8, 'AT-AT4040', cat_micros, brand_audio_technica, 'AT4040', 'Noir', '{"type": "Condensateur large membrane", "directivite": "Cardioïde", "reponse": "20Hz-20kHz", "pad": "-10dB", "filtre": "Coupe-bas 80Hz"}', true, false);
END $$;

-- Message de confirmation final
SELECT 'Catalogue de produits créé avec succès!' AS status,
       (SELECT COUNT(*) FROM products) AS total_produits,
       (SELECT COUNT(*) FROM products WHERE is_featured = true) AS produits_vedettes;
