# 📚 GUIDE COMPLET DE L'AUTHENTIFICATION - Pour Étudiants

## 🎯 Objectif de ce guide

Ce guide explique **en détail** comment fonctionne l'authentification dans l'application Soundora, étape par étape, avec des explications pour les débutants.

---

## 📖 Table des matières

1. [Qu'est-ce que l'authentification ?](#1-quest-ce-que-lauthentification-)
2. [Architecture globale](#2-architecture-globale)
3. [Le service AuthService](#3-le-service-authservice)
4. [Le composant Login](#4-le-composant-login)
5. [Le composant Register](#5-le-composant-register)
6. [Communication avec le backend](#6-communication-avec-le-backend)
7. [Concepts clés Angular](#7-concepts-clés-angular)
8. [Glossaire des termes](#8-glossaire-des-termes)

---

## 1. Qu'est-ce que l'authentification ?

### Définition simple
**L'authentification** = vérifier l'identité d'une personne

Comme quand vous montrez votre carte d'identité pour prouver qui vous êtes.

### Dans une application web

1. **Inscription** : Je crée un compte avec email + mot de passe
2. **Connexion** : Je prouve que c'est bien moi en donnant mon email + mot de passe
3. **Token** : Le serveur me donne un "badge d'accès" (jeton JWT)
4. **Utilisation** : Je montre ce badge à chaque fois que je fais une action

### Analogie de la bibliothèque

Imaginez une bibliothèque :
- **Inscription** = Vous vous inscrivez et on vous donne une carte de bibliothèque
- **Connexion** = Vous montrez votre carte à l'entrée
- **Token** = Un bracelet temporaire qu'on vous met au poignet
- **Déconnexion** = On retire le bracelet à la sortie

---

## 2. Architecture globale

### Schéma de l'architecture

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                     (Angular)                           │
│                                                         │
│  ┌──────────────┐       ┌─────────────────────┐       │
│  │  Composants  │◄─────►│   AuthService       │       │
│  │              │       │  (Gestion auth)     │       │
│  │ - Login      │       │                     │       │
│  │ - Register   │       │ - login()           │       │
│  │ - Navbar     │       │ - register()        │       │
│  └──────────────┘       │ - logout()          │       │
│                         │ - isLoggedIn()      │       │
│                         └──────────┬──────────┘       │
│                                    │                   │
│                                    │ HTTP Request      │
└────────────────────────────────────┼───────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────┐
│                      BACKEND                           │
│                     (Node.js)                          │
│                                                        │
│  ┌──────────────┐       ┌─────────────────────┐      │
│  │   Routes     │──────►│  AuthController     │      │
│  │              │       │                     │      │
│  │ POST /login  │       │ - register()        │      │
│  │ POST /register       │ - login()           │      │
│  └──────────────┘       │ - logout()          │      │
│                         └──────────┬──────────┘      │
│                                    │                  │
│                                    ▼                  │
│                         ┌──────────────────┐         │
│                         │    SUPABASE      │         │
│                         │  (Base de données │         │
│                         │  + Auth)         │         │
│                         └──────────────────┘         │
└────────────────────────────────────────────────────────┘
```

### Flux d'une connexion

```
1. Utilisateur remplit formulaire → LoginComponent
                                          ↓
2. Clic sur "Se connecter" → onSubmit()
                                          ↓
3. Validation des données (email valide ?)
                                          ↓
4. Appel AuthService.login(email, password)
                                          ↓
5. Requête HTTP POST vers backend
                                          ↓
6. Backend vérifie dans Supabase
                                          ↓
7. Si OK : Backend retourne { user, token }
                                          ↓
8. AuthService stocke token + user dans localStorage
                                          ↓
9. AuthService met à jour BehaviorSubject
                                          ↓
10. Navbar s'actualise automatiquement (Observable)
                                          ↓
11. Redirection vers /products
```

---

## 3. Le service AuthService

### C'est quoi un service ?

Un **service** en Angular = une classe qui contient de la **logique métier** réutilisable.

**Analogie** : C'est comme une boîte à outils que tous les composants peuvent utiliser.

### Responsabilités d'AuthService

```typescript
✅ Gérer l'état de connexion (utilisateur connecté ou pas)
✅ Communiquer avec le backend (login, register, logout)
✅ Stocker le token d'authentification
✅ Notifier les composants des changements d'état
```

### Structure du fichier

```typescript
// auth.service.ts

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  // PROPRIÉTÉS PRIVÉES
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  // CONSTRUCTEUR
  constructor(private http: HttpClient) {
    // Initialisation au démarrage
  }
  
  // MÉTHODES PUBLIQUES
  login() { ... }
  register() { ... }
  logout() { ... }
  isLoggedIn() { ... }
}
```

### Concepts clés

#### 1. BehaviorSubject

```typescript
private currentUserSubject = new BehaviorSubject<User | null>(null);
```

**Qu'est-ce que c'est ?**
- Une "boîte" qui contient une valeur
- Quand la valeur change, tous ceux qui écoutent sont notifiés
- C'est comme une radio : tous ceux qui ont la radio entendent quand le message change

**Exemple concret :**

```typescript
// Initial : personne n'est connecté
currentUserSubject.next(null);  // Valeur = null

// L'utilisateur se connecte
currentUserSubject.next({       // Valeur = objet User
  id: "123",
  email: "test@test.com"
});

// ↓ Tous les composants qui écoutent sont notifiés !
// La navbar affiche "Bonjour test@test.com"
```

#### 2. Observable

```typescript
public currentUser$: Observable<User | null>;
```

**Qu'est-ce que c'est ?**
- Un flux de données dans le temps
- Permet aux composants de "s'abonner" pour recevoir les mises à jour
- Comme une chaîne YouTube : on s'abonne pour recevoir les nouvelles vidéos

**Utilisation dans un composant :**

```typescript
// Le composant s'abonne
this.authService.currentUser$.subscribe(user => {
  if (user) {
    console.log("Utilisateur connecté:", user.email);
  } else {
    console.log("Personne n'est connecté");
  }
});
```

#### 3. localStorage

```typescript
localStorage.setItem('access_token', token);
localStorage.getItem('access_token');
localStorage.removeItem('access_token');
```

**Qu'est-ce que c'est ?**
- Stockage permanent dans le navigateur
- Les données survivent même si on ferme le navigateur
- Comme une petite base de données locale

**Pourquoi l'utiliser ?**
- Pour que l'utilisateur reste connecté après un rafraîchissement de page
- Pour stocker le token JWT

---

## 4. Le composant Login

### Responsabilités

```typescript
✅ Afficher un formulaire de connexion
✅ Valider les données saisies
✅ Envoyer les données à AuthService
✅ Gérer les erreurs
✅ Rediriger après connexion
```

### Structure du fichier

Le composant est composé de 3 fichiers :

```
login/
├── login.component.ts      ← Logique TypeScript
├── login.component.html    ← Structure HTML
└── login.component.css     ← Styles CSS
```

### Code TypeScript (login.component.ts)

#### Les propriétés

```typescript
export class LoginComponent {
  // DONNÉES DU FORMULAIRE
  email: string = '';           // Lié au champ email
  password: string = '';        // Lié au champ password
  
  // ÉTATS
  loading: boolean = false;     // true = affiche loader
  errorMessage: string = '';    // Message d'erreur à afficher
  showPassword: boolean = false; // true = mot de passe visible
}
```

#### Le binding bidirectionnel [(ngModel)]

```html
<!-- Dans le HTML -->
<input [(ngModel)]="email" />
```

**Explication :**
- `[(ngModel)]` = liaison bidirectionnelle
- Si l'utilisateur tape dans l'input → la propriété `email` du TS est mise à jour
- Si on change `email` dans le TS → l'input est mis à jour

**Schéma :**

```
TypeScript           HTML
email = "test"  ◄──►  <input value="test" />
```

#### La méthode onSubmit()

```typescript
onSubmit(): void {
  // 1. Validation
  if (!this.email || !this.password) {
    this.errorMessage = 'Champs vides';
    return;  // Arrête l'exécution
  }
  
  // 2. Activation du loader
  this.loading = true;
  
  // 3. Appel au service
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Succès
      this.router.navigate(['/products']);
    },
    error: (error) => {
      // Erreur
      this.errorMessage = error.message;
      this.loading = false;
    }
  });
}
```

**Concept : subscribe()**

`subscribe()` permet d'écouter le résultat d'une requête HTTP asynchrone.

```typescript
observable.subscribe({
  next: (données) => {
    // Ce code s'exécute si la requête réussit
  },
  error: (erreur) => {
    // Ce code s'exécute si la requête échoue
  }
});
```

---

## 5. Le composant Register

### Différences avec Login

```typescript
✅ Plus de champs (prénom, nom, confirmation)
✅ Validation plus stricte du mot de passe
✅ Indicateurs visuels en temps réel
✅ Vérification de correspondance des mots de passe
```

### Validation du mot de passe

#### Pourquoi valider ?

La sécurité ! Un mot de passe faible = compte facile à pirater.

#### Critères de validation

```typescript
✓ Au moins 6 caractères
✓ Au moins une majuscule (A-Z)
✓ Au moins une minuscule (a-z)
✓ Au moins un chiffre (0-9)
```

#### Expressions régulières (regex)

Une **regex** = un pattern pour rechercher/valider du texte.

**Exemples :**

```typescript
// Cherche une majuscule
/[A-Z]/.test("Hello")  // → true (H est majuscule)
/[A-Z]/.test("hello")  // → false (pas de majuscule)

// Cherche un chiffre
/[0-9]/.test("test123")  // → true (contient 1, 2, 3)
/[0-9]/.test("test")     // → false (pas de chiffre)

// Cherche une minuscule
/[a-z]/.test("HELLO")  // → false (pas de minuscule)
/[a-z]/.test("Hello")  // → true (e, l, l, o sont minuscules)
```

#### Code de validation

```typescript
validatePassword(): boolean {
  this.passwordErrors = [];
  
  // Test 1 : Longueur
  if (this.password.length < 6) {
    this.passwordErrors.push('Au moins 6 caractères');
  }
  
  // Test 2 : Majuscule
  if (!/[A-Z]/.test(this.password)) {
    this.passwordErrors.push('Au moins une majuscule');
  }
  
  // Test 3 : Minuscule
  if (!/[a-z]/.test(this.password)) {
    this.passwordErrors.push('Au moins une minuscule');
  }
  
  // Test 4 : Chiffre
  if (!/[0-9]/.test(this.password)) {
    this.passwordErrors.push('Au moins un chiffre');
  }
  
  // Retourne true si aucune erreur
  return this.passwordErrors.length === 0;
}
```

### Indicateurs visuels

Dans le HTML, on affiche des coches vertes ✓ quand les critères sont respectés :

```html
<div class="requirement" [class.valid]="hasMinLength()">
  ✓ Au moins 6 caractères
</div>
```

**Explication :**
- `[class.valid]="hasMinLength()"` = binding de classe
- Si `hasMinLength()` retourne `true` → la classe "valid" est ajoutée
- Le CSS rend la coche verte quand la classe "valid" est présente

---

## 6. Communication avec le backend

### Comment ça marche ?

```
Frontend                         Backend
   │                                │
   │  POST /api/auth/login          │
   │  { email, password }           │
   ├───────────────────────────────►│
   │                                │
   │                         Vérification
   │                         dans Supabase
   │                                │
   │  200 OK                        │
   │  { user, token }               │
   │◄───────────────────────────────┤
   │                                │
  Stocke token
  Redirige user
```

### Requête HTTP avec HttpClient

```typescript
// Dans AuthService
login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/login`, { 
    email, 
    password 
  });
}
```

**Explication :**
- `this.http.post()` = envoie une requête POST
- Premier paramètre = URL de l'API
- Deuxième paramètre = données à envoyer (body)
- Retourne un `Observable` = flux asynchrone

### Opérateur tap() de RxJS

```typescript
login(...).pipe(
  tap(response => {
    // Code qui s'exécute quand la requête réussit
    // SANS modifier la réponse
    localStorage.setItem('token', response.token);
  })
)
```

**Analogie :**
- `pipe()` = un tuyau où passent les données
- `tap()` = un robinet qui regarde passer les données sans les modifier
- Permet d'exécuter du code (logs, stockage) sans changer la réponse

---

## 7. Concepts clés Angular

### 1. Décorateurs

#### @Injectable

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService { }
```

**Signification :**
- Dit à Angular : "Cette classe est un service"
- `providedIn: 'root'` = une seule instance pour toute l'app (singleton)

#### @Component

```typescript
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent { }
```

**Signification :**
- Dit à Angular : "Cette classe est un composant"
- `selector` = nom du tag HTML (`<app-login>`)
- `templateUrl` = chemin vers le fichier HTML
- `styleUrls` = chemin vers le(s) fichier(s) CSS

### 2. Injection de dépendances

```typescript
constructor(
  private authService: AuthService,
  private router: Router
) { }
```

**Qu'est-ce que c'est ?**
- Angular crée automatiquement les instances des services
- Et les "injecte" dans le constructeur
- Vous n'avez pas à faire `new AuthService()`

**Avantages :**
- Facilite les tests (on peut injecter des mocks)
- Gère automatiquement le cycle de vie
- Évite la duplication de code

### 3. Directives structurelles

#### *ngIf

```html
<div *ngIf="isLoggedIn()">
  Bonjour utilisateur !
</div>
```

**Signification :**
- Affiche l'élément SEULEMENT si la condition est vraie
- Si faux, l'élément est complètement retiré du DOM

#### *ngFor

```html
<div *ngFor="let error of passwordErrors">
  {{ error }}
</div>
```

**Signification :**
- Boucle sur un tableau
- Crée un élément pour chaque item

### 4. Property binding

```html
<input [type]="showPassword ? 'text' : 'password'" />
```

**Signification :**
- `[type]` = binding de propriété
- La valeur de `type` dépend d'une expression TypeScript
- `condition ? valeurSiVrai : valeurSiFaux` = opérateur ternaire

### 5. Event binding

```html
<button (click)="onSubmit()">Se connecter</button>
```

**Signification :**
- `(click)` = écoute l'événement click
- Appelle la méthode `onSubmit()` quand on clique

---

## 8. Glossaire des termes

### A

**API (Application Programming Interface)**
- Interface pour communiquer avec un serveur
- Exemple : `POST /api/auth/login`

**Asynchrone**
- Code qui ne bloque pas l'exécution
- Permet d'attendre une réponse sans figer l'app

### B

**Backend**
- Partie serveur de l'application
- Gère la logique métier et la base de données

**BehaviorSubject**
- Type d'Observable qui garde une valeur actuelle
- Émet la valeur immédiatement aux nouveaux abonnés

**Binding**
- Liaison entre le TypeScript et le HTML
- Unidirectionnel `[]` ou bidirectionnel `[()]`

### C

**Component**
- Bloc de construction d'une app Angular
- Contient : logique (TS) + structure (HTML) + styles (CSS)

**Constructor**
- Méthode spéciale appelée à la création d'une instance
- Utilisé pour l'injection de dépendances

### D

**Décorateur**
- Annotation qui ajoute des métadonnées à une classe
- Exemples : `@Component`, `@Injectable`

**Directive**
- Instruction dans le HTML qui modifie le comportement
- Exemples : `*ngIf`, `*ngFor`, `[(ngModel)]`

### E

**Event Binding**
- Liaison d'événement : `(click)="methode()"`
- Écoute les événements du DOM

### F

**Frontend**
- Partie client de l'application (ce que voit l'utilisateur)
- Dans notre cas : Angular

### H

**HTTP**
- Protocole de communication web
- Méthodes : GET, POST, PUT, DELETE

**HttpClient**
- Service Angular pour faire des requêtes HTTP
- Retourne des Observables

### I

**Injection de dépendances**
- Mécanisme pour fournir des dépendances à une classe
- Angular crée et injecte automatiquement

**Interface**
- Définit la structure d'un objet TypeScript
- Exemple : `interface User { id: string; email: string; }`

### J

**JWT (JSON Web Token)**
- Token d'authentification encodé
- Contient des informations sur l'utilisateur

### L

**localStorage**
- Stockage persistant dans le navigateur
- Survit aux rafraîchissements de page

### O

**Observable**
- Flux de données asynchrone
- Permet de s'abonner pour recevoir les données

**Operator (RxJS)**
- Fonction qui transforme un Observable
- Exemples : `tap()`, `map()`, `filter()`

### P

**Pipe (|)**
- Opérateur RxJS pour chaîner des transformations
- Exemple : `observable.pipe(tap(), map())`

**Property Binding**
- Liaison de propriété : `[property]="valeur"`
- Change les propriétés des éléments DOM

### R

**Regex (Expression régulière)**
- Pattern pour valider/rechercher du texte
- Exemple : `/[A-Z]/` cherche une majuscule

**Router**
- Service Angular pour la navigation
- Exemple : `router.navigate(['/login'])`

### S

**Service**
- Classe qui contient de la logique métier
- Réutilisable dans plusieurs composants

**Subscribe**
- S'abonner à un Observable pour recevoir les données
- Exemple : `observable.subscribe(data => { })`

### T

**Token**
- Jeton d'authentification (JWT)
- Prouve l'identité de l'utilisateur

**Two-way binding**
- Liaison bidirectionnelle : `[(ngModel)]="propriété"`
- Synchronise TS ↔ HTML

**TypeScript**
- Langage de programmation (JavaScript typé)
- Ajoute les types pour plus de sécurité

---

## 🎓 Exercices pour s'entraîner

### Niveau débutant

1. **Ajouter un champ "username"**
   - Ajouter un champ username dans le formulaire de register
   - L'envoyer au backend
   - L'afficher dans la navbar

2. **Modifier la validation email**
   - Changer la regex pour accepter uniquement les emails `.fr`
   - Afficher un message spécifique si l'email n'est pas `.fr`

3. **Ajouter un compteur de caractères**
   - Afficher en temps réel le nombre de caractères du mot de passe
   - Exemple : "6/20 caractères"

### Niveau intermédiaire

1. **Créer une page "Mon profil"**
   - Afficher les infos de l'utilisateur connecté
   - Permettre de modifier le prénom/nom
   - Sauvegarder les modifications

2. **Ajouter un "Remember me"**
   - Checkbox pour rester connecté 30 jours
   - Stocker une préférence dans localStorage

3. **Gestion des erreurs avancée**
   - Créer un service ErrorHandlerService
   - Centraliser la gestion des erreurs
   - Afficher des toasts de notification

### Niveau avancé

1. **Créer un Guard de route**
   - Protéger certaines routes (ex: /profile)
   - Rediriger vers /login si non connecté

2. **Ajouter un refresh token**
   - Implémenter le renouvellement automatique du token
   - Gérer l'expiration du token

3. **OAuth avec Google**
   - Ajouter un bouton "Se connecter avec Google"
   - Intégrer Supabase OAuth

---

## 📚 Ressources complémentaires

### Documentation officielle
- [Angular Docs](https://angular.io/docs)
- [RxJS Docs](https://rxjs.dev/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

### Tutoriels vidéo
- Angular Tutorial for Beginners (YouTube)
- RxJS Crash Course
- Authentication with Angular

### Articles
- "Understanding Observables in Angular"
- "JWT Authentication Best Practices"
- "Form Validation in Angular"

---

## ✅ Checklist de compréhension

Cochez ce que vous avez compris :

- [ ] Je comprends ce qu'est un service Angular
- [ ] Je sais ce qu'est un Observable
- [ ] Je comprends le binding bidirectionnel [(ngModel)]
- [ ] Je sais utiliser les directives *ngIf et *ngFor
- [ ] Je comprends l'injection de dépendances
- [ ] Je sais faire une requête HTTP avec HttpClient
- [ ] Je comprends comment fonctionne subscribe()
- [ ] Je sais valider un formulaire côté client
- [ ] Je comprends les expressions régulières de base
- [ ] Je sais utiliser localStorage

---

## 🎯 Conclusion

L'authentification est un système complexe mais essentiel. Les concepts clés à retenir :

1. **Service** = logique centralisée réutilisable
2. **Observable** = flux de données asynchrone
3. **BehaviorSubject** = état partagé entre composants
4. **Validation** = toujours valider côté client ET serveur
5. **Token JWT** = preuve d'identité stockée dans localStorage

Prenez votre temps pour bien comprendre chaque concept. Relisez le code, faites des modifications, testez !

**Bon apprentissage ! 🚀**
