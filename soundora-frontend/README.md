# 🎸 Soundora - Frontend Angular

Frontend Angular pour la plateforme e-commerce **Soundora** (instruments de musique).

---

## 📋 **Structure du projet**

```
soundora-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts       ← Composant racine
│   │   ├── app.component.html     ← Template
│   │   ├── app.component.css      ← Styles
│   │   ├── app.routes.ts          ← Routes (navigation)
│   │   ├── components/            ← Composants réutilisables
│   │   └── services/              ← Services (API, etc.)
│   ├── main.ts                    ← Point d'entrée
│   └── index.html                 ← HTML principal
├── package.json                   ← Dépendances
├── angular.json                   ← Configuration Angular
└── tsconfig.json                  ← Configuration TypeScript
```

---

## 🚀 **Démarrage rapide**

### **1. Installation des dépendances**
```bash
cd soundora-frontend
npm install
```

### **2. Lancer le serveur de développement**
```bash
npm start
# OU
ng serve
```

Le site est accessible sur : **http://localhost:4200**

### **3. Construire pour la production**
```bash
npm run build
# Les fichiers compilés se trouvent dans `dist/`
```

---

## 📦 **Technologies utilisées**

- **Angular 17** : Framework web moderne
- **TypeScript** : Langage fortement typé
- **RxJS** : Programmation réactive
- **Angular Router** : Navigation entre pages
- **HttpClient** : Requêtes HTTP vers l'API backend

---

## 🔗 **Communication avec le backend**

Le frontend communique avec le backend via l'API REST :

**URL du backend :** `http://localhost:3010/api`

### Exemple de requête :
```typescript
// Service pour récupérer les produits
constructor(private http: HttpClient) {}

getProducts() {
  return this.http.get('http://localhost:3010/api/products');
}
```

---

## 📝 **Prochaines étapes**

- [ ] Créer les composants (ProductList, ProductDetail, Cart, etc.)
- [ ] Créer les services (ProductService, CartService, AuthService, etc.)
- [ ] Implémenter les routes
- [ ] Ajouter les styles (CSS/Bootstrap/Tailwind)
- [ ] Intégrer Stripe pour les paiements
- [ ] Ajouter l'authentification

---

## ⚙️ **Commandes utiles**

```bash
# Générer un nouveau composant
ng generate component components/product-list

# Générer un service
ng generate service services/product

# Lancer les tests
npm run test

# Linter le code
npm run lint
```

---

## 📚 **Documentation**

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [RxJS Documentation](https://rxjs.dev/)

---

**Développé avec ❤️ pour Soundora**
