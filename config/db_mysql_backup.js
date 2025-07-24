import dotenv from "dotenv"; // On importe dotenv pour charger les variables d'environnement depuis un fichier .env

import mysql from "mysql2"; // On importe le module mysql2 qui permet de communiquer avec une base MySQL depuis Node.js.
// Ce module est plus performant que le module mysql classique et supporte les promesses.

// Configuration de la connexion à la base de données
dotenv.config(); // charge les variables d'environnement depuis le fichier .env

const db = mysql.createPool({
  /* On crée un "pool" de connexions. 
  // Un pool permet de gérer plusieurs connexions ouvertes en même temps, 
  // ce qui est plus performant qu'ouvrir/fermer une connexion à chaque requête. */

  host: process.env.DB_HOST || "localhost", // Adresse du serveur DB (ex: localhost)
  user: process.env.DB_USER || "admin-user", // Utilisateur DB
  password: process.env.DB_PASSWORD || "Foie1312Flea2512", // Mot de passe DB
  database: process.env.DB_NAME || "soundora", // Nom de la base de données
});
export default db; /*  On exporte ce pool pour pouvoir l'utiliser dans les autres fichiers 
(par ex : dans les contrôleurs pour exécuter des requêtes SQL)
*/
