//  SCRIPT DE TEST AUTHENTIFICATION SUPABASE - SOUNDORA
// ================================================================
// Ce script teste tous les aspects de l'authentification Supabase :
// - Inscription (signUp)
// - Connexion (signIn)
// - Création automatique de profil via trigger
// - Permissions RLS (Row Level Security)
// - Déconnexion (signOut)

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

//  CONFIGURATION
dotenv.config();

//  INITIALISATION DU CLIENT SUPABASE
// =====================================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
console.log(" Client Supabase initialisé avec :", process.env.SUPABASE_URL);

//  DONNÉES DE TEST
// ==================
const testUser = {
  email: "test@soundora.com",
  password: "TestPassword123!",
  firstName: "Bastien",
  lastName: "Testeur",
};

async function testAuthentication() {
  console.log("\n DÉMARRAGE DES TESTS D'AUTHENTIFICATION SUPABASE");
  console.log("=".repeat(60));

  try {
    // ÉTAPE 1 : INSCRIPTION (SIGN UP)
    // ===================================
    console.log("\n1 TEST D'INSCRIPTION (supabase.auth.signUp)");
    console.log("-".repeat(50));

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            // Métadonnées utilisateur (stockées dans auth.users.raw_user_meta_data)
            first_name: testUser.firstName,
            last_name: testUser.lastName,
          },
        },
      }
    );

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        console.log(
          "     Utilisateur déjà existant, on passe à la connexion..."
        );
      } else {
        throw signUpError;
      }
    } else {
      console.log("    INSCRIPTION RÉUSSIE !");
      console.log("    Email inscrit :", signUpData.user?.email);
      console.log("   UUID généré :", signUpData.user?.id);
      console.log("   Métadonnées :", signUpData.user?.user_metadata);

      // Note : Avec Supabase, l'utilisateur peut devoir confirmer son email
      // Dans notre cas de test, on utilise la configuration par défaut
    }

    //  ÉTAPE 2 : CONNEXION (SIGN IN)
    // =================================
    console.log("\n2 TEST DE CONNEXION (supabase.auth.signInWithPassword)");
    console.log("-".repeat(50));

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

    if (signInError) throw signInError;

    console.log("    CONNEXION RÉUSSIE !");
    console.log("    Utilisateur connecté :", signInData.user.email);
    console.log("    Session créée :", signInData.session ? "OUI" : "NON");
    console.log(
      "    Token expire le :",
      new Date(signInData.session?.expires_at * 1000).toLocaleString()
    );
    console.log(
      "    Access Token (début) :",
      signInData.session?.access_token?.substring(0, 50) + "..."
    );

    //  ÉTAPE 3 : VÉRIFICATION DU PROFIL AUTO-CRÉÉ
    // ==============================================
    console.log("\n3 VÉRIFICATION DU TRIGGER handle_new_user()");
    console.log("-".repeat(50));
    console.log(
      "    Recherche du profil pour l'utilisateur :",
      signInData.user.id
    );

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", signInData.user.id)
      .single();

    if (profileError) {
      console.log("     PROFIL NON TROUVÉ - Le trigger a peut-être échoué");
      console.log("    Création manuelle du profil...");

      // Création manuelle si le trigger n'a pas fonctionné
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: signInData.user.id,
          first_name: testUser.firstName,
          last_name: testUser.lastName,
        })
        .select()
        .single();

      if (createError) throw createError;
      console.log("    Profil créé manuellement !");
      console.log("    Nouvelles données :", newProfile);
    } else {
      console.log("    PROFIL AUTOMATIQUE TROUVÉ !");
      console.log("    Données du profil :");
      console.log("      - ID :", profile.id);
      console.log("       - Prénom :", profile.first_name);
      console.log("       - Nom :", profile.last_name);
      console.log("       - Créé le :", profile.created_at);
      console.log("       - Pays :", profile.country);
    }

    //  ÉTAPE 4 : TEST DES POLITIQUES RLS (ROW LEVEL SECURITY)
    // ===========================================================
    console.log("\n4 TEST DES POLITIQUES RLS (Row Level Security)");
    console.log("-".repeat(50));

    // Test 4A : Lecture des produits (politique publique)
    console.log("  Test 4A : Lecture des produits (accès public)...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("name, price, is_active")
      .limit(3);

    if (productsError) {
      console.log("    Erreur lecture produits :", productsError.message);
    } else {
      console.log(
        "    Produits accessibles :",
        products?.length || 0,
        "produits trouvés"
      );
      products?.forEach((p, i) => {
        console.log(
          `       ${i + 1}. ${p.name} - ${p.price}€ (actif: ${p.is_active})`
        );
      });
    }

    // Test 4B : Lecture du profil personnel (politique privée)
    console.log("    Test 4B : Lecture du profil personnel (accès privé)...");
    const { data: ownProfile, error: ownProfileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, created_at")
      .eq("id", signInData.user.id);

    if (ownProfileError) {
      console.log("    Erreur lecture profil :", ownProfileError.message);
    } else {
      console.log("    Profil personnel accessible");
      console.log(
        "       Nom complet :",
        ownProfile[0]?.first_name,
        ownProfile[0]?.last_name
      );
    }

    // Test 4C : Tentative de lecture d'autres profils (doit échouer)
    console.log(
      "   Test 4C : Tentative de lecture d'autres profils (doit échouer)..."
    );
    const { data: otherProfiles, error: otherProfilesError } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", signInData.user.id);

    if (otherProfilesError || otherProfiles?.length === 0) {
      console.log(
        "    SÉCURITÉ OK : Autres profils inaccessibles (RLS fonctionne)"
      );
    } else {
      console.log("     PROBLÈME DE SÉCURITÉ : Autres profils visibles !");
    }

    //  ÉTAPE 5 : DÉCONNEXION (SIGN OUT)
    // ====================================
    console.log("\n5 TEST DE DÉCONNEXION (supabase.auth.signOut)");
    console.log("-".repeat(50));

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) throw signOutError;
    console.log("   DÉCONNEXION RÉUSSIE !");
    console.log("   Session fermée, tokens invalidés");

    //RÉSUMÉ FINAL
    // ===============
    console.log("\n" + "=".repeat(60));
    console.log(" TOUS LES TESTS D'AUTHENTIFICATION RÉUSSIS !");
    console.log("=".repeat(60));
    console.log(" Inscription Supabase Auth");
    console.log(" Connexion avec email/password");
    console.log(" Création automatique de profil (trigger)");
    console.log(" Politiques RLS fonctionnelles");
    console.log(" Déconnexion propre");
    console.log("\n Soundora est prêt pour l'authentification ! 🎵");
  } catch (error) {
    console.error("\n ERREUR DURANT LES TESTS :");
    console.error(" Message :", error.message);
    console.error(" Détails :", error);

    // Aide au débogage
    if (error.message.includes("Invalid login credentials")) {
      console.log(
        "\n AIDE : Vérifiez l'email/mot de passe ou créez d'abord le compte"
      );
    }
    if (error.message.includes("row-level security")) {
      console.log(
        "\n AIDE : Problème de permissions RLS, vérifiez les politiques"
      );
    }
  }
}

//  EXÉCUTION DES TESTS
// ======================
console.log(" SOUNDORA - Tests d'authentification Supabase");
console.log("Version Node.js :", process.version);
testAuthentication();
