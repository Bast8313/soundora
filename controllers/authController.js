// === IMPORTS NÉCESSAIRES ===
import dotenv from "dotenv"; // Pour charger les variables d'environnement depuis .env
import supabase from "../config/supabase.js"; // Import du client Supabase configuré

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

// =========================================
// === FONCTION D'INSCRIPTION UTILISATEUR ===
// =========================================
/**
 * Fonction d'enregistrement d'un nouvel utilisateur avec Supabase Auth
 *
 * FONCTIONNEMENT :
 * 1. Validation des données d'entrée (email, password, longueur)
 * 2. Appel à l'API Supabase Auth pour créer le compte
 * 3. Supabase gère automatiquement le hashage du mot de passe et la génération du token
 * 4. Retour des informations utilisateur et du token d'accès
 *
 * @param {Request} req - Requête contenant { email, password, first_name, last_name }
 * @param {Response} res - Réponse à renvoyer au client
 */
export const register = async (req, res) => {
  try {
    // === EXTRACTION DES DONNÉES DE LA REQUÊTE ===
    const { email, password, first_name, last_name } = req.body;

    // === VALIDATIONS CÔTÉ SERVEUR ===
    // Validation des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // Validation de la longueur du mot de passe (sécurité)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // === SUPABASE AUTH : CRÉATION DU COMPTE UTILISATEUR ===
    // Supabase gère automatiquement :
    // - Vérification de l'unicité de l'email
    // - Hashage sécurisé du mot de passe
    // - Création dans la table auth.users
    // - Génération du token JWT d'authentification

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // user_metadata : données supplémentaires stockées avec l'utilisateur
        data: {
          first_name: first_name || "", // Prénom (optionnel)
          last_name: last_name || "", // Nom (optionnel)
        },
      },
    });

    // === GESTION DES ERREURS SUPABASE ===
    if (authError) {
      console.error("Erreur Supabase Auth:", authError);

      // Gestion des erreurs spécifiques selon le message d'erreur
      if (authError.message.includes("already registered")) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }

      // Erreur générique de Supabase
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    // SUCCÈS : Utilisateur créé dans auth.users
    // authData.user contient les infos de l'utilisateur
    // authData.session contient le token d'accès

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name: authData.user.user_metadata?.first_name || "",
        last_name: authData.user.user_metadata?.last_name || "",
      },
      // Le token est automatiquement géré par Supabase côté client
      session: authData.session,
    });
  } catch (error) {
    console.error("Erreur serveur register:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

// =========================================
// FONCTION DE CONNEXION AVEC SUPABASE
// =========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données d'entrée
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // SUPABASE AUTH : Connexion utilisateur
    // Supabase gère automatiquement :
    // - Vérification email/password
    // - Génération du token JWT
    // - Gestion de la session
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      console.error("Erreur Supabase Login:", authError);

      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // SUCCÈS : Utilisateur connecté
    // authData.user contient les infos utilisateur
    // authData.session contie nt les tokens (access_token, refresh_token)

    res.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name: authData.user.user_metadata?.first_name || "",
        last_name: authData.user.user_metadata?.last_name || "",
      },
      session: authData.session,
      // Token d'accès pour les requêtes API
      access_token: authData.session.access_token,
    });
  } catch (error) {
    console.error("Erreur serveur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

// =========================================
// FONCTION DE DÉCONNEXION
// =========================================
export const logout = async (req, res) => {
  try {
    // SUPABASE AUTH : Déconnexion
    // Invalide le token et ferme la session
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur logout:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion",
      });
    }

    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur serveur logout:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};

// =========================================
// FONCTION POUR RÉCUPÉRER L'UTILISATEUR ACTUEL
// =========================================
export const getCurrentUser = async (req, res) => {
  try {
    // Le token est passé dans l'en-tête Authorization
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token d'accès requis",
      });
    }

    // SUPABASE AUTH : Vérification du token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
      },
    });
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};
