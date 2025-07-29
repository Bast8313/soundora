// === IMPORT DU CLIENT SUPABASE ===
import supabase from "../config/supabase.js"; // Import du client Supabase configuré

/**
 * === MIDDLEWARE D'AUTHENTIFICATION SUPABASE ===
 * Middleware Express pour vérifier le token Supabase dans l'en-tête Authorization.
 * 
 * FONCTIONNEMENT :
 * 1. Récupère le token depuis l'en-tête "Authorization: Bearer <token>"
 * 2. Utilise l'API Supabase pour vérifier la validité du token
 * 3. Si valide : ajoute l'utilisateur dans req.user et continue
 * 4. Si invalide : renvoie une erreur 401 Unauthorized
 * 
 * @param {Request} req - Objet requête Express
 * @param {Response} res - Objet réponse Express  
 * @param {NextFunction} next - Fonction pour passer au middleware suivant
 */
const checkSupabaseAuth = async (req, res, next) => {
  try {
    // === RÉCUPÉRATION DU TOKEN ===
    const authHeader = req.headers.authorization; // Récupère l'en-tête Authorization

    if (!authHeader) {
      // Si aucun header Authorization n'est présent, bloque la requête
      return res.status(401).json({ 
        success: false,
        message: "Token d'accès requis" 
      });
    }

    // Récupère le token au format "Bearer <token>"
    // replace() est plus robuste que split() pour ce cas
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Format du token invalide" 
      });
    }

    // === VÉRIFICATION AVEC SUPABASE ===
    // Utilise l'API Supabase Auth pour vérifier le token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Erreur de vérification token:", error);
      return res.status(401).json({ 
        success: false,
        message: "Token invalide ou expiré" 
      });
    }

    // === SUCCÈS : AJOUT DE L'UTILISATEUR DANS LA REQUÊTE ===
    // Ajoute l'utilisateur dans req.user pour les routes suivantes
    // Structure standardisée des données utilisateur
    req.user = {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
    };

    // Passe au middleware ou contrôleur suivant
    next(); 
  } catch (error) {
    // === GESTION DES ERREURS INATTENDUES ===
    console.error("Erreur middleware auth:", error);
    return res.status(500).json({ 
      success: false,
      message: "Erreur interne du serveur" 
    });
  }
};

// Export du middleware pour utilisation dans les routes
export default checkSupabaseAuth;
