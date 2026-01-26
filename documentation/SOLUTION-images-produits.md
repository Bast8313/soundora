# 🔧 SOLUTION - Images Produits Manquantes

**Date :** 26 janvier 2026  
**Problème :** Certains produits (amplis, pédales) n'affichent pas leurs photos

---

## 🎯 Diagnostic

### ✅ Ce qui fonctionne

- Les images des **guitares, basses, claviers** s'affichent correctement
- Le système de fallback (placeholder coloré) fonctionne

### ❌ Problèmes identifiés

#### 1. **Pédales d'effets**

- ❌ **Aucun produit de pédale n'existe en base de données**
- ❌ Aucune image de pédale dans `assets/images/products/`
- ❌ Pas de mapping dans le code (maintenant corrigé ✅)

#### 2. **Amplis**

- ✅ Images existent physiquement
- ⚠️ Possible problème de correspondance entre le champ `model` en BDD et les clés du mapping
- ⚠️ Certains amplis peuvent ne pas avoir de champ `model` rempli

---

## 🛠️ Solutions à appliquer

### Étape 1 : Ajouter les pédales d'effets en base de données

```bash
# Se connecter à Supabase SQL Editor
# Exécuter le fichier : documentation/dataWorkbench/add_pedals.sql
```

Ce script va :

- Créer la catégorie "Pédales d'effets" si elle n'existe pas
- Créer les marques Boss, Electro-Harmonix, MXR, TC Electronic
- Ajouter 4 pédales d'effets :
  - Boss DS-1 Distortion
  - Electro-Harmonix Big Muff Pi
  - MXR Phase 90
  - TC Electronic Hall of Fame 2

### Étape 2 : Ajouter les images des pédales

Télécharger et ajouter ces images dans `soundora-frontend/src/assets/images/products/` :

1. **boss-ds1-distortion.jpg** - Boss DS-1 (pédale orange)
2. **electro-harmonix-big-muff-pi.jpg** - Big Muff Pi (pédale argentée)
3. **mxr-phase-90.jpg** - MXR Phase 90 (pédale orange)
4. **tc-electronic-hall-of-fame-2.jpg** - Hall of Fame 2 (pédale noire)

### Étape 3 : Vérifier le champ `model` des amplis en BDD

Exécuter cette requête SQL dans Supabase pour vérifier les amplis :

```sql
-- Vérifier les amplis et leurs modèles
SELECT
    name,
    model,
    slug,
    category_id
FROM products
WHERE category_id IN (
    SELECT id FROM categories
    WHERE name ILIKE '%ampli%'
    OR slug ILIKE '%ampli%'
)
ORDER BY name;
```

#### Modèles attendus (doivent correspondre exactement) :

| Nom du produit             | Champ `model` attendu | Fichier image                     |
| -------------------------- | --------------------- | --------------------------------- |
| Ampeg SVT-7 Pro            | `SVT-7 Pro`           | ampeg-svt-7-pro.jpg ✅            |
| Fender Blues Junior IV     | `Blues Junior IV`     | fender-blues-junior-iv.jpg ✅     |
| Fender Rumble 500          | `Rumble 500`          | fender-rumble-500.jpg ✅          |
| Marshall DSL40CR           | `DSL40CR`             | marshall-dsl40cr.jpg ✅           |
| Marshall JCM800 2203       | `JCM800 2203`         | marshall-jcm800-2203.jpg ✅       |
| Orange Rockerverb 50 MKIII | `Rockerverb 50 MKIII` | orange-rockerverb-50-mkiii.jpg ✅ |
| Orange Rocker 30           | `Rocker 30`           | (À créer si nécessaire)           |
| Vox AC30C2                 | `AC30C2`              | vox-ac30c2.jpg ✅                 |

### Étape 4 : Corriger les modèles si nécessaire

Si certains amplis n'ont pas de champ `model` ou s'il ne correspond pas, exécuter :

```sql
-- Exemple : Corriger le modèle du Marshall DSL40CR
UPDATE products
SET model = 'DSL40CR'
WHERE slug = 'marshall-dsl40cr';

-- Corriger le modèle du Marshall JCM800
UPDATE products
SET model = 'JCM800 2203'
WHERE slug = 'marshall-jcm800-2203';

-- Corriger le modèle de l'Orange Rockerverb
UPDATE products
SET model = 'Rockerverb 50 MKIII'
WHERE slug = 'orange-rockerverb-50-mkiii';

-- Etc. pour tous les amplis
```

---

## 🧪 Test

Après avoir appliqué ces solutions :

1. **Redémarrer le frontend** :

   ```bash
   cd soundora-frontend
   ng serve
   ```

2. **Naviguer vers les amplis** : `http://localhost:4200/products?category=amplis-guitare`

3. **Naviguer vers les pédales** : `http://localhost:4200/products?category=pedales-effets`

4. **Vérifier** :
   - ✅ Les amplis affichent leurs images
   - ✅ Les pédales s'affichent et ont leurs images
   - ✅ Pas de placeholder coloré (sauf si image manquante)

---

## 📊 Résumé des modifications

### Code TypeScript (✅ Déjà fait)

- Ajout du mapping pour les 4 pédales d'effets
- Réorganisation du mapping par catégorie pour plus de clarté

### Base de données (⏳ À faire)

- Exécuter `add_pedals.sql` pour ajouter les pédales
- Vérifier/corriger les champs `model` des amplis

### Images (⏳ À faire)

- Ajouter 4 images de pédales dans `assets/images/products/`

---

## 🔍 Comment vérifier si un produit utilise l'image locale ou le placeholder ?

Dans le navigateur, faire :

1. Clic droit sur l'image du produit
2. "Inspecter l'élément"
3. Regarder l'attribut `src` :
   - ✅ **Image locale** : `src="/assets/images/products/nom-fichier.jpg"`
   - ❌ **Placeholder** : `src="https://via.placeholder.com/..."`
   - ⚠️ **Image cassée** : `src="https://images.unsplash.com/..."` (fallback)

---

## 📝 Notes importantes

1. **Le mapping est sensible à la casse** : Le code fait `.toLowerCase()` sur le modèle, donc "DSL40CR" devient "dsl40cr" ✅

2. **Ordre de priorité des images** :
   - 1️⃣ Images locales (via `productImageMap`)
   - 2️⃣ Images de la BDD (`product.images[0]` ou `product.image_url`)
   - 3️⃣ Placeholder coloré avec emoji

3. **En cas d'erreur de chargement** : L'image se remplace automatiquement par une image Unsplash (voir méthode `onImageError()`)

---

## ✅ Checklist finale

- [ ] Script SQL `add_pedals.sql` exécuté dans Supabase
- [ ] 4 images de pédales ajoutées dans `assets/images/products/`
- [ ] Champs `model` des amplis vérifiés/corrigés
- [ ] Frontend redémarré
- [ ] Tests visuels effectués
- [ ] Documentation [IMAGES-MANQUANTES.md](IMAGES-MANQUANTES.md) mise à jour
