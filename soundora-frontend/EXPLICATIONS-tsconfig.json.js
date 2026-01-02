/**
 * =====================================
 * EXPLICATIONS DÉTAILLÉES - tsconfig.json
 * =====================================
 * 
 * FICHIER : soundora-frontend/tsconfig.json
 * RÔLE : Configuration du compilateur TypeScript
 * IMPORTANCE : ⭐⭐⭐ (TRÈS IMPORTANT)
 * 
 * =====================================
 * QU'EST-CE QUE TYPESCRIPT ?
 * =====================================
 * 
 * TypeScript = JavaScript amélioré
 * Ajoute :
 * - Typage statique (vérification des types à la compilation)
 * - Interfaces et classes
 * - Décorateurs (pour Angular)
 * - Meilleur support IDE (autocomplétion)
 * 
 * Processus :
 * TypeScript → Compilateur TS (tsconfig.json) → JavaScript (ES2022)
 * 
 * Le navigateur exécute le JavaScript, pas le TypeScript
 * 
 * =====================================
 * SECTION "compileOnSave"
 * =====================================
 * 
 * "compileOnSave": false
 * Ne compile PAS automatiquement quand on sauvegarde
 * La compilation est gérée par ng serve/build
 * 
 * =====================================
 * SECTION "compilerOptions"
 * =====================================
 * 
 * Options générales du compilateur TypeScript
 * 
 * 1. CHEMINS ET MODULES
 *    ==================
 * 
 *    a) "baseUrl": "./"
 *       Dossier de base pour les imports
 *       Permet les imports sans ./ relatives
 *       Exemple :
 *       import { MonService } from 'app/services/mon.service'
 *       au lieu de :
 *       import { MonService } from '../../../app/services/mon.service'
 * 
 *    b) "outDir": "./dist/out-tsc"
 *       Dossier où TypeScript compile les fichiers .ts en .js
 *       Les fichiers compilés sont ensuite utilisés
 * 
 *    c) "moduleResolution": "node"
 *       Comment résoudre les imports
 *       "node" = comme Node.js (suit node_modules/)
 * 
 *    d) "module": "ES2022"
 *       Format des modules en sortie
 *       ES2022 = Format moderne avec import/export
 * 
 * 2. VERSION CIBLE
 *    ==============
 * 
 *    a) "target": "ES2022"
 *       Version JavaScript cible
 *       ES2022 = JavaScript moderne (2022)
 *       Navigateurs modernes supportent ES2022
 * 
 *    b) "lib": ["ES2022", "dom"]
 *       Bibliothèques TypeScript incluses
 *       - ES2022 : Types JavaScript ES2022
 *       - dom : Types du DOM du navigateur
 *         (document, window, HTMLElement, etc.)
 * 
 * 3. RIGUEUR TYPESCRIPT
 *    ==================
 * 
 *    a) "strict": true
 *       Mode strict ACTIVÉ
 *       Vérifie STRICTEMENT les types
 *       Rend obligatoire de typer tout le code
 *       Prévient les bugs liés aux types
 * 
 *    b) "forceConsistentCasingInFileNames": true
 *       Noms de fichiers cohérents en casse
 *       Linux/Mac : majuscules importantes
 *       Windows : ignore la casse par défaut
 *       Prévient les bugs cross-platform
 * 
 *    c) "noImplicitOverride": true
 *       Force à typer les méthodes override
 *       Prévient les erreurs dans les classes enfants
 * 
 *    d) "noPropertyAccessFromIndexSignature": true
 *       Évite d'accéder aux propriétés via index
 *       Rend le code plus typé et sûr
 * 
 *    e) "noImplicitReturns": true
 *       Force les fonctions à toujours retourner une valeur
 *       Sauf si le type retour est void
 *       Prévient les bugs
 * 
 *    f) "noFallthroughCasesInSwitch": true
 *       Interdit les switch() sans break
 *       Prévient les bugs logiques
 * 
 * 4. SOURCEMAPS
 *    ===========
 * 
 *    "sourceMap": true
 *    Crée des fichiers .map
 *    Permet de déboguer TypeScript dans le navigateur
 *    Mappe le code JS compilé au code TS original
 *    Essentiel pour le débogage
 * 
 * 5. DÉCLARATIONS
 *    =============
 * 
 *    "declaration": false
 *    Ne crée pas de fichiers .d.ts
 *    (déclarations TypeScript pour les libs)
 *    Pour une app web, pas besoin
 * 
 * 6. COMPATIBILITÉ
 *    ==============
 * 
 *    a) "downlevelIteration": true
 *       Supporte les itérateurs en ES5
 *       Permet for...of avec des anciens navigateurs
 * 
 *    b) "experimentalDecorators": true
 *       Active les décorateurs (@ symbol)
 *       ESSENTIAL pour Angular !
 *       Exemples :
 *       @Component() : Définit un composant
 *       @Injectable() : Définit un service
 *       @Input() : Propriété d'entrée
 *       @Output() : Propriété de sortie
 * 
 *    c) "importHelpers": true
 *       Importe les helpers TypeScript
 *       Réduit la taille du code compilé
 *       Utilise tslib au lieu de dupliquer le code
 * 
 *    d) "useDefineForClassFields": false
 *       Utilise la syntaxe JavaScript standard pour les propriétés
 *       Compatible avec Angular
 * 
 * =====================================
 * SECTION "angularCompilerOptions"
 * =====================================
 * 
 * Options spécifiques du compilateur Angular
 * 
 * 1. "enableI18nLegacyMessageIdFormat": false
 *    Utilise le nouveau format pour les messages i18n
 *    (internationalization = support multi-langues)
 * 
 * 2. "strictInjectionParameters": true
 *    Force à typer les paramètres injectés
 *    Injection de dépendances stricte
 *    Prévient les bugs
 * 
 *    Exemple :
 *    constructor(private http: HttpClient)  ← Type spécifié
 * 
 * 3. "strictInputAccessModifiers": true
 *    Force les propriétés @Input/@Output à avoir public/private
 *    Rend le code plus explicite
 * 
 *    Exemple :
 *    @Input() public monProp: string;
 * 
 * 4. "strictTemplates": true
 *    Vérifie les types dans les templates HTML
 *    Détecte les erreurs :
 *    - Propriétés inexistantes
 *    - Types incorrects
 *    - Variables non déclarées
 *    Améliore la sécurité des templates
 * 
 * =====================================
 * EXEMPLE DE COMPILATION
 * =====================================
 * 
 * Fichier source (TypeScript) :
 * 
 *   class MonComposant {
 *     nom: string = "Alice";        // Propriété typée
 *     age: number = 25;              // Propriété typée
 * 
 *     constructor(private http: HttpClient) {}  // Injection typée
 * 
 *     sayHello(): string {            // Type retour spécifié
 *       return `Bonjour ${this.nom}`;
 *     }
 *   }
 * 
 * Après compilation TypeScript → JavaScript :
 * 
 *   class MonComposant {
 *     constructor(http) {             // Types supprimés
 *       this.nom = "Alice";
 *       this.age = 25;
 *       this.http = http;
 *     }
 *     sayHello() {                    // Types supprimés
 *       return `Bonjour ${this.nom}`;
 *     }
 *   }
 * 
 * Le navigateur exécute la version JavaScript
 * Les types TypeScript ne sont que pour la vérification à la compilation
 * 
 * =====================================
 * UTILISATION COURANTE
 * =====================================
 * 
 * 1. Après création du projet, ce fichier est déjà configuré
 *    Pas besoin de le modifier en général
 * 
 * 2. Si vous devez modifier :
 *    - Strict mode : "strict": false (moins rigueur)
 *    - Version cible : "target": "ES2020" (anciens navigs)
 * 
 * 3. VS Code utilise tsconfig.json pour :
 *    - Autocomplétion
 *    - Vérification des types en temps réel
 *    - Détection des erreurs
 * 
 * =====================================
 * FICHIERS COMPLÉMENTAIRES
 * =====================================
 * 
 * - tsconfig.app.json : Configuration pour la compilation de l'app
 * - tsconfig.spec.json : Configuration pour les tests
 * - Héritent tous les deux de tsconfig.json (extends)
 */
