# 🔐 Système d'Authentification - Explication Complète

**Date :** 26 janvier 2026  
**Objectif :** Afficher dynamiquement "Connexion/Inscription" ou "Bonjour [Prénom] | Déconnexion" dans la navbar

---

## 🎯 Vue d'ensemble

Le système d'authentification fonctionne en **3 parties** :

```
┌─────────────────────┐
│  AuthService        │  ← Gère l'état de connexion
│  (auth.service.ts)  │     (qui est connecté ?)
└──────────┬──────────┘
           │
           │ Notifie automatiquement
           ↓
┌─────────────────────┐
│  NavbarComponent    │  ← S'abonne aux changements
│  (navbar.ts/html)   │     et se met à jour
└─────────────────────┘
```

---

## 📦 Partie 1 : AuthService (Le Cerveau)

### Fichier : `auth.service.ts`

Le service d'authentification est comme une **tour de contrôle** qui :

1. Sait si quelqu'un est connecté ou pas
2. **Prévient automatiquement** tous les composants quand ça change
3. Stocke les infos dans le navigateur (pour survivre aux rafraîchissements de page)

### 🔑 Concept clé : BehaviorSubject

Imagine une **boîte magique** qui contient une valeur ET qui crie "HÉ, J'AI CHANGÉ !" à tous ceux qui l'écoutent :

```typescript
// Création de la boîte magique
private currentUserSubject: BehaviorSubject<User | null>;

// Peut contenir :
// - null (personne n'est connecté)
// - Un objet User { id: "123", email: "test@test.com", ... } (quelqu'un est connecté)
```

**Pourquoi c'est génial ?**

- Quand on fait `login()` → La boîte change → La navbar reçoit automatiquement la notification !
- Quand on fait `logout()` → La boîte change → La navbar se met à jour toute seule !

### 📊 localStorage : La Mémoire du Navigateur

```typescript
// Sauvegarder dans le navigateur
localStorage.setItem("access_token", "abc123...");
localStorage.setItem("currentUser", JSON.stringify(user));

// Récupérer au démarrage
const storedUser = localStorage.getItem("currentUser");
```

**Pourquoi ?**

- Si tu te connectes et que tu rafraîchis la page (F5), tu restes connecté !
- Le navigateur "se souvient" grâce au localStorage

### 🔄 Fonctionnement détaillé

#### 1. Au démarrage de l'application

```typescript
constructor(private http: HttpClient) {
  // On vérifie si un utilisateur est déjà connecté
  const storedUser = localStorage.getItem('currentUser');

  // On initialise la boîte magique avec la valeur trouvée
  this.currentUserSubject = new BehaviorSubject(storedUser || null);
}
```

#### 2. Lors de la connexion

```typescript
login(email: string, password: string) {
  return this.http.post('/api/auth/login', { email, password })
    .pipe(
      tap(response => {
        // 1. Sauvegarder dans le navigateur
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        // 2. Mettre à jour la boîte magique
        // ⚡ MAGIE : Tous les composants abonnés sont automatiquement notifiés !
        this.currentUserSubject.next(response.user);
      })
    );
}
```

#### 3. Lors de la déconnexion

```typescript
logout() {
  // 1. Supprimer du navigateur
  localStorage.removeItem('access_token');
  localStorage.removeItem('currentUser');

  // 2. Mettre la boîte magique à null
  // ⚡ MAGIE : La navbar reçoit la notification et affiche "Connexion/Inscription"
  this.currentUserSubject.next(null);
}
```

---

## 🎨 Partie 2 : NavbarComponent (L'Affichage)

### Fichier : `navbar.component.ts`

La navbar **s'abonne** aux changements du AuthService. C'est comme mettre une **alarme** qui sonne à chaque changement.

### 🔔 Subscription : L'Abonnement

```typescript
// Variable pour stocker l'abonnement
private userSubscription!: Subscription;

ngOnInit() {
  // On s'abonne à la boîte magique du AuthService
  this.userSubscription = this.authService.currentUser$.subscribe(user => {
    // Ce code s'exécute automatiquement à CHAQUE changement !
    console.log('Nouvel utilisateur:', user);
    this.currentUser = user; // On stocke localement
  });
}
```

**Comment ça marche ?**

1. **Au démarrage** : `subscribe()` s'active, reçoit la valeur actuelle (connecté ou pas)
2. **Quand login()** : Le AuthService change la valeur → `subscribe()` reçoit le nouvel utilisateur
3. **Quand logout()** : Le AuthService met à null → `subscribe()` reçoit null

### 🧹 Nettoyage : ngOnDestroy()

**IMPORTANT :** Il faut toujours se désabonner quand le composant est détruit !

```typescript
ngOnDestroy() {
  // Se désabonner pour éviter les fuites mémoire
  if (this.userSubscription) {
    this.userSubscription.unsubscribe();
  }
}
```

**Pourquoi ?**

- Si on ne se désabonne pas, l'abonnement continue d'écouter même après la destruction du composant
- Ça crée des **fuites mémoire** (le navigateur garde des choses inutiles en mémoire)

### 📝 Méthodes du composant

```typescript
// Vérifie si connecté (utilisé dans le template)
isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}

// Déconnecte et redirige
logout(): void {
  this.authService.logout();      // Appelle le service
  this.router.navigate(['/']);    // Redirige vers l'accueil
}
```

---

## 🎨 Partie 3 : Template HTML (L'Interface)

### Fichier : `navbar.component.html`

On utilise `*ngIf` pour afficher conditionnellement les boutons.

### 🔀 Affichage conditionnel avec \*ngIf

```html
<!-- Si NON connecté -->
<div *ngIf="!isLoggedIn()">
  <a routerLink="/login">Connexion</a>
  <a routerLink="/register">Inscription</a>
</div>

<!-- Si CONNECTÉ -->
<div *ngIf="isLoggedIn()">
  <span>Bonjour {{ currentUser?.first_name || currentUser?.email }}</span>
  <button (click)="logout()">Déconnexion</button>
</div>
```

### 🔍 Syntaxe spéciale Angular

#### Le `?` (Safe Navigation Operator)

```html
{{ currentUser?.first_name }}
```

**Signification :** "Accède à first_name **seulement si** currentUser existe"

Sans le `?` :

- Si `currentUser` est null → ❌ Erreur "Cannot read property of null"

Avec le `?` :

- Si `currentUser` est null → ✅ Affiche rien (pas d'erreur)

#### Le `||` (OU logique)

```html
{{ currentUser?.first_name || currentUser?.email }}
```

**Signification :** "Affiche le prénom OU l'email si pas de prénom"

Exemples :

- User avec prénom : Affiche "John"
- User sans prénom : Affiche "john@test.com"

---

## 🎬 Scénario complet : Connexion d'un utilisateur

Imaginons que l'utilisateur se connecte :

```
1. Utilisateur clique sur "Connexion"
   ↓
2. Page de connexion (à créer plus tard)
   ↓
3. Utilisateur entre email/password et valide
   ↓
4. Composant Login appelle : authService.login('test@test.com', 'password')
   ↓
5. AuthService envoie la requête au backend
   ↓
6. Backend répond : { success: true, user: {...}, access_token: "abc123" }
   ↓
7. AuthService :
   - Sauvegarde dans localStorage ✅
   - Met à jour le BehaviorSubject ✅
   ↓
8. NavbarComponent reçoit la notification (via subscribe) ⚡
   ↓
9. currentUser = { id: "123", email: "test@test.com", first_name: "John" }
   ↓
10. Le template se met à jour AUTOMATIQUEMENT
    - *ngIf="!isLoggedIn()" → false → Masque "Connexion/Inscription"
    - *ngIf="isLoggedIn()" → true → Affiche "Bonjour John | Déconnexion"
```

**C'est magique ! 🎩✨**

---

## 🔄 Schéma du flux de données

```
┌──────────────────────────────────────────────────────────┐
│                     AUTHSERVICE                          │
│                                                          │
│  ┌─────────────────────────────────────────┐            │
│  │   BehaviorSubject<User | null>          │            │
│  │                                         │            │
│  │   Valeur actuelle : null ou User        │            │
│  └────────────┬────────────────────────────┘            │
│               │                                          │
│               │ Émet des notifications                   │
│               │ à chaque changement                      │
└───────────────┼──────────────────────────────────────────┘
                │
                ├─────────────────────┐
                │                     │
                ↓                     ↓
        ┌──────────────┐      ┌──────────────┐
        │   Navbar     │      │   Autre      │
        │  Component   │      │  Component   │
        │              │      │              │
        │  subscribe() │      │  subscribe() │
        └──────────────┘      └──────────────┘
         Se met à jour         Se met à jour
         automatiquement       automatiquement
```

---

## 📚 Résumé des concepts pour un étudiant

### 1. **Observable et Subscription**

- **Observable** = Un flux de données qu'on peut écouter
- **subscribe()** = S'abonner pour recevoir les notifications
- **unsubscribe()** = Se désabonner (important pour éviter les fuites mémoire !)

### 2. **BehaviorSubject**

- Type spécial d'Observable qui :
  - Stocke une valeur actuelle
  - Émet cette valeur immédiatement aux nouveaux abonnés
  - Notifie tous les abonnés à chaque changement

### 3. **localStorage**

- Stockage permanent dans le navigateur
- Survit aux rafraîchissements de page
- Clé-Valeur (comme un dictionnaire)

### 4. **Lifecycle Hooks Angular**

- **ngOnInit()** : Appelé quand le composant est créé
- **ngOnDestroy()** : Appelé quand le composant est détruit
- Toujours se désabonner dans ngOnDestroy() !

### 5. **Affichage conditionnel**

- `*ngIf="condition"` : Affiche l'élément seulement si la condition est vraie
- `{{ variable }}` : Affiche la valeur de la variable
- `?.` : Opérateur de navigation sécurisée (évite les erreurs si null)

---

## ✅ Ce qui a été fait

1. ✅ **Service AuthService** créé avec :
   - BehaviorSubject pour l'état utilisateur
   - Méthodes login() / logout()
   - Stockage localStorage
2. ✅ **NavbarComponent** mis à jour avec :
   - Subscription aux changements utilisateur
   - Méthode logout()
   - Nettoyage dans ngOnDestroy()

3. ✅ **Template navbar.component.html** avec :
   - Affichage conditionnel selon connexion
   - Message de bienvenue personnalisé
   - Bouton déconnexion

4. ✅ **Styles CSS** pour le bouton déconnexion

---

## 🚀 Prochaines étapes

Pour avoir un système d'authentification complet, il faudra créer :

1. **Composant Login** (formulaire de connexion)
2. **Composant Register** (formulaire d'inscription)
3. **Guard** (pour protéger les routes privées)
4. **Intercepteur HTTP** (pour ajouter automatiquement le token aux requêtes)

---

## 🧪 Test rapide

Pour tester manuellement dans la console du navigateur :

```javascript
// Simuler une connexion
localStorage.setItem(
  "currentUser",
  JSON.stringify({
    id: "123",
    email: "test@test.com",
    first_name: "John",
  }),
);
// Puis rafraîchir la page → "Bonjour John" devrait apparaître !

// Simuler une déconnexion
localStorage.removeItem("currentUser");
// Puis rafraîchir la page → "Connexion/Inscription" devrait apparaître !
```

---

## 💡 Questions fréquentes

### Q: Pourquoi utiliser BehaviorSubject et pas juste une variable ?

**R:** Une simple variable ne notifie pas automatiquement les composants quand elle change. Avec BehaviorSubject, tous les composants abonnés sont prévenus instantanément !

### Q: Pourquoi stocker le token dans localStorage ?

**R:** Pour que l'utilisateur reste connecté même après avoir fermé et rouvert le navigateur. Sans ça, il faudrait se reconnecter à chaque visite !

### Q: C'est quoi la différence entre Observable et BehaviorSubject ?

**R:**

- **Observable** : Flux de données (comme une rivière)
- **BehaviorSubject** : Observable avec une valeur actuelle (comme une rivière avec un réservoir)

### Q: Pourquoi se désabonner dans ngOnDestroy() ?

**R:** Si on ne le fait pas, l'abonnement continue d'écouter même après la destruction du composant, causant des **fuites mémoire** (le navigateur consomme de plus en plus de RAM).

---

**Bon apprentissage ! 🎓**
