-- Script d'enrichissement du catalogue Soundora
-- À exécuter APRÈS test_data.sql pour ajouter plus de produits

-- =================================
-- AJOUT DE NOUVELLES MARQUES
-- =================================
INSERT INTO brands (name, slug, description) VALUES
('PRS', 'prs', 'Paul Reed Smith Guitars, guitares haut de gamme américaines'),
('ESP', 'esp', 'Guitares électriques japonaises pour le rock et le metal'),
('Squier', 'squier', 'Marque affiliée Fender pour guitares abordables'),
('Epiphone', 'epiphone', 'Marque affiliée Gibson pour guitares accessibles'),
('Orange', 'orange', 'Amplificateurs britanniques au son distinctif'),
('Vox', 'vox', 'Amplificateurs britanniques vintage'),
('Ampeg', 'ampeg', 'Amplificateurs de basse légendaires'),
('Korg', 'korg', 'Synthétiseurs et instruments électroniques'),
('Tama', 'tama', 'Batteries et hardware de percussion'),
('Pearl', 'pearl', 'Batteries et équipements de percussion'),
('Zildjian', 'zildjian', 'Cymbales et accessoires de batterie'),
('Audio-Technica', 'audio-technica', 'Microphones et équipements audio'),
('Focusrite', 'focusrite', 'Interfaces audio et préamplis'),
('TC Electronic', 'tc-electronic', 'Effets et processeurs audio'),
('Electro-Harmonix', 'electro-harmonix', 'Pédales d effets créatives'),
('MXR', 'mxr', 'Pédales d effets compactes');

-- =================================
-- ENRICHISSEMENT GUITARES
-- =================================
DO $$
DECLARE
    guitares_id UUID;
    fender_id UUID;
    gibson_id UUID;
    prs_id UUID;
    esp_id UUID;
    squier_id UUID;
    epiphone_id UUID;
    ibanez_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO guitares_id FROM categories WHERE slug = 'guitares';
    SELECT id INTO fender_id FROM brands WHERE slug = 'fender';
    SELECT id INTO gibson_id FROM brands WHERE slug = 'gibson';
    SELECT id INTO prs_id FROM brands WHERE slug = 'prs';
    SELECT id INTO esp_id FROM brands WHERE slug = 'esp';
    SELECT id INTO squier_id FROM brands WHERE slug = 'squier';
    SELECT id INTO epiphone_id FROM brands WHERE slug = 'epiphone';
    SELECT id INTO ibanez_id FROM brands WHERE slug = 'ibanez';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    -- Guitares Fender premium
    ('Fender American Professional II Stratocaster', 'fender-american-pro-2-strat-white', 
     'Stratocaster haut de gamme avec micros V-Mod II et innovations modernes', 
     'Stratocaster américaine professionnelle', 1699.00, 1899.00, 2, 'FEND-AMPRO2-STRAT-WH',
     guitares_id, fender_id, 'American Professional II Stratocaster', 'Olympic White',
     '["https://fender.com/american-pro-2-strat-1.jpg"]',
     '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "V-Mod II Single-Coil"}', true),
     
    ('Fender Player Jazzmaster', 'fender-player-jazzmaster-surf-green',
     'Jazzmaster moderne avec caractère vintage et améliorations Player Series',
     'Guitare électrique Jazzmaster alternative', 999.00, null, 3, 'FEND-PLY-JAZZ-SG',
     guitares_id, fender_id, 'Player Jazzmaster', 'Surf Green',
     '["https://fender.com/player-jazzmaster-1.jpg"]',
     '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "Player Series Alnico 5"}', false),
     
    -- Guitares Gibson supplémentaires  
    ('Gibson SG Standard 61', 'gibson-sg-standard-61-cherry',
     'SG légendaire avec profil de manche 61 et micros 490R/498T',
     'Guitare électrique SG avec sustain mythique', 1999.00, null, 2, 'GIBS-SG-STD61-CH',
     guitares_id, gibson_id, 'SG Standard 61', 'Cherry',
     '["https://gibson.com/sg-standard-61-1.jpg"]',
     '{"corps": "Acajou", "manche": "Acajou", "touche": "Palissandre", "micros": "490R/498T"}', true),
     
    ('Gibson Explorer Studio', 'gibson-explorer-studio-ebony',
     'Explorer iconique dans version Studio sans fioritures',
     'Guitare électrique Explorer pour le rock', 1599.00, 1799.00, 1, 'GIBS-EXP-STUD-EB',
     guitares_id, gibson_id, 'Explorer Studio', 'Ebony',
     '["https://gibson.com/explorer-studio-1.jpg"]',
     '{"corps": "Acajou", "manche": "Acajou", "touche": "Palissandre", "micros": "490R/498T"}', false),
     
    -- Guitares PRS
    ('PRS SE Custom 24', 'prs-se-custom-24-whale-blue',
     'Custom 24 série SE abordable avec qualité PRS authentique',
     'Guitare électrique PRS avec micros 85/15', 999.00, null, 2, 'PRS-SE-C24-WB',
     guitares_id, prs_id, 'SE Custom 24', 'Whale Blue',
     '["https://prsguitars.com/se-custom-24-1.jpg"]',
     '{"corps": "Acajou", "table": "Érable flammé", "manche": "Acajou", "micros": "85/15 S"}', true),
     
    -- Guitares ESP
    ('ESP LTD EC-1000', 'esp-ltd-ec-1000-black',
     'Single cut avec micros EMG et finition professionnelle',
     'Guitare électrique ESP pour metal', 1299.00, null, 1, 'ESP-LTD-EC1000-BK',
     guitares_id, esp_id, 'LTD EC-1000', 'Black',
     '["https://espguitars.com/ltd-ec-1000-1.jpg"]',
     '{"corps": "Acajou", "table": "Érable flammé", "manche": "3-pièces Acajou", "micros": "EMG 81/60"}', false),
     
    -- Guitares abordables Squier
    ('Squier Classic Vibe 70s Stratocaster', 'squier-cv-70s-strat-black',
     'Stratocaster vintage inspirée des modèles années 70',
     'Stratocaster abordable vintage', 399.00, 449.00, 5, 'SQR-CV70-STRAT-BK',
     guitares_id, squier_id, 'Classic Vibe 70s Stratocaster', 'Black',
     '["https://squier.com/cv-70s-strat-1.jpg"]',
     '{"corps": "Peuplier", "manche": "Érable", "touche": "Érable", "micros": "Fender Designed Alnico"}', false),
     
    -- Guitares Epiphone
    ('Epiphone Les Paul Standard 50s', 'epiphone-lp-standard-50s-gold-top',
     'Les Paul Standard abordable avec look et son vintage Gibson',
     'Les Paul Standard avec micros ProBucker', 599.00, null, 3, 'EPI-LP-STD50-GT',
     guitares_id, epiphone_id, 'Les Paul Standard 50s', 'Gold Top',
     '["https://epiphone.com/lp-standard-50s-1.jpg"]',
     '{"corps": "Acajou", "table": "Érable", "manche": "Acajou", "micros": "ProBucker-2/3"}', false),
     
    -- Guitares Ibanez
    ('Ibanez RG550', 'ibanez-rg550-purple-neon',
     'RG légendaire avec manche Wizard et vibrato Edge',
     'Guitare électrique pour shred et metal', 899.00, null, 2, 'IBZ-RG550-PN',
     guitares_id, ibanez_id, 'RG550', 'Purple Neon',
     '["https://ibanez.com/rg550-1.jpg"]',
     '{"corps": "Tilleul", "manche": "Érable/Bubinga", "touche": "Érable", "micros": "V7/S1/V8"}', true);
END $$;

-- =================================
-- ENRICHISSEMENT BASSES
-- =================================
DO $$
DECLARE
    basses_id UUID;
    fender_id UUID;
    squier_id UUID;
    yamaha_id UUID;
    ibanez_id UUID;
BEGIN
    SELECT id INTO basses_id FROM categories WHERE slug = 'basses';
    SELECT id INTO fender_id FROM brands WHERE slug = 'fender';
    SELECT id INTO squier_id FROM brands WHERE slug = 'squier';
    SELECT id INTO yamaha_id FROM brands WHERE slug = 'yamaha';
    SELECT id INTO ibanez_id FROM brands WHERE slug = 'ibanez';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Fender Player Precision Bass', 'fender-player-precision-bass-3ts',
     'Precision Bass iconique avec son profond qui a défini le standard',
     'Basse électrique 4 cordes Precision', 899.00, null, 3, 'FEND-PLY-PB-3TS',
     basses_id, fender_id, 'Player Precision Bass', '3-Color Sunburst',
     '["https://fender.com/player-pbass-1.jpg"]',
     '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "Split Single-Coil"}', true),
     
    ('Fender Player Jazz Bass', 'fender-player-jazz-bass-black',
     'Jazz Bass polyvalente avec deux micros pour palette sonore étendue',
     'Basse électrique 4 cordes Jazz Bass', 949.00, null, 2, 'FEND-PLY-JB-BK',
     basses_id, fender_id, 'Player Jazz Bass', 'Black',
     '["https://fender.com/player-jbass-1.jpg"]',
     '{"corps": "Aulne", "manche": "Érable", "touche": "Palissandre", "micros": "2x Single-Coil"}', true),
     
    ('Squier Classic Vibe 60s Jazz Bass', 'squier-cv-60s-jazz-bass-white',
     'Jazz Bass vintage inspirée des modèles années 60',
     'Basse 4 cordes abordable vintage', 449.00, 499.00, 4, 'SQR-CV60-JB-OW',
     basses_id, squier_id, 'Classic Vibe 60s Jazz Bass', 'Olympic White',
     '["https://squier.com/cv-60s-jbass-1.jpg"]',
     '{"corps": "Peuplier", "manche": "Érable", "touche": "Laurier", "micros": "Fender Designed"}', false),
     
    ('Yamaha TRBX304', 'yamaha-trbx304-red-metallic',
     'Basse 4 cordes moderne avec électronique active',
     'Basse électrique active polyvalente', 399.00, null, 4, 'YAM-TRBX304-RM',
     basses_id, yamaha_id, 'TRBX304', 'Red Metallic',
     '["https://yamaha.com/trbx304-1.jpg"]',
     '{"corps": "Acajou", "manche": "Érable", "touche": "Palissandre", "électronique": "Active"}', false),
     
    ('Ibanez SR500E', 'ibanez-sr500e-brown-mahogany',
     'Basse SR avec manche fin et électronique Bartolini',
     'Basse électrique moderne SR', 699.00, null, 2, 'IBZ-SR500E-BM',
     basses_id, ibanez_id, 'SR500E', 'Brown Mahogany',
     '["https://ibanez.com/sr500e-1.jpg"]',
     '{"corps": "Acajou", "manche": "5-pièces Jatoba/Bubinga", "micros": "Bartolini BH2"}', false);
END $$;

-- =================================
-- ENRICHISSEMENT AMPLIFICATEURS GUITARE
-- =================================
DO $$
DECLARE
    amplis_guitare_id UUID;
    marshall_id UUID;
    fender_id UUID;
    orange_id UUID;
    vox_id UUID;
BEGIN
    SELECT id INTO amplis_guitare_id FROM categories WHERE slug = 'amplis-guitare';
    SELECT id INTO marshall_id FROM brands WHERE slug = 'marshall';
    SELECT id INTO fender_id FROM brands WHERE slug = 'fender';
    SELECT id INTO orange_id FROM brands WHERE slug = 'orange';
    SELECT id INTO vox_id FROM brands WHERE slug = 'vox';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Marshall JCM800 2203 Head', 'marshall-jcm800-2203-head',
     'Tête d ampli légendaire 100W, référence du rock britannique',
     'Tête d ampli à lampes 100W mythique', 1899.00, null, 1, 'MARS-JCM800-HEAD',
     amplis_guitare_id, marshall_id, 'JCM800 2203', 'Black',
     '["https://marshall.com/jcm800-head-1.jpg"]',
     '{"puissance": "100W", "lampes": "ECC83, EL34", "canaux": "1", "controles": "Presence, Bass, Middle, Treble"}', true),
     
    ('Fender Blues Junior IV', 'fender-blues-junior-iv-black',
     'Combo à lampes 15W parfait pour studio et petites scènes',
     'Ampli combo 15W à lampes avec réverb', 599.00, null, 3, 'FEND-BJ4-BK',
     amplis_guitare_id, fender_id, 'Blues Junior IV', 'Black',
     '["https://fender.com/blues-junior-1.jpg"]',
     '{"puissance": "15W", "haut_parleur": "Celestion A-Type 12", "lampes": "EL84, 12AX7", "effets": "Réverb"}', true),
     
    ('Orange Rockerverb 50 MKIII Head', 'orange-rockerverb-50-mk3-head',
     'Tête d ampli Orange 50W avec son britannique distinctif',
     'Tête d ampli 50W avec caractère Orange', 1299.00, null, 1, 'ORG-RV50MK3-HEAD',
     amplis_guitare_id, orange_id, 'Rockerverb 50 MKIII', 'Orange',
     '["https://orangeamps.com/rockerverb-50-1.jpg"]',
     '{"puissance": "50W", "lampes": "ECC83, EL34", "canaux": "2", "reverb": "Accutronics"}', false),
     
    ('Vox AC30C2', 'vox-ac30c2-combo',
     'Combo légendaire 30W avec son britannique années 60',
     'Ampli combo 30W à lampes iconique', 1199.00, 1399.00, 1, 'VOX-AC30C2',
     amplis_guitare_id, vox_id, 'AC30C2', 'Black',
     '["https://voxamps.com/ac30c2-1.jpg"]',
     '{"puissance": "30W", "haut_parleur": "2x Celestion G12M", "lampes": "ECC83, EL84", "canaux": "2"}', true);
END $$;

-- =================================
-- AMPLIFICATEURS BASSE
-- =================================
DO $$
DECLARE
    amplis_basse_id UUID;
    ampeg_id UUID;
    fender_id UUID;
BEGIN
    SELECT id INTO amplis_basse_id FROM categories WHERE slug = 'amplis-basse';
    SELECT id INTO ampeg_id FROM brands WHERE slug = 'ampeg';
    SELECT id INTO fender_id FROM brands WHERE slug = 'fender';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Ampeg SVT-7 Pro Head', 'ampeg-svt-7-pro-head',
     'Tête de basse 1000W avec son SVT légendaire compact',
     'Tête de basse 1000W avec préamp lampe', 899.00, null, 2, 'AMP-SVT7PRO-HEAD',
     amplis_basse_id, ampeg_id, 'SVT-7 Pro', 'Black',
     '["https://ampeg.com/svt-7-pro-1.jpg"]',
     '{"puissance": "1000W", "preamp": "Lampe 12AX7", "eq": "9 bandes", "compresseur": "Intégré"}', true),
     
    ('Fender Rumble 500 Head', 'fender-rumble-500-head',
     'Tête de basse 500W légère avec son Fender classique',
     'Tête de basse 500W légère', 549.00, null, 2, 'FEND-RMB500-HEAD',
     amplis_basse_id, fender_id, 'Rumble 500', 'Black',
     '["https://fender.com/rumble-500-1.jpg"]',
     '{"puissance": "500W", "eq": "4 bandes", "overdrive": "Intégré", "poids": "2.9 kg"}', false);
END $$;

-- =================================
-- CLAVIERS & PIANOS
-- =================================
DO $$
DECLARE
    claviers_id UUID;
    yamaha_id UUID;
    roland_id UUID;
    korg_id UUID;
BEGIN
    SELECT id INTO claviers_id FROM categories WHERE slug = 'claviers-pianos';
    SELECT id INTO yamaha_id FROM brands WHERE slug = 'yamaha';
    SELECT id INTO roland_id FROM brands WHERE slug = 'roland';
    SELECT id INTO korg_id FROM brands WHERE slug = 'korg';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Yamaha P-125', 'yamaha-p125-black',
     'Piano numérique portable 88 touches avec mécanisme GHS',
     'Piano numérique 88 touches portable', 699.00, null, 3, 'YAM-P125-BK',
     claviers_id, yamaha_id, 'P-125', 'Black',
     '["https://yamaha.com/p125-1.jpg"]',
     '{"touches": "88 pondérées GHS", "sons": "24 voix", "polyphonie": "192 notes"}', true),
     
    ('Roland FP-30X', 'roland-fp-30x-black',
     'Piano numérique avec mécanisme PHA-4 et sons SuperNATURAL',
     'Piano numérique avec toucher authentique', 899.00, null, 2, 'ROL-FP30X-BK',
     claviers_id, roland_id, 'FP-30X', 'Black',
     '["https://roland.com/fp-30x-1.jpg"]',
     '{"touches": "88 PHA-4 Standard", "sons": "SuperNATURAL", "polyphonie": "256 notes"}', true),
     
    ('Korg Minilogue XD', 'korg-minilogue-xd',
     'Synthétiseur analogique polyphonique avec oscillateur numérique',
     'Synthé analogique 4 voix avec effets', 699.00, 799.00, 2, 'KRG-MNLGXD',
     claviers_id, korg_id, 'Minilogue XD', 'Dark Gray',
     '["https://korg.com/minilogue-xd-1.jpg"]',
     '{"voix": "4", "oscillateurs": "2 VCO + 1 Multi", "filtre": "2-pole", "effets": "Modulation, Reverb"}', true);
END $$;

-- =================================
-- BATTERIE & PERCUSSION
-- =================================
DO $$
DECLARE
    batterie_id UUID;
    tama_id UUID;
    pearl_id UUID;
    zildjian_id UUID;
BEGIN
    SELECT id INTO batterie_id FROM categories WHERE slug = 'batterie-percussion';
    SELECT id INTO tama_id FROM brands WHERE slug = 'tama';
    SELECT id INTO pearl_id FROM brands WHERE slug = 'pearl';
    SELECT id INTO zildjian_id FROM brands WHERE slug = 'zildjian';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Tama Imperialstar 5-Piece', 'tama-imperialstar-5-piece-black',
     'Kit de batterie 5 pièces parfait pour débuter avec qualité Tama',
     'Batterie acoustique 5 fûts avec cymbales', 699.00, null, 2, 'TAM-IMP5-HBK',
     batterie_id, tama_id, 'Imperialstar', 'Hairline Black',
     '["https://tama.com/imperialstar-1.jpg"]',
     '{"grosse_caisse": "22x16", "toms": "10x8, 12x9", "tom_basse": "16x16", "caisse_claire": "14x5.5"}', true),
     
    ('Pearl Export EXX 5-Piece', 'pearl-export-exx-5-piece-jet-black',
     'Batterie Export légendaire avec fûts en peuplier',
     'Batterie 5 fûts avec hardware inclus', 799.00, 899.00, 1, 'PRL-EXX5-JB',
     batterie_id, pearl_id, 'Export EXX', 'Jet Black',
     '["https://pearl.com/export-exx-1.jpg"]',
     '{"grosse_caisse": "22x18", "toms": "10x7, 12x8", "tom_basse": "16x16", "caisse_claire": "14x5.5"}', true),
     
    ('Zildjian A Custom Cymbal Set', 'zildjian-a-custom-cymbal-set',
     'Set de cymbales A Custom avec Hi-Hat 14, Crash 16/18, Ride 20',
     'Set de cymbales brillantes polyvalentes', 899.00, null, 1, 'ZIL-ACUST-SET',
     batterie_id, zildjian_id, 'A Custom Set', 'Brilliant',
     '["https://zildjian.com/a-custom-set-1.jpg"]',
     '{"hi_hat": "14 A Custom", "crash_1": "16 A Custom", "crash_2": "18 A Custom", "ride": "20 A Custom"}', false);
END $$;

-- =================================
-- SOUS-CATÉGORIES POUR EFFETS & PROCESSING
-- =================================
DO $$
DECLARE
    effets_id UUID;
BEGIN
    SELECT id INTO effets_id FROM categories WHERE slug = 'effets-processing';
    
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Pédales d''Effets', 'pedales-effets', 'Pédales de distorsion, modulation, delay, reverb', effets_id, 1),
    ('Processeurs Audio', 'processeurs-audio', 'Processeurs multi-effets et rack', effets_id, 2);
END $$;

-- =================================
-- PÉDALES D'EFFETS
-- =================================
DO $$
DECLARE
    pedales_id UUID;
    boss_id UUID;
    tc_electronic_id UUID;
    electro_harmonix_id UUID;
    mxr_id UUID;
BEGIN
    SELECT id INTO pedales_id FROM categories WHERE slug = 'pedales-effets';
    SELECT id INTO boss_id FROM brands WHERE slug = 'boss';
    SELECT id INTO tc_electronic_id FROM brands WHERE slug = 'tc-electronic';
    SELECT id INTO electro_harmonix_id FROM brands WHERE slug = 'electro-harmonix';
    SELECT id INTO mxr_id FROM brands WHERE slug = 'mxr';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    ('Boss DS-1 Distortion', 'boss-ds-1-distortion-orange',
     'Pédale de distorsion la plus vendue au monde, son rock classique',
     'Pédale de distorsion classique Boss', 59.00, null, 6, 'BSS-DS1-OR',
     pedales_id, boss_id, 'DS-1', 'Orange',
     '["https://boss.info/ds-1-1.jpg"]',
     '{"type": "Distorsion", "controles": "Level, Tone, Dist", "alimentation": "9V"}', true),
     
    ('TC Electronic Hall of Fame 2', 'tc-electronic-hall-of-fame-2',
     'Pédale de reverb avec algorithmes TonePrint et réverbs légendaires',
     'Pédale de reverb avec TonePrint', 149.00, 179.00, 4, 'TC-HOF2',
     pedales_id, tc_electronic_id, 'Hall of Fame 2', 'White',
     '["https://tcelectronic.com/hof2-1.jpg"]',
     '{"type": "Reverb", "algorithmes": "10 types", "toneprint": "Oui", "mash": "Oui"}', false),
     
    ('Electro-Harmonix Big Muff Pi', 'ehx-big-muff-pi-nyc',
     'Fuzz légendaire utilisé par Hendrix, Gilmour et bien d autres',
     'Pédale de fuzz vintage mythique', 89.00, null, 4, 'EHX-BMUFF-NYC',
     pedales_id, electro_harmonix_id, 'Big Muff Pi', 'Silver',
     '["https://ehx.com/big-muff-1.jpg"]',
     '{"type": "Fuzz", "controles": "Volume, Tone, Sustain", "vintage_reissue": "Oui"}', false),
     
    ('MXR Phase 90', 'mxr-phase-90-orange',
     'Phaser classique utilisé par Van Halen, symbole du son années 70',
     'Pédale de phaser vintage iconique', 99.00, null, 3, 'MXR-PH90-OR',
     pedales_id, mxr_id, 'Phase 90', 'Orange',
     '["https://mxr.com/phase-90-1.jpg"]',
     '{"type": "Phaser", "controles": "Speed", "vintage": "Script Logo"}', false);
END $$;

-- =================================
-- SOUS-CATÉGORIES POUR STUDIO & ENREGISTREMENT
-- =================================
DO $$
DECLARE
    studio_id UUID;
BEGIN
    SELECT id INTO studio_id FROM categories WHERE slug = 'studio-enregistrement';
    
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Interfaces Audio', 'interfaces-audio', 'Cartes son et interfaces d enregistrement', studio_id, 1),
    ('Microphones', 'microphones', 'Micros de studio et de scène', studio_id, 2),
    ('Moniteurs', 'moniteurs', 'Enceintes de monitoring et casques', studio_id, 3);
END $$;

-- =================================
-- INTERFACES AUDIO & MICROPHONES
-- =================================
DO $$
DECLARE
    interfaces_id UUID;
    microphones_id UUID;
    focusrite_id UUID;
    shure_id UUID;
    audio_technica_id UUID;
BEGIN
    SELECT id INTO interfaces_id FROM categories WHERE slug = 'interfaces-audio';
    SELECT id INTO microphones_id FROM categories WHERE slug = 'microphones';
    SELECT id INTO focusrite_id FROM brands WHERE slug = 'focusrite';
    SELECT id INTO shure_id FROM brands WHERE slug = 'shure';
    SELECT id INTO audio_technica_id FROM brands WHERE slug = 'audio-technica';
    
    INSERT INTO products (
        name, slug, description, short_description, price, compare_price, stock, sku,
        category_id, brand_id, model, color, images, specifications, is_featured
    ) VALUES
    -- Interfaces Audio
    ('Focusrite Scarlett 2i2 3rd Gen', 'focusrite-scarlett-2i2-3rd-gen',
     'Interface audio USB 2 entrées/2 sorties avec préamplis Scarlett',
     'Interface audio USB pour home studio', 169.00, null, 4, 'FOC-SC2I2-3G',
     interfaces_id, focusrite_id, 'Scarlett 2i2 3rd Gen', 'Red',
     '["https://focusrite.com/scarlett-2i2-1.jpg"]',
     '{"entrees": "2x XLR-Jack combo", "sorties": "2x Jack 6.35mm", "resolution": "24-bit/192kHz"}', true),
     
    -- Microphones
    ('Shure SM57', 'shure-sm57-dynamic-mic',
     'Microphone dynamique légendaire, standard pour amplis et caisse claire',
     'Micro dynamique pour instruments', 119.00, null, 5, 'SHR-SM57',
     microphones_id, shure_id, 'SM57', 'Black',
     '["https://shure.com/sm57-1.jpg"]',
     '{"type": "Dynamique", "directivite": "Cardioïde", "reponse": "40Hz-15kHz"}', true),
     
    ('Shure SM58', 'shure-sm58-vocal-mic',
     'Microphone vocal dynamique le plus utilisé au monde',
     'Micro dynamique vocal de référence', 119.00, null, 4, 'SHR-SM58',
     microphones_id, shure_id, 'SM58', 'Black',
     '["https://shure.com/sm58-1.jpg"]',
     '{"type": "Dynamique", "directivite": "Cardioïde", "reponse": "50Hz-15kHz"}', true),
     
    ('Audio-Technica AT2020', 'audio-technica-at2020-condenser',
     'Microphone à condensateur cardioïde pour studio et home studio',
     'Micro à condensateur pour enregistrement', 99.00, null, 3, 'AT-AT2020',
     microphones_id, audio_technica_id, 'AT2020', 'Black',
     '["https://audio-technica.com/at2020-1.jpg"]',
     '{"type": "Condensateur", "directivite": "Cardioïde", "reponse": "20Hz-20kHz", "phantom": "48V"}', true);
END $$;

-- =================================
-- MISE À JOUR DES PRODUITS FEATURED
-- =================================
-- Retirer le statut featured des anciens produits et l'attribuer à une sélection variée
UPDATE products SET is_featured = false;

UPDATE products SET is_featured = true 
WHERE slug IN (
    -- Guitares premium
    'fender-american-pro-2-strat-white',
    'gibson-sg-standard-61-cherry', 
    'prs-se-custom-24-whale-blue',
    'ibanez-rg550-purple-neon',
    
    -- Basses
    'fender-player-precision-bass-3ts',
    'fender-player-jazz-bass-black',
    
    -- Amplis
    'marshall-jcm800-2203-head',
    'fender-blues-junior-iv-black',
    'vox-ac30c2-combo',
    'ampeg-svt-7-pro-head',
    
    -- Claviers
    'yamaha-p125-black',
    'roland-fp-30x-black',
    'korg-minilogue-xd',
    
    -- Batterie
    'tama-imperialstar-5-piece-black',
    'pearl-export-exx-5-piece-jet-black',
    
    -- Effets
    'boss-ds-1-distortion-orange',
    
    -- Studio
    'focusrite-scarlett-2i2-3rd-gen',
    'shure-sm57-dynamic-mic',
    'shure-sm58-vocal-mic',
    'audio-technica-at2020-condenser'
);

SELECT 'Catalogue enrichi avec succès !' as message,
       COUNT(*) as total_produits
FROM products;
