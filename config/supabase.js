// =====================================
// CONFIGURATION SUPABASE - INITIALISATION
// =====================================
// Ce fichier configure et exporte le client Supabase
// qui sera utilisé par tous les contrôleurs pour :
// - Accéder à la base de données PostgreSQL
// - Gérer l'authentification des utilisateurs
// - Exécuter des requêtes aux tables (products, categories, brands, orders, etc.)

// === IMPORT 1 : Fonction de création du client Supabase ===
// createClient() : Crée une instance cliente pour communiquer avec Supabase
// Permet d'exécuter des opérations :
//   - Lire les données (SELECT via .select())
//   - Ajouter des données (INSERT via .insert())
//   - Modifier les données (UPDATE via .update())
//   - Supprimer les données (DELETE via .delete())
//   - Authentifier les utilisateurs (via .auth)
import { createClient } from '@supabase/supabase-js'

// === IMPORT 2 : Gestion des variables d'environnement ===
// dotenv permet de charger les variables depuis le fichier .env
// Sans cela, les identifiants Supabase ne seraient pas accessibles
import dotenv from 'dotenv'

// === CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ===
// Lit le fichier .env et rend toutes les variables disponibles via process.env
// Les variables définies : SUPABASE_URL, SUPABASE_ANON_KEY, etc.
dotenv.config()

// === RÉCUPÉRATION DES VARIABLES SUPABASE ===
// SUPABASE_URL : L'URL unique de ton projet Supabase
// Exemple : https://xyz123.supabase.co
// Permet d'identifier le serveur Supabase à utiliser
const supabaseUrl = process.env.SUPABASE_URL

// SUPABASE_ANON_KEY : Clé API publique pour les requêtes non authentifiées
// Note : "anon" = anonymous (clé pour les utilisateurs non connectés)
// Cette clé est limitée aux opérations publiques définies dans les Row Level Security (RLS)
// Exemple : lecture des produits visibles publiquement
const supabaseKey = process.env.SUPABASE_ANON_KEY

// === VALIDATION DES VARIABLES D'ENVIRONNEMENT ===
// Vérifie que SUPABASE_URL et SUPABASE_ANON_KEY sont définis
// Si l'une des deux manque → le serveur ne peut pas communiquer avec Supabase
// Donc on lance une erreur pour arrêter le serveur et alerter le développeur
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
  // Message d'erreur si les variables .env ne sont pas configurées
  // Cela indique un problème de configuration du projet
}

// === CRÉATION DU CLIENT SUPABASE ===
// createClient(url, key) : Crée une instance cliente pour Supabase
// Cette instance sera réutilisée dans tous les contrôleurs
// Arguments :
//   - supabaseUrl : L'URL du projet Supabase
//   - supabaseKey : La clé API pour s'authentifier auprès de Supabase
// Retour : Un objet client avec les méthodes :
//   - .from('table').select() : Lire des données
//   - .from('table').insert() : Insérer des données
//   - .from('table').update() : Mettre à jour des données
//   - .from('table').delete() : Supprimer des données
//   - .auth.signUp() / .auth.signIn() : Gérer les utilisateurs
const supabase = createClient(supabaseUrl, supabaseKey)

// === EXPORT DU CLIENT SUPABASE ===
// Exporte le client pour l'utiliser dans les autres fichiers
// Utilisation dans les contrôleurs :
//   import supabase from '../config/supabase.js'
//   const { data, error } = await supabase.from('products').select('*')
export default supabase
