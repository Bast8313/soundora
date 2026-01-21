# 📚 PRÉPARATION ENTRETIEN CDA (Concepteur Développeur d'Applications)

---

## 1️⃣ **SOLID - 5 Principes de Conception Orientée Objet**

### **S - Single Responsibility Principle**
**"Une classe = Une seule raison de changer"**

❌ **Mauvais :**
```typescript
class User {
  isValidEmail(): boolean { ... }  // Validation
  save(): void { ... }              // Persistence
  sendEmail(): void { ... }         // Notification
}
```

✅ **Bon :**
```typescript
class User { constructor(name, email) }
class UserValidator { isValidEmail() }
class UserRepository { save() }
class EmailService { send() }
```

---

### **O - Open/Closed Principle**
**"Ouvert à l'extension, fermé à la modification"**

❌ **Mauvais :**
```typescript
if (type === 'card') { /* ... */ }
else if (type === 'paypal') { /* ... */ }
else if (type === 'crypto') { /* ... */ }  // Modification !
```

✅ **Bon :**
```typescript
interface PaymentMethod { pay(amount: number): void; }
class CardPayment implements PaymentMethod { pay() { ... } }
class PayPalPayment implements PaymentMethod { pay() { ... } }
class CryptoPayment implements PaymentMethod { pay() { ... } }  // Extension !
```

---

### **L - Liskov Substitution Principle**
**"Un objet enfant doit pouvoir remplacer son parent"**

❌ **Mauvais :**
```typescript
class Bird { fly(): void { ... } }
class Penguin extends Bird {
  fly(): void { throw new Error('Ne vole pas !'); }  // Casse le contrat !
}
```

✅ **Bon :**
```typescript
interface Bird { move(): void; }
class FlyingBird implements Bird { move() { console.log('Je vole'); } }
class Penguin implements Bird { move() { console.log('Je nage'); } }
```

---

### **I - Interface Segregation Principle**
**"Ne pas forcer à implémenter des méthodes inutiles"**

❌ **Mauvais :**
```typescript
interface Worker { work(); eat(); sleep(); }
class Robot implements Worker {
  work() { ... }
  eat() { /* ??? */ }
  sleep() { /* ??? */ }
}
```

✅ **Bon :**
```typescript
interface Workable { work(); }
interface Eatable { eat(); }
interface Sleepable { sleep(); }
class Human implements Workable, Eatable, Sleepable { ... }
class Robot implements Workable { work() { ... } }
```

---

### **D - Dependency Inversion Principle**
**"Dépendre des abstractions, pas des implémentations"**

❌ **Mauvais :**
```typescript
class UserService {
  private db = new MySQLDatabase();  // Dépendance directe !
}
```

✅ **Bon :**
```typescript
interface Database { save(data): void; }
class MySQLDatabase implements Database { save() { ... } }
class MongoDatabase implements Database { save() { ... } }
class UserService {
  constructor(private db: Database) {}  // Injection !
}
```

---

## 2️⃣ **DESIGN PATTERNS - Solutions Réutilisables**

### **PATTERNS CRÉATEURS**

#### **1. Singleton**
"Une seule instance dans toute l'application"

```typescript
class Database {
  private static instance: Database;
  private constructor() {}
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true
```

**Exemple Soundora :** Services Angular (Singleton)

---

#### **2. Factory**
"Déléguer la création d'objets"

```typescript
class UserFactory {
  static createUser(type: string): User {
    switch(type) {
      case 'admin': return new AdminUser();
      case 'client': return new ClientUser();
    }
  }
}

const admin = UserFactory.createUser('admin');
```

---

#### **3. Builder**
"Construire des objets complexes étape par étape"

```typescript
class PizzaBuilder {
  private pizza = new Pizza();
  setSize(size: number) { this.pizza.size = size; return this; }
  addCheese() { this.pizza.cheese = true; return this; }
  build(): Pizza { return this.pizza; }
}

const pizza = new PizzaBuilder()
  .setSize(30)
  .addCheese()
  .build();
```

---

### **PATTERNS STRUCTURELS**

#### **4. Adapter**
"Faire communiquer interfaces incompatibles"

```typescript
class PaymentAdapter implements ModernPayment {
  constructor(private oldSystem: OldPaymentSystem) {}
  
  pay(amount: number): void {
    this.oldSystem.processOldPayment(amount.toString());
  }
}
```

---

#### **5. Decorator**
"Ajouter fonctionnalités dynamiquement"

```typescript
class SimpleCoffee { cost() { return 5; } }
class MilkDecorator {
  constructor(private coffee) {}
  cost() { return this.coffee.cost() + 2; }
}

let coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);  // 7€
```

**Exemple Angular :** @Component, @Injectable

---

#### **6. Facade**
"Simplifier interface complexe"

```typescript
class ComputerFacade {
  private cpu = new CPU();
  private memory = new Memory();
  
  start(): void {
    this.cpu.freeze();
    this.memory.load();
    this.cpu.execute();
  }
}

const computer = new ComputerFacade();
computer.start();  // Simple !
```

**Exemple Soundora :** Services Angular (simplifient accès API)

---

### **PATTERNS COMPORTEMENTAUX**

#### **7. Observer**
"Notifier automatiquement les changements"

```typescript
class Newsletter {
  private subscribers = [];
  
  subscribe(sub) { this.subscribers.push(sub); }
  notify(article) {
    this.subscribers.forEach(sub => sub.update(article));
  }
}
```

**Exemple Angular :** RxJS Observables (.subscribe())

---

#### **8. Strategy**
"Changer d'algorithme dynamiquement"

```typescript
interface SortStrategy { sort(data): data[]; }
class BubbleSort implements SortStrategy { ... }
class QuickSort implements SortStrategy { ... }

class Sorter {
  constructor(private strategy: SortStrategy) {}
  setStrategy(strategy) { this.strategy = strategy; }
}
```

**Exemple Soundora :** Différents moyens de paiement

---

#### **9. Template Method**
"Définir squelette d'algorithme"

```typescript
abstract class DataParser {
  parse(): void {
    this.openFile();
    this.extractData();  // À implémenter
    this.parseData();    // À implémenter
    this.closeFile();
  }
  
  protected abstract extractData(): void;
  protected abstract parseData(): void;
}
```

---

## 3️⃣ **JAVASCRIPT MODERNE - Fonctionnalités ES6+**

### **Variables**
```javascript
let age = 25;        // Réassignable, portée bloc
const name = 'Bastien';  // Constante, portée bloc
```

---

### **Fonctions**
```javascript
// Arrow function
const add = (a, b) => a + b;

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Spread operator
const arr2 = [...arr1, 4, 5];
```

---

### **Destructuration**
```javascript
// Tableaux
const [first, second] = ['red', 'green', 'blue'];

// Objets
const { name, age } = { name: 'Bastien', age: 25 };

// Avec renommage
const { name: userName } = user;
```

---

### **Méthodes de tableaux (IMPORTANTES !)**
```javascript
const numbers = [1, 2, 3, 4, 5];

// MAP - Transforme
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// FILTER - Filtre
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// REDUCE - Réduit
const sum = numbers.reduce((acc, n) => acc + n, 0);  // 15

// FIND - Trouve premier
const found = numbers.find(n => n > 3);  // 4

// SOME - Au moins un
const hasEven = numbers.some(n => n % 2 === 0);  // true

// EVERY - Tous
const allPositive = numbers.every(n => n > 0);  // true
```

---

### **Promesses et Async/Await**
```javascript
// Promise
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await (plus lisible)
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

---

### **Classes ES6**
```javascript
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  
  getInfo() {
    return `${this.name}: ${this.price}€`;
  }
  
  get priceWithTax() {
    return this.price * 1.2;
  }
  
  static compare(p1, p2) {
    return p1.price - p2.price;
  }
}

class Guitar extends Product {
  constructor(name, price, strings) {
    super(name, price);
    this.strings = strings;
  }
}
```

---

### **Fonctionnalités modernes**
```javascript
// Template literals
const msg = `Bonjour ${name}, tu as ${age} ans`;

// Optional chaining
const city = user?.address?.city;

// Nullish coalescing
const value = null ?? 'default';  // 'default'
const value2 = 0 ?? 'default';    // 0
```

---

## 4️⃣ **REST vs GraphQL**

### **REST API**

**Concept :** URLs + verbes HTTP

```javascript
GET    /api/products       // Liste
GET    /api/products/123   // Un produit
POST   /api/products       // Créer
PUT    /api/products/123   // Modifier
DELETE /api/products/123   // Supprimer

// Réponse : TOUT ou rien
{
  "id": 123,
  "name": "Guitare",
  "price": 500,
  "reviews": [...],  // Pas demandé
  "stock": 10        // Pas demandé
}
```

**Avantages :**
✅ Simple et standardisé
✅ Cache HTTP natif
✅ Facile à comprendre

**Inconvénients :**
❌ Over-fetching (trop de données)
❌ Under-fetching (plusieurs requêtes)

---

### **GraphQL**

**Concept :** Langage de requête

```javascript
// Une seule URL : /graphql
query {
  product(id: 123) {
    name
    price
    category { name }
  }
}

// Réponse : EXACTEMENT ce qui est demandé
{
  "data": {
    "product": {
      "name": "Guitare",
      "price": 500,
      "category": { "name": "Instruments" }
    }
  }
}
```

**Avantages :**
✅ Demande précise
✅ Une seule requête
✅ Typage fort

**Inconvénients :**
❌ Plus complexe
❌ Cache moins évident

---

### **Comparaison**

| Critère | REST | GraphQL |
|---------|------|---------|
| **Endpoints** | Multiples | Un seul |
| **Données** | Tout ou rien | Sur mesure |
| **Requêtes** | Plusieurs | Une seule |
| **Courbe** | Facile | Difficile |
| **Cache** | HTTP natif | Custom |

**Soundora utilise REST** : Simple et adapté à l'e-commerce

---

## 5️⃣ **OWASP TOP 10 - Vulnérabilités Web**

### **1. Broken Access Control**
Utilisateur accède à des ressources interdites

```javascript
// ❌ VULNÉRABLE
app.get('/api/users/:id', (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);  // N'importe qui peut voir !
});

// ✅ SÉCURISÉ
app.get('/api/users/:id', checkAuth, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  // ...
});
```

---

### **2. Cryptographic Failures**
Données sensibles mal protégées

```javascript
// ❌ Mot de passe en clair
password: '123456'

// ✅ Hash avec bcrypt
const hashedPassword = await bcrypt.hash('123456', 10);
```

**Protection :** HTTPS, hash des mots de passe, pas de données sensibles en clair

---

### **3. Injection (SQL, XSS...)**
Code malveillant injecté

```javascript
// ❌ SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Si email = "admin' OR '1'='1" → Retourne TOUS les users !

// ✅ Requêtes préparées
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);

// ✅ Supabase (sécurisé par défaut)
await supabase.from('users').select('*').eq('email', email);
```

---

### **4. Insecure Design**
Architecture mal pensée

```javascript
// ✅ Token unique + expiration
const resetToken = crypto.randomBytes(32).toString('hex');
const resetExpires = Date.now() + 3600000;  // 1h
```

---

### **5. Security Misconfiguration**
Mauvaise configuration

```javascript
// ❌ Messages d'erreur détaillés en prod
res.json({ error: err.message, stack: err.stack });

// ✅ Messages génériques
res.status(500).json({ error: 'Une erreur est survenue' });
```

---

### **6. Vulnerable Components**
Bibliothèques obsolètes

```bash
npm audit        # Vérifier
npm audit fix    # Corriger
npm update       # Mettre à jour
```

---

### **7. Authentication Failures**
Authentification faible

```javascript
// ✅ Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 5  // 5 tentatives max
});

app.post('/login', loginLimiter, async (req, res) => {
  // JWT avec expiration
  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
});
```

---

### **8. Software and Data Integrity Failures**
Code non vérifié

```html
<!-- ✅ Subresource Integrity -->
<script 
  src="https://cdn.example.com/lib.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

---

### **9. Logging and Monitoring Failures**
Logs insuffisants

```javascript
// ✅ Logger les événements importants
logger.info('Tentative de connexion', {
  email: req.body.email,
  ip: req.ip,
  timestamp: new Date()
});
```

---

### **10. Server-Side Request Forgery (SSRF)**
Serveur manipulé

```javascript
// ❌ VULNÉRABLE
const url = req.query.url;
const response = await fetch(url);  // Accès ressources internes !

// ✅ SÉCURISÉ - Whitelist
const allowedDomains = ['api.example.com'];
const urlObj = new URL(url);
if (!allowedDomains.includes(urlObj.hostname)) {
  return res.status(403).json({ error: 'Domaine non autorisé' });
}
```

---

## 🎯 **PROJET SOUNDORA - Points Forts**

### **Architecture**
✅ **Frontend :** Angular 17, TypeScript, Standalone Components
✅ **Backend :** Node.js, Express, Supabase (PostgreSQL)
✅ **API :** REST, JWT Authentication
✅ **Sécurité :** Middleware auth, variables d'environnement

### **Principes appliqués**
✅ **SOLID :** Services séparés (ProductService, CategoryService)
✅ **Design Patterns :** Singleton (services), Observer (RxJS), Facade
✅ **JavaScript moderne :** Arrow functions, async/await, map/filter
✅ **Sécurité :** JWT, HTTPS, validation inputs

### **Fonctionnalités**
✅ Catalogue produits avec filtres
✅ Navigation par catégories
✅ Panier d'achat
✅ Paiement Stripe
✅ Authentification utilisateur
✅ Administration

---

## 💡 **PHRASE D'ACCROCHE POUR L'ENTRETIEN**

*"Je développe Soundora, une plateforme e-commerce d'instruments de musique en Angular et Node.js. J'applique les principes SOLID pour un code maintenable, j'utilise des Design Patterns comme le Singleton pour les services et l'Observer avec RxJS. Je maîtrise JavaScript moderne (ES6+) avec async/await pour l'asynchrone, et j'ai mis en place une architecture REST sécurisée avec JWT et Supabase. Je suis conscient des vulnérabilités OWASP et j'implémente les protections nécessaires comme le hash des mots de passe, le rate limiting, et la validation des inputs."*

---

## ✅ **CHECK-LIST FINALE**

- [ ] **SOLID** : Comprendre les 5 principes
- [ ] **Design Patterns** : Connaître Singleton, Factory, Observer, Strategy, Facade
- [ ] **JavaScript** : Arrow functions, destructuration, map/filter/reduce, async/await
- [ ] **REST vs GraphQL** : Différences et cas d'usage
- [ ] **OWASP Top 10** : Citer 5 vulnérabilités + protections
- [ ] **Projet Soundora** : Présenter architecture et fonctionnalités
- [ ] **GitHub** : Montrer le code, commits réguliers
- [ ] **Tests** : Avoir testé l'application

---

## 📚 **RESSOURCES COMPLÉMENTAIRES**

### **SOLID & Design Patterns**
- refactoring.guru - Excellents visuels
- sourcemaking.com - Explications détaillées

### **JavaScript**
- javascript.info - Guide complet
- MDN Web Docs - Référence officielle

### **Sécurité**
- owasp.org - Top 10 détaillé
- snyk.io - Audit dépendances

### **Angular**
- angular.dev - Documentation officielle
- RxJS.dev - Programmation réactive

---

**Bonne chance pour ton entretien CDA ! Tu as toutes les cartes en main ! 🚀💪**

*Projet : Soundora - E-commerce d'instruments de musique*  
*GitHub : https://github.com/Bast8313/soundora*
