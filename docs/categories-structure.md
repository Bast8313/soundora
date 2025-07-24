# Structure des catégories Soundora

## Hiérarchie proposée :

### 1. **INSTRUMENTS**
- **Guitares**
  - Électriques
  - Acoustiques
  - Classiques
  - Basses
- **Claviers & Pianos**
  - Pianos numériques
  - Synthétiseurs
  - Claviers maîtres
- **Batterie & Percussion**
  - Batteries acoustiques
  - Batteries électroniques
  - Cymbales
  - Percussions
- **Vents**
  - Saxophones
  - Trompettes
  - Clarinettes
- **Cordes**
  - Violons
  - Altos
  - Violoncelles

### 2. **AMPLIFICATION**
- **Amplis Guitare**
  - Amplis à lampes
  - Amplis à transistors
  - Combos
  - Têtes + Baffles
- **Amplis Basse**
- **Systèmes PA**
- **Moniteurs de studio**

### 3. **EFFETS & PROCESSING**
- **Pédales d'effets**
  - Distorsion/Overdrive
  - Modulation (Chorus, Flanger, etc.)
  - Délai/Reverb
  - Filtres (Wah, etc.)
- **Racks d'effets**
- **Processeurs vocaux**

### 4. **STUDIO & ENREGISTREMENT**
- **Interfaces audio**
- **Microphones**
  - Micros dynamiques
  - Micros à condensateur
  - Micros à ruban
- **Casques & Écoute**
- **Contrôleurs MIDI**

### 5. **ACCESSOIRES**
- **Câbles**
  - Câbles jack
  - Câbles XLR
  - Câbles MIDI
- **Supports & Pieds**
- **Étuis & Housses**
- **Cordes & Consommables**
- **Médiators & Accessoires**

## Base de données suggérée :

```sql
-- Table des catégories principales
categories (
  id, 
  name, 
  slug, 
  description, 
  image_url,
  parent_id -- pour la hiérarchie
)

-- Table des produits enrichie
products (
  id,
  name,
  description,
  price,
  stock,
  brand, -- marque importante pour les instruments
  model,
  category_id,
  subcategory_id,
  images, -- JSON array pour plusieurs images
  specifications, -- JSON pour specs techniques
  created_at,
  updated_at
)
```
