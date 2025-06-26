const mysql = require("mysql2"); // On importe le module mysql2 qui permet de communiquer avec une base MySQL depuis Node.js.
// Ce module est plus performant que le module mysql classique et supporte les promesses.

// Configuration de la connexion à la base de données
const db = mysql.createPool({
  /* On crée un "pool" de connexions. 
  // Un pool permet de gérer plusieurs connexions ouvertes en même temps, 
  // ce qui est plus performant qu'ouvrir/fermer une connexion à chaque requête. */

  host: "localhost", // Adresse du serveur de base de données
  user: "root", // Nom d'utilisateur de la base de données
  password: "votre_password", // Mot de passe de la base de données ; En production, à placer dans un fichier .env !!!
  database: "mini_shop", // Nom de la base de données à laquelle on se connecte.
});
module.exports =
  db; /*  On exporte ce pool pour pouvoir l'utiliser dans les autres fichiers 
(par ex : dans les contrôleurs pour exécuter des requêtes SQL)
*/
