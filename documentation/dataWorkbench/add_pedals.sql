-- Script pour ajouter les pédales d'effets manquantes
-- À exécuter dans Supabase après complete_products.sql

-- =================================
-- PRODUITS PÉDALES D'EFFETS
-- =================================
DO $$
DECLARE
    cat_pedales UUID;
    brand_boss UUID;
    brand_electro_harmonix UUID;
    brand_mxr UUID;
    brand_tc_electronic UUID;
BEGIN
    -- Récupération des IDs catégorie et marques
    SELECT id INTO cat_pedales FROM categories WHERE slug = 'pedales-effets';
    SELECT id INTO brand_boss FROM brands WHERE slug = 'boss';
    SELECT id INTO brand_electro_harmonix FROM brands WHERE slug = 'electro-harmonix';
    SELECT id INTO brand_mxr FROM brands WHERE slug = 'mxr';
    SELECT id INTO brand_tc_electronic FROM brands WHERE slug = 'tc-electronic';

    -- Si la catégorie n'existe pas, la créer
    IF cat_pedales IS NULL THEN
        INSERT INTO categories (name, slug, description, is_active)
        VALUES ('Pédales d''effets', 'pedales-effets', 'Pédales d''effets pour guitare et basse', true)
        RETURNING id INTO cat_pedales;
        RAISE NOTICE 'Catégorie "Pédales d''effets" créée';
    END IF;

    -- Si les marques n'existent pas, les créer
    IF brand_boss IS NULL THEN
        INSERT INTO brands (name, slug, description, is_active)
        VALUES ('Boss', 'boss', 'Pédales d''effets professionnelles', true)
        RETURNING id INTO brand_boss;
        RAISE NOTICE 'Marque "Boss" créée';
    END IF;

    IF brand_electro_harmonix IS NULL THEN
        INSERT INTO brands (name, slug, description, is_active)
        VALUES ('Electro-Harmonix', 'electro-harmonix', 'Pédales d''effets vintage et modernes', true)
        RETURNING id INTO brand_electro_harmonix;
        RAISE NOTICE 'Marque "Electro-Harmonix" créée';
    END IF;

    IF brand_mxr IS NULL THEN
        INSERT INTO brands (name, slug, description, is_active)
        VALUES ('MXR', 'mxr', 'Pédales d''effets professionnelles', true)
        RETURNING id INTO brand_mxr;
        RAISE NOTICE 'Marque "MXR" créée';
    END IF;

    IF brand_tc_electronic IS NULL THEN
        INSERT INTO brands (name, slug, description, is_active)
        VALUES ('TC Electronic', 'tc-electronic', 'Effets numériques de qualité studio', true)
        RETURNING id INTO brand_tc_electronic;
        RAISE NOTICE 'Marque "TC Electronic" créée';
    END IF;

    -- Insertion des pédales d'effets
    INSERT INTO products (name, slug, description, short_description, price, stock, sku, category_id, brand_id, model, color, specifications, is_active, is_featured) VALUES
    
    -- Boss DS-1 Distortion
    ('Boss DS-1 Distortion', 'boss-ds1-distortion', 'Pédale de distorsion légendaire utilisée par des millions de guitaristes dans le monde. Son agressif et polyvalent, parfait pour le rock et le metal.', 'Distorsion Boss classique', 49.00, 25, 'BOSS-DS1', cat_pedales, brand_boss, 'DS-1', 'Orange', '{"type": "Distorsion", "controles": "Level, Tone, Distortion", "true_bypass": "Non (buffered)", "alimentation": "9V"}', true, true),
    
    -- Electro-Harmonix Big Muff Pi
    ('Electro-Harmonix Big Muff Pi', 'electro-harmonix-big-muff-pi', 'Fuzz/Distorsion légendaire avec un sustain infini et un son épais. Utilisée par Hendrix, Gilmour, Smashing Pumpkins et bien d''autres.', 'Fuzz/Distorsion vintage EHX', 89.00, 15, 'EHX-BIGMUFF', cat_pedales, brand_electro_harmonix, 'Big Muff Pi', 'Argent', '{"type": "Fuzz/Distorsion", "controles": "Volume, Tone, Sustain", "true_bypass": "Oui", "alimentation": "9V"}', true, true),
    
    -- MXR Phase 90
    ('MXR Phase 90', 'mxr-phase-90', 'Pédale de phaser classique qui a défini le son du phasing depuis les années 70. Utilisée par Eddie Van Halen, Jimmy Page et bien d''autres.', 'Phaser MXR iconique', 129.00, 12, 'MXR-PHASE90', cat_pedales, brand_mxr, 'Phase 90', 'Orange', '{"type": "Phaser", "controles": "Speed, Script switch", "true_bypass": "Oui", "alimentation": "9V"}', true, false),
    
    -- TC Electronic Hall of Fame 2
    ('TC Electronic Hall of Fame 2', 'tc-electronic-hall-of-fame-2', 'Pédale de réverb professionnelle avec TonePrint et MASH. 10 types de réverb, qualité studio, sons personnalisables.', 'Réverb numérique TC Electronic', 149.00, 10, 'TC-HOF2', cat_pedales, brand_tc_electronic, 'Hall of Fame 2', 'Noir', '{"type": "Reverb", "controles": "Decay, Tone, Level, MASH", "presets": "TonePrint", "true_bypass": "Oui", "alimentation": "9V"}', true, true);

    RAISE NOTICE 'Pédales d''effets ajoutées avec succès!';
END $$;

-- Vérification
SELECT 
    'Pédales d''effets créées avec succès!' AS status,
    COUNT(*) AS nombre_pedales
FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'pedales-effets');
