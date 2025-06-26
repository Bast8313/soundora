const express = require("express"); // On importe le module Express (framework pour simplifier la création de serveur Node.js)

const app = express(); // On crée une instance d'Express
// C'est cette instance (app) qui va servir à définir les routes et configurer le serveur.

app.use(
  express.json()
); /* On ajoute un middleware fourni par Express qui permet de transformer automatiquement 
le corps des requêtes HTTP contenant du JSON en objet JS accessible via req.body.
Sans ça, req.body serait undefined pour les requêtes POST/PUT avec un body JSON.  */

const apiRoutes = require("./routes/api"); /* On importe le fichier de routes des produits (./routes/products.js)
Ce fichier contient les routes dédiées aux opérations sur les produits.
*/

app.use(
  "/products" /* On dit à l'application Express d'utiliser les routes définies dans productRoutes */,
  app.use(
    "/api",
    apiRoutes
  ) /* pour toutes les requêtes qui commencent par /products. */
);

// On peut ajouter d'autres routes ici si besoin, par exemple pour les utilisateurs, les commandes, etc.
app.listen(3000, () => console.log("Serveur démarré sur le port 3000")); // On démarre le serveur sur le port 3000 et on affiche un message dans la console
