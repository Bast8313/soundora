# 📄 PAGE DÉTAILS PRODUIT - Explication pour Étudiants

## 🎯 Objectif
Créer une page qui affiche tous les détails d'un produit quand on clique sur "Voir les détails" depuis la liste.

---

## 🗂️ Fichiers créés

### 1. **product-detail.component.ts** (Le cerveau)
C'est le fichier TypeScript qui contient toute la logique.

#### Les propriétés importantes :
```typescript
product: any = null;       // Stocke les infos du produit
loading: boolean = true;   // true = on charge, false = chargement terminé
error: string = '';        // Stocke un message d'erreur si problème
```

#### Les méthodes importantes :

**ngOnInit()** - Démarrage automatique
- Récupère le "slug" depuis l'URL (exemple : `/product/gibson-les-paul`)
- Appelle `loadProduct()` pour charger les données

**loadProduct(slug)** - Chargement des données
- Appelle l'API backend via `productService.getProductBySlug()`
- Si succès → met les données dans `this.product`
- Si erreur → affiche un message d'erreur

**addToCart()** - Ajout au panier
- Appelle `cartService.addToCart()` avec l'ID du produit
- Affiche une alerte de confirmation

**goBack()** - Retour à la liste
- Navigue vers `/products`

---

### 2. **product-detail.component.html** (L'affichage)
C'est le fichier HTML qui structure la page.

#### Structure :
```
┌─────────────────────────────────┐
│  [← Retour aux produits]        │ ← Bouton retour
├─────────────────────────────────┤
│                                 │
│  ┌──────┐  ┌──────────────┐    │
│  │Image │  │ Nom          │    │ ← Layout 2 colonnes
│  │      │  │ Marque       │    │
│  │      │  │ Prix         │    │
│  └──────┘  │ Description  │    │
│            │ [Ajouter 🛒] │    │
│            └──────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Directives Angular utilisées :

**\*ngIf="loading"** - Affiche le loader pendant le chargement
```html
<div *ngIf="loading">Chargement...</div>
```

**\*ngIf="product"** - Affiche le produit seulement quand il est chargé
```html
<div *ngIf="product">
  <h1>{{ product.name }}</h1>
</div>
```

**[src]="product.image_url"** - Binding de propriété
```html
<img [src]="product.image_url" />
```
→ Remplace `src` par la valeur de `product.image_url`

**{{ product.name }}** - Interpolation
```html
<h1>{{ product.name }}</h1>
```
→ Affiche la valeur de `product.name`

---

### 3. **product-detail.component.css** (Le style)
Styles simples et propres.

#### Techniques CSS utilisées :

**Grid Layout** - Pour diviser en 2 colonnes
```css
.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2 colonnes égales */
  gap: 40px;                        /* Espace entre colonnes */
}
```

**Flexbox** - Pour aligner les éléments
```css
.product-info {
  display: flex;
  flex-direction: column;  /* En colonne verticale */
  gap: 20px;               /* Espace entre éléments */
}
```

**Responsive** - Adaptation mobile
```css
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;  /* 1 seule colonne sur mobile */
  }
}
```

---

## 🔄 Flux de données

### 1. Navigation depuis la liste
```
ProductListComponent
    ↓ Clic sur "Voir détails"
    ↓ routerLink="/product/gibson-les-paul"
    ↓
Router Angular
    ↓ Trouve la route product/:slug
    ↓ Charge ProductDetailComponent
```

### 2. Chargement du produit
```
ProductDetailComponent.ngOnInit()
    ↓ Récupère slug = "gibson-les-paul"
    ↓
loadProduct("gibson-les-paul")
    ↓
ProductService.getProductBySlug("gibson-les-paul")
    ↓ GET http://localhost:3000/api/products/slug/gibson-les-paul
    ↓
Backend (Node.js)
    ↓ Requête SQL SELECT * FROM products WHERE slug = ?
    ↓
Database (MySQL/Supabase)
    ↓ Retourne les données du produit
    ↓
ProductDetailComponent.product = data
    ↓
HTML s'affiche avec les données
```

### 3. Ajout au panier
```
Utilisateur clique sur "Ajouter au panier"
    ↓
addToCart()
    ↓
CartService.addToCart(productId, 1)
    ↓ POST http://localhost:3000/api/cart/add
    ↓ body: { product_id: 123, quantity: 1 }
    ↓
Backend
    ↓ INSERT INTO cart ...
    ↓
Confirmation
    ↓
alert("Produit ajouté !")
```

---

## 📚 Concepts Angular utilisés

### 1. **Routing avec paramètres**
```typescript
// Dans app.routes.ts
{ path: 'product/:slug', component: ProductDetailComponent }

// Dans le composant
const slug = this.route.snapshot.paramMap.get('slug');
```
Le `:slug` est un paramètre dynamique.

### 2. **Services et Injection de dépendances**
```typescript
constructor(
  private productService: ProductService,  // Service injecté
  private cartService: CartService
) {}
```
Angular crée automatiquement les instances des services.

### 3. **Observables et Subscribe**
```typescript
this.productService.getProductBySlug(slug).subscribe({
  next: (data) => { ... },    // Si succès
  error: (err) => { ... }      // Si erreur
});
```
Les Observables sont des flux de données asynchrones.

### 4. **Lifecycle Hooks**
```typescript
ngOnInit(): void { ... }
```
Méthode appelée automatiquement par Angular au démarrage.

---

## 🎨 Design simple

### Couleurs utilisées :
- **Vert** : #48bb78 (bouton ajouter au panier)
- **Gris foncé** : #1a202c (titres)
- **Gris moyen** : #718096 (textes secondaires)
- **Gris clair** : #f5f5f5 (fond image)

### Espacements :
- Gap entre colonnes : 40px
- Gap entre éléments : 20px
- Padding : 20px

---

## ✅ Résumé : Ce que tu as appris

1. **Routing dynamique** : Utiliser des paramètres dans l'URL
2. **Chargement de données** : Récupérer un produit depuis l'API
3. **Affichage conditionnel** : Utiliser `*ngIf` pour gérer le loader
4. **Grid CSS** : Créer un layout 2 colonnes
5. **Services** : Créer et utiliser CartService
6. **Observables** : Gérer les requêtes HTTP asynchrones

---

## 🚀 Prochaines étapes possibles

1. Ajouter un sélecteur de quantité (1, 2, 3...)
2. Afficher les produits similaires
3. Ajouter des avis clients
4. Créer une galerie d'images (plusieurs photos)
5. Ajouter un système de favoris

---

**💡 Conseil d'étudiant** : Ouvre les DevTools (F12) et regarde la Console pour voir les `console.log()` et comprendre le flux de données !
