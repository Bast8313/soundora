// =====================================
// 🆕 FICHIER DE CONFIGURATION ENVIRONNEMENT PRODUCTION
// =====================================

/**
 * CONFIGURATION POUR L'ENVIRONNEMENT DE PRODUCTION
 * 
 * Ce fichier est utilisé lors du build de production (ng build --prod).
 * Il contient les paramètres optimisés pour le déploiement.
 * 
 * DIFFÉRENCES AVEC DEVELOPMENT :
 * - production: true (optimisations activées)
 * - apiUrl: URL du serveur de production
 * - Pas de console.log en production
 * - Minification et tree-shaking activés
 * 
 * EXEMPLE D'USAGE PRODUCTION :
 * apiUrl: 'https://api.soundora.com/api'
 */
export const environment = {
  production: true,                     // Mode production (optimisations activées)
  apiUrl: 'http://localhost:3010/api'   // URL API (à changer pour production réelle)
};
