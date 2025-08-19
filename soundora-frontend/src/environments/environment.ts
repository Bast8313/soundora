// =====================================
// 🆕 FICHIER DE CONFIGURATION ENVIRONNEMENT DÉVELOPPEMENT
// =====================================

/**
 * CONFIGURATION POUR L'ENVIRONNEMENT DE DÉVELOPPEMENT
 * 
 * Ce fichier centralise les paramètres spécifiques au développement local.
 * Il est automatiquement utilisé par Angular CLI lors du build de développement.
 * 
 * UTILITÉ :
 * - Séparation des configurations dev/prod
 * - Facilite les changements d'URL d'API
 * - Évite le hardcoding des URLs dans les services
 * 
 * IMPORTATION DANS LES SERVICES :
 * import { environment } from '../../environments/environment';
 * const apiUrl = environment.apiUrl; // http://localhost:3010/api
 */
export const environment = {
  production: false,                    // 🔧 Mode développement (sourcemaps, debug, etc.)
  apiUrl: 'http://localhost:3010/api'   // 🌐 URL de base pour toutes les requêtes API backend
};
