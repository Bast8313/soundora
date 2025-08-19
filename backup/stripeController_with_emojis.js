// =====================================
// CONTROLLER STRIPE POUR SOUNDORA
// =====================================
// 
// OBJECTIF PRINCIPAL :
// Gérer l'intégralité du processus de paiement avec Stripe Checkout
// depuis la création de session jusqu'à la confirmation via webhook
//
// FONCTIONNALITÉS INCLUSES :
// - Création de sessions de paiement Stripe à partir du panier Soundora
// - Gestion sécurisée des webhooks pour confirmer les paiements
// - Vérification du statut des sessions de paiement
// - Routes de test pour le développement et validation
//
// SÉCURITÉ IMPLÉMENTÉE :
// - Validation stricte des données reçues (panier + email)
// - Vérification cryptographique des signatures webhook Stripe
// - Gestion d'erreurs robuste avec classification par type
// - Protection contre les doublons de commandes
//
// GESTION MONÉTAIRE :
// - Conversion automatique euros ↔ centimes (format Stripe)
// - Calculs précis avec Math.round() pour éviter les erreurs d'arrondi
// - Support des quantités multiples par article
//
// INTÉGRATION SUPABASE :
// - Création automatique des commandes dans la table 'orders'
// - Détail des articles dans la table 'order_items' 
// - Conservation des métadonnées pour traçabilité complète
// =====================================

// IMPORTS DES DÉPENDANCES
import Stripe from "stripe";                      // SDK officiel Stripe pour Node.js
import supabase from "../config/supabase.js";     // Client Supabase pour la base de données (EXPORT DEFAULT)

// INITIALISATION CLIENT STRIPE
// Utilise la clé secrète depuis les variables d'environnement (.env)
// SÉCURITÉ : Cette clé ne doit JAMAIS être exposée côté client !
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * =============================================
 * CRÉATION D'UNE SESSION CHECKOUT STRIPE
 * =============================================
 *
 * RÔLE PRINCIPAL :
 * Transforme le panier Soundora (articles + quantités) en session de paiement Stripe
 * sécurisée et prête à recevoir les informations de paiement du client.
 *
 * PROCESSUS DÉTAILLÉ :
 * 1. Extraction et validation des données reçues (panier + email)
 * 2. Conversion format Soundora → format Stripe (line_items)
 * 3. Calcul du total de commande pour les logs de développement
 * 4. Création de la session Stripe avec configuration complète
 * 5. Retour de l'URL de paiement au frontend Angular
 *
 * SÉCURITÉ IMPLÉMENTÉE :
 * - Route protégée par authentification Supabase (middleware)
 * - Validation stricte des données reçues (types + contenu)
 * - Gestion d'erreurs détaillée selon le type d'erreur Stripe
 * - Logs de debug complets pour traçabilité
 *
 * GESTION FINANCIÈRE :
 * - Conversion prix euros → centimes (format obligatoire Stripe)
 * - Support quantités multiples par article
 * - Validation montants > 0 pour éviter les erreurs
 *
 * CONFIGURATION INTERNATIONALE :
 * - Interface en français (locale: "fr")
 * - Devise en euros (currency: "eur")
 * - Livraison limitée à l'Europe de l'Ouest
 *
 * @param {Object} req - Requête Express contenant cartItems et userEmail
 * @param {Object} res - Réponse Express avec l'URL de paiement ou erreur
 */
export const createCheckoutSession = async (req, res) => {
  try {
    // ==========================================
    // ÉTAPE 1 : EXTRACTION DES DONNÉES DE LA REQUÊTE
    // ==========================================
    
    // RÉCUPÉRATION DES DONNÉES DEPUIS LE FRONTEND ANGULAR
    // cartItems = tableau des articles avec {id, name, price, quantity, brands, categories...}
    // userEmail = email de l'utilisateur connecté pour pré-remplir Stripe
    const { cartItems, userEmail } = req.body;

    // LOGS DE DEBUG POUR LE DÉVELOPPEMENT
    // Permettent de tracer les sessions de paiement créées
    console.log("Creation session Stripe pour:", userEmail);
    console.log("Nombre d'articles:", cartItems?.length || 0);

    // ==========================================
    // ÉTAPE 2 : VALIDATION STRICTE DES DONNÉES REÇUES
    // ==========================================
    
    // VALIDATION DU PANIER - SÉCURITÉ CRITIQUE
    // Cette vérification empêche la création de sessions Stripe vides ou malformées
    // 
    // !cartItems : Vérifie que la propriété existe (pas undefined/null)
    // !Array.isArray(cartItems) : S'assure que c'est bien un tableau (pas un objet ou string)
    // cartItems.length === 0 : Empêche les paniers vides de créer des sessions
    // 
    // SANS CETTE VALIDATION : Stripe générerait une erreur 400 côté serveur
    // et l'utilisateur verrait un message d'erreur cryptique
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le panier est vide ou invalide", // Message utilisateur friendly
      });
    }

    // VALIDATION EMAIL UTILISATEUR - OBLIGATOIRE POUR STRIPE
    // Stripe Checkout nécessite un email pour plusieurs raisons critiques :
    // 1. Pré-remplir le formulaire de paiement (UX améliorée)
    // 2. Envoyer le reçu de paiement automatiquement
    // 3. Identifier le client dans le dashboard Stripe
    // 4. Créer la commande dans Supabase avec l'email correct
    // 5. Permettre la liaison avec le compte utilisateur Soundora
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: "Email utilisateur requis", // Empêche les sessions anonymes
      });
    }

    // ==========================================
    // ÉTAPE 3 : CONVERSION PANIER SOUNDORA → FORMAT STRIPE
    // ==========================================
    
    // TRANSFORMATION CRITIQUE : DONNÉES SOUNDORA → STRIPE LINE_ITEMS
    // Chaque article du panier Soundora doit être converti au format exact attendu par Stripe
    // Cette étape est CRUCIALE car Stripe ne comprend que son propre format de données
    // Structure requise : { price_data: { currency, product_data, unit_amount }, quantity }
    const lineItems = cartItems.map((item) => {
      // ============================================
      // VALIDATION INDIVIDUELLE DE CHAQUE ARTICLE
      // ============================================
      
      // VÉRIFICATION DES PROPRIÉTÉS MINIMALES REQUISES
      // item.name : Nom du produit (obligatoire pour l'affichage Stripe)
      // item.price : Prix unitaire (obligatoire pour le calcul total)
      // SANS CES DONNÉES : L'API Stripe retournerait une erreur 400
      // avec un message cryptique que l'utilisateur ne comprendrait pas
      if (!item.name || !item.price) {
        throw new Error(`Article invalide manquant nom/prix: ${JSON.stringify(item)}`);
      }

      // ============================================
      // CONSTRUCTION DE L'OBJET STRIPE LINE_ITEM
      // ============================================
      
      // STRUCTURE EXACTE ATTENDUE PAR L'API STRIPE CHECKOUT SESSIONS
      // Documentation : https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items
      return {
        price_data: {
          // ===== CONFIGURATION RÉGIONALE =====
          
          // DEVISE EUROPÉENNE - Configuration pour le marché français
          currency: "eur", // Devise européenne pour le marché français de Soundora
          
          product_data: {
            // ===== INFORMATIONS PRODUIT =====
            
            // CONSTRUCTION DU NOM PRODUIT COMPLET
            // Combine la marque + nom pour un affichage professionnel dans Stripe
            // Exemples : "Gibson Les Paul Studio", "Fender Stratocaster", "Roland TD-17"
            // .trim() supprime les espaces en trop si la marque est manquante
            name: `${item.brands?.name || ""} ${item.name}`.trim(),

            // DESCRIPTION AVEC FALLBACK EN CASCADE
            // Priorité 1 : short_description (optimisée pour l'affichage)
            // Priorité 2 : description (description complète)
            // Priorité 3 : Texte générique (assure qu'il y a toujours une description)
            description:
              item.short_description ||      // Description courte (priorité 1)
              item.description ||            // Description complète (priorité 2)
              "Instrument de musique",       // Fallback générique (priorité 3)

            // GESTION DES IMAGES PRODUIT
            // Stripe accepte un tableau d'URLs d'images pour l'affichage
            // [0] = première image du produit Soundora (image principale)
            // Fallback sur image par défaut si aucune image disponible
            images: [item.images?.[0] || "/assets/images/no-image.jpg"],

            // MÉTADONNÉES SOUNDORA → STRIPE
            // Ces données permettent la réconciliation entre Stripe et Supabase
            // Elles seront conservées lors du webhook pour recréer la commande complète
            metadata: {
              product_id: item.id || "",                    // ID produit Soundora (pour lien Supabase)
              sku: item.sku || "",                          // Référence produit (gestion stock)
              category: item.categories?.name || "",        // Catégorie musicale (guitares, batteries, claviers...)
              brand: item.brands?.name || "",               // Marque de l'instrument (Gibson, Fender, Roland...)
            },
          },
          
          // ===== CONVERSION PRIX CRITIQUE : EUROS → CENTIMES =====
          
          // CONVERSION MONÉTAIRE OBLIGATOIRE POUR STRIPE
          // RÈGLE FONDAMENTALE : Stripe travaille UNIQUEMENT en centimes !
          // 
          // Exemples de conversion :
          // • 1299.00€ → 129900 centimes
          // • 49.99€  → 4999 centimes  
          // • 10.50€  → 1050 centimes
          // 
          // Math.round() évite les erreurs d'arrondis JavaScript :
          // • Sans round() : 49.99 * 100 = 4998.999... (erreur !)
          // • Avec round() : Math.round(49.99 * 100) = 4999 (correct !)
          unit_amount: Math.round(item.price * 100),
        },
        
        // ===== QUANTITÉ DANS LE PANIER =====
        
        // QUANTITÉ DE CET ARTICLE COMMANDÉ
        // Fallback sur 1 si quantité non spécifiée (sécurité)
        // Stripe multipliera automatiquement unit_amount × quantity
        quantity: item.quantity || 1,
      };
    });

    // ==========================================
    // ÉTAPE 4 : CALCUL DU TOTAL POUR LES LOGS DE DEBUG
    // ==========================================
    
    // CALCUL DU MONTANT TOTAL DE LA COMMANDE
    // Utilise Array.reduce() pour sommer tous les articles du panier
    // sum = accumulateur (total progressif), item = article courant
    // Formule : prix_unitaire × quantité pour chaque article
    // Ce calcul est UNIQUEMENT pour les logs - Stripe calculera le vrai total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1), // Fallback quantity = 1
      0 // Valeur initiale de l'accumulateur
    );

    // LOG DE DEBUG POUR LE DÉVELOPPEMENT
    // Permet de vérifier que le total est cohérent avant envoi à Stripe
    console.log("Total commande:", totalAmount, "EUR");

    // ==========================================
    // 🚀 ÉTAPE 5 : CRÉATION DE LA SESSION STRIPE CHECKOUT
    // ==========================================
    
    // APPEL API STRIPE POUR CRÉER UNE SESSION DE PAIEMENT 🚀
    // Cette session génère une URL de paiement sécurisée hébergée par Stripe
    // L'utilisateur sera redirigé vers cette URL pour finaliser son achat
    const session = await stripe.checkout.sessions.create({
      
      // ===== CONFIGURATION DE BASE OBLIGATOIRE =====
      
      // TYPES DE PAIEMENT ACCEPTÉS 💳
      // ["card"] = uniquement cartes bancaires (Visa, MasterCard, Amex...)
      // Autres options possibles : "ideal", "bancontact", "giropay"...
      payment_method_types: ["card"],
      
      // ARTICLES CONVERTIS AU FORMAT STRIPE 📦
      // lineItems créé à l'étape précédente avec tous les produits du panier
      line_items: lineItems,
      
      // MODE DE PAIEMENT 🔄
      // "payment" = paiement unique (vs "subscription" pour abonnements)
      // Adapté au modèle e-commerce de Soundora (vente d'instruments)
      mode: "payment",

      // ===== INFORMATIONS CLIENT =====
      
      // EMAIL PRÉ-REMPLI DANS LE FORMULAIRE STRIPE 📧
      // Améliore l'UX : le client n'a pas à re-saisir son email
      // Stripe utilisera cet email pour les reçus automatiques
      customer_email: userEmail,

      // ===== URLS DE REDIRECTION APRÈS PAIEMENT =====
      
      // PAGE DE SUCCÈS APRÈS PAIEMENT CONFIRMÉ ✅
      // {CHECKOUT_SESSION_ID} = placeholder remplacé automatiquement par Stripe
      // Permet à Angular de récupérer les détails de la commande
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      
      // PAGE DE RETOUR EN CAS D'ANNULATION ❌
      // Ramène l'utilisateur à son panier pour qu'il puisse réessayer
      cancel_url: `${process.env.FRONTEND_URL}/cart`,

      // ===== MÉTADONNÉES POUR LE WEBHOOK ET LE SUIVI =====
      
      // DONNÉES PERSONNALISÉES TRANSMISES AU WEBHOOK 📊
      // Ces informations seront disponibles lors du traitement du webhook
      // ⚠️ LIMITATION STRIPE : Les valeurs doivent être des strings uniquement
      metadata: {
        user_email: userEmail,                        // Email pour création commande Supabase
        order_source: "soundora_website",             // Source de la commande (vs app mobile)
        cart_total: totalAmount.toString(),           // Total calculé (conversion string obligatoire)
        items_count: cartItems.length.toString(),     // Nombre d'articles (pour validation)
      },

      // ===== PERSONNALISATION DE L'INTERFACE STRIPE =====
      
      // LOCALISATION EN FRANÇAIS 🇫🇷
      // Interface Stripe entièrement en français pour les clients français
      locale: "fr",
      
      // COLLECTE D'ADRESSE DE FACTURATION OBLIGATOIRE 🏠
      // Nécessaire pour la comptabilité et la conformité fiscale
      billing_address_collection: "required",

      // COLLECTE D'ADRESSE DE LIVRAISON + PAYS AUTORISÉS 🚚
      // Configuration des pays de livraison pour Soundora
      // Limité à l'Europe de l'Ouest pour commencer (logistique simplifiée)
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "ES", "IT"], // Europe de l'Ouest
      },

      // ===== CONFIGURATION AVANCÉE POUR LE SUIVI =====
      
      // MÉTADONNÉES SUPPLÉMENTAIRES POUR LE PAYMENTINTENT 💡
      // Ces données sont également accessibles via l'API Stripe
      // Utiles pour les analyses et le support client
      payment_intent_data: {
        metadata: {
          order_source: "soundora",                   // Identification claire de la source
          total_items: cartItems.length.toString(),   // Nombre d'articles pour validation croisée
        },
      },
    });

    // LOG DE CONFIRMATION CÔTÉ SERVEUR ✅
    // Permet de tracer la création de session dans les logs serveur
    console.log("🎉 Session Stripe créée:", session.id);

    // ==========================================
    // 📤 ÉTAPE 6 : RÉPONSE DE SUCCÈS AU FRONTEND ANGULAR
    // ==========================================
    
    // RÉPONSE JSON STRUCTURÉE POUR LE CLIENT ANGULAR 📤
    // Cette réponse contient tout ce dont Angular a besoin pour rediriger l'utilisateur
    res.json({
      success: true,                    // Flag de succès pour la gestion d'erreurs côté client
      sessionId: session.id,            // ID de session pour le suivi et la vérification ultérieure
      checkoutUrl: session.url,         // URL de paiement Stripe où rediriger l'utilisateur
      message: "Session de paiement créée avec succès", // Message de confirmation
    });

  } catch (error) {
    // ==========================================
    // ❌ GESTION D'ERREURS DÉTAILLÉE PAR TYPE STRIPE
    // ==========================================
    
    // LOG D'ERREUR POUR LE DEBUGGING 🔍
    console.error("❌ Erreur Stripe Checkout:", error);

    // CLASSIFICATION DES ERREURS SELON LES TYPES STRIPE 🏷️
    // Permet de donner des messages d'erreur appropriés à l'utilisateur
    let errorMessage = "Erreur lors de la création du paiement"; // Message par défaut

    // TYPES D'ERREURS STRIPE ET MESSAGES CORRESPONDANTS :
    if (error.type === "StripeCardError") {
      // Problème avec la carte bancaire (fonds insuffisants, carte expirée...)
      errorMessage = "Erreur de carte bancaire";
    } else if (error.type === "StripeRateLimitError") {
      // Limite de requêtes par seconde atteinte
      errorMessage = "Trop de requêtes, veuillez réessayer";
    } else if (error.type === "StripeInvalidRequestError") {
      // Données de requête invalides (problème dans notre code)
      errorMessage = "Requête invalide";
    } else if (error.type === "StripeAPIError") {
      // Problème côté serveur Stripe (rare)
      errorMessage = "Erreur temporaire du service de paiement";
    } else if (error.type === "StripeConnectionError") {
      // Problème réseau entre notre serveur et Stripe
      errorMessage = "Erreur de connexion au service de paiement";
    } else if (error.type === "StripeAuthenticationError") {
      // Clé API Stripe invalide ou expirée
      errorMessage = "Erreur d'authentification du service de paiement";
    }

    // RÉPONSE D'ERREUR AVEC DÉTAILS EN MODE DÉVELOPPEMENT 🔧
    // En production, on masque les détails pour la sécurité
    res.status(500).json({
      success: false,
      error: errorMessage,
      // En développement, on affiche le message d'erreur complet pour le debugging
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * =============================================
 * 🎣 WEBHOOK STRIPE - CONFIRMATION PAIEMENT
 * =============================================
 *
 * 🎯 RÔLE CRITIQUE :
 * Stripe appelle cette URL automatiquement quand un paiement est confirmé.
 * Cette fonction transforme la notification Stripe en commande Supabase complète.
 *
 * 🔐 SÉCURITÉ OBLIGATOIRE :
 * ✅ Vérification cryptographique de la signature Stripe (anti-contrefaçon)
 * ✅ Protection contre les attaques par rejeu
 * ✅ Validation de l'unicité des commandes
 *
 * 📡 ÉVÉNEMENTS GÉRÉS :
 * • checkout.session.completed : Paiement réussi → Créer la commande
 * • payment_intent.payment_failed : Paiement échoué → Logger l'échec
 * • checkout.session.expired : Session expirée → Nettoyer si nécessaire
 *
 * 🗄️ LOGIQUE DE CRÉATION DE COMMANDE COMPLÈTE :
 * 1. 🔐 Vérification de la signature Stripe (sécurité absolue)
 * 2. 📦 Traitement de l'événement checkout.session.completed
 * 3. 🔍 Récupération des détails complets de la session + line_items
 * 4. 🏗️ Construction de l'objet commande avec toutes les données
 * 5. 💾 Création de l'enregistrement dans la table 'orders'
 * 6. 📦 Création des enregistrements détaillés dans 'order_items'
 * 7. 📊 Logging complet pour debugging et traçabilité
 *
 * @param {Object} req - Requête Express avec signature Stripe et body raw
 * @param {Object} res - Réponse Express (obligatoire 200 pour Stripe)
 */
export const stripeWebhook = async (req, res) => {
  // ==========================================
  // 🔐 RÉCUPÉRATION DE LA SIGNATURE STRIPE
  // ==========================================
  
  // EXTRACTION DE LA SIGNATURE DEPUIS LES HEADERS HTTP 🔑
  // Cette signature est générée par Stripe avec une clé secrète partagée
  // Elle garantit que la requête vient bien de Stripe et n'a pas été modifiée
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ==========================================
    // 🛡️ VÉRIFICATION SIGNATURE STRIPE (SÉCURITÉ CRITIQUE)
    // ==========================================
    
    // CONSTRUCTION ET VÉRIFICATION DE L'ÉVÉNEMENT AVEC LA SIGNATURE 🔒
    // Cette étape est OBLIGATOIRE pour éviter les faux webhooks
    // req.body = contenu brut de la requête (pas de JSON parsing)
    // sig = signature envoyée par Stripe
    // STRIPE_WEBHOOK_SECRET = clé secrète configurée dans .env
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // ERREUR DE SIGNATURE = REQUÊTE SUSPECTE ⚠️
    console.error("❌ Webhook signature invalide:", err.message);
    // Retour immédiat avec erreur 400 pour rejeter la requête
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // LOG DE RÉCEPTION WEBHOOK VALIDE ✅
  console.log("🎉 Webhook Stripe reçu:", event.type);

  // ==========================================
  // 🎯 TRAITEMENT DES ÉVÉNEMENTS STRIPE
  // ==========================================
  
  // SWITCH SUR LE TYPE D'ÉVÉNEMENT REÇU 🔀
  switch (event.type) {
    case "checkout.session.completed":
      // ===== 💰 PAIEMENT CONFIRMÉ ET RÉUSSI =====
      
      // RÉCUPÉRATION DES DONNÉES DE LA SESSION 📦
      const session = event.data.object;
      
      // LOGS IMMÉDIATS POUR CONFIRMATION 🎊
      console.log("💰 PAIEMENT CONFIRMÉ !");
      console.log("📧 Email client:", session.customer_email);
      console.log("💶 Montant:", session.amount_total / 100, "€");
      console.log("🆔 Session ID:", session.id);

      try {
        // ==========================================
        // 🔍 ÉTAPE 1 : RÉCUPÉRATION DES DÉTAILS COMPLETS DE LA SESSION
        // ==========================================
        
        // RÉCUPÉRATION APPROFONDIE DES DONNÉES STRIPE 📋
        // Le webhook ne contient que les informations de base
        // On doit faire un appel API pour récupérer les line_items (articles achetés)
        console.log("🔍 Récupération des détails complets de la session...");

        const detailedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            // EXPANSION STRIPE POUR RÉCUPÉRER TOUS LES DÉTAILS 📈
            // line_items : Les articles achetés
            // line_items.data.price.product : Détails complets des produits
            expand: ["line_items", "line_items.data.price.product"],
          }
        );

        console.log("📦 Nombre d'articles:", detailedSession.line_items.data.length);

        // ==========================================
        // 🏗️ ÉTAPE 2 : CONSTRUCTION DES DONNÉES POUR LA COMMANDE SUPABASE
        // ==========================================
        
        // PRÉPARATION DE L'OBJET COMMANDE COMPLET 🗄️
        const orderData = {
          // ===== IDENTIFIANTS STRIPE =====
          
          // 🔗 LIENS BIDIRECTIONNELS STRIPE ↔ SUPABASE
          stripe_session_id: session.id,                    // ID session pour retrouver dans Stripe
          stripe_payment_intent_id: session.payment_intent, // ID payment intent pour remboursements

          // ===== INFORMATIONS CLIENT =====
          
          // 📧 EMAIL DU CLIENT (provenant de la session Stripe)
          user_email: session.customer_email,
          // user_id: null, // TODO: Lier avec l'utilisateur Supabase si connecté

          // ===== MONTANTS ET DEVISE =====
          
          // 💰 MONTANT TOTAL AVEC CONVERSION CENTIMES → EUROS
          // Stripe envoie en centimes, on stocke en euros dans Supabase
          total_amount: session.amount_total / 100, // Conversion obligatoire
          currency: session.currency || "eur",      // Devise (normalement toujours EUR)

          // ===== STATUTS DE LA COMMANDE =====
          
          // ✅ STATUTS CONFIRMÉS APRÈS PAIEMENT RÉUSSI
          payment_status: "completed",  // Paiement confirmé par Stripe
          order_status: "confirmed",    // Commande confirmée, en attente de traitement logistique

          // ===== ADRESSES DE FACTURATION ET LIVRAISON =====
          
          // 🏠 ADRESSE DE FACTURATION (collectée par Stripe)
          // Stockée au format JSON pour flexibilité
          billing_address: session.customer_details
            ? {
                name: session.customer_details.name,       // Nom complet
                email: session.customer_details.email,     // Email de facturation
                phone: session.customer_details.phone,     // Téléphone
                address: session.customer_details.address, // Adresse complète
              }
            : null, // Null si pas d'adresse collectée

          // 🚚 ADRESSE DE LIVRAISON (collectée par Stripe)
          shipping_address: session.shipping_details
            ? {
                name: session.shipping_details.name,       // Nom pour livraison
                address: session.shipping_details.address, // Adresse de livraison
              }
            : null, // Null si pas d'adresse de livraison

          // ===== MÉTADONNÉES ENRICHIES =====
          
          // 📊 COMBINAISON DES MÉTADONNÉES + DONNÉES DE TRAÇABILITÉ
          metadata: {
            ...session.metadata,                          // Métadonnées définies lors de la création
            stripe_session_created: session.created,     // Timestamp création session
            stripe_session_expires: session.expires_at,  // Timestamp expiration
            webhook_processed_at: new Date().toISOString(), // Timestamp traitement webhook
            payment_method_types: session.payment_method_types, // Types de paiement utilisés
          },
        };

        // LOG DES DONNÉES PRÉPARÉES 📋
        console.log("📝 Données de commande préparées:", {
          email: orderData.user_email,
          total: orderData.total_amount,
          items_count: detailedSession.line_items.data.length,
        });

        // ==========================================
        // 🔒 ÉTAPE 3 : VÉRIFICATION DE L'UNICITÉ DE LA COMMANDE
        // ==========================================
        
        // PROTECTION CONTRE LES DOUBLONS 🛡️
        // S'assurer qu'on ne crée pas deux fois la même commande
        // (Stripe peut parfois renvoyer le même webhook plusieurs fois)
        console.log("🔒 Vérification de l'unicité de la commande...");

        const { data: existingOrder, error: checkError } = await supabase
          .from("orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .single(); // .single() car on attend max 1 résultat

        // SI LA COMMANDE EXISTE DÉJÀ ⚠️
        if (existingOrder) {
          console.log("⚠️ Commande déjà existante pour cette session:", existingOrder.id);
          // Retour avec succès mais sans traitement (idempotence)
          return res.json({ received: true, status: "already_processed" });
        }

        // GESTION D'ERREURS DE VÉRIFICATION 🔍
        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116 = "row not found" = normal (pas de doublon)
          // Autres erreurs = problème de base de données
          throw new Error(`Erreur vérification unicité: ${checkError.message}`);
        }

        // ==========================================
        // 💾 ÉTAPE 4 : CRÉATION DE LA COMMANDE DANS SUPABASE
        // ==========================================
        
        // INSERTION DE LA COMMANDE PRINCIPALE 🗄️
        console.log("💾 Création de la commande dans Supabase...");

        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert([orderData])          // Insertion avec toutes les données
          .select()                     // Récupération de l'enregistrement créé
          .single();                    // Un seul enregistrement attendu

        // GESTION D'ERREUR DE CRÉATION ❌
        if (orderError) {
          throw new Error(`Erreur création commande: ${orderError.message}`);
        }

        // LOG DE SUCCÈS AVEC ID GÉNÉRÉ ✅
        console.log("✅ Commande créée avec l'ID:", newOrder.id);

        // ==========================================
        // 📦 ÉTAPE 5 : CRÉATION DES ITEMS DE COMMANDE DÉTAILLÉS
        // ==========================================
        
        // CRÉATION DES ARTICLES DÉTAILLÉS 🛍️
        console.log("📦 Création des items de commande...");

        const orderItems = []; // Tableau pour stockage batch

        // BOUCLE SUR CHAQUE ARTICLE ACHETÉ 🔄
        for (const lineItem of detailedSession.line_items.data) {
          const product = lineItem.price.product; // Produit Stripe

          // CONSTRUCTION DE L'ITEM DÉTAILLÉ 🏗️
          const itemData = {
            order_id: newOrder.id, // Lien avec la commande principale

            // ===== INFORMATIONS PRODUIT SOUNDORA =====
            
            // 🔗 RÉCUPÉRATION DEPUIS LES MÉTADONNÉES STRIPE
            // Ces données ont été stockées lors de la création de session
            product_id: product.metadata?.product_id
              ? parseInt(product.metadata.product_id) // Conversion string → int
              : null, // Null si pas d'ID Soundora
            product_name: product.name,                        // Nom complet du produit
            product_sku: product.metadata?.sku || null,        // Référence produit
            brand_name: product.metadata?.brand || null,       // Marque
            category_name: product.metadata?.category || null, // Catégorie

            // ===== PRIX ET QUANTITÉ =====
            
            // 💰 CONVERSION CENTIMES → EUROS POUR STOCKAGE
            unit_price: lineItem.price.unit_amount / 100,  // Prix unitaire en euros
            quantity: lineItem.quantity,                   // Quantité commandée
            total_price: lineItem.amount_total / 100,      // Prix total item en euros

            // ===== MÉTADONNÉES COMPLÉMENTAIRES =====
            
            // 🖼️ IMAGE ET DONNÉES STRIPE POUR RÉFÉRENCE
            product_image_url: product.images?.[0] || null, // Image principale
            product_metadata: {
              stripe_price_id: lineItem.price.id,         // ID prix Stripe
              stripe_product_id: product.id,              // ID produit Stripe
              product_description: product.description,   // Description Stripe
              product_metadata: product.metadata,         // Toutes les métadonnées
            },
          };

          // AJOUT À LA LISTE POUR INSERTION BATCH 📋
          orderItems.push(itemData);

          // LOG DÉTAILLÉ DE CHAQUE ITEM 📱
          console.log(
            `  📱 Item: ${itemData.product_name} x${itemData.quantity} = ${itemData.total_price}€`
          );
        }

        // INSERTION EN BATCH DE TOUS LES ITEMS 💾
        // Plus efficace qu'une insertion par item
        const { data: createdItems, error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)  // Insertion de tout le tableau
          .select();           // Récupération des items créés

        // GESTION D'ERREUR ITEMS ❌
        if (itemsError) {
          throw new Error(`Erreur création items: ${itemsError.message}`);
        }

        // LOG DE SUCCÈS ITEMS ✅
        console.log("✅ Items créés:", createdItems.length);

        // ==========================================
        // 🎊 ÉTAPE 6 : LOGGING FINAL ET CONFIRMATION
        // ==========================================
        
        // CÉLÉBRATION DE LA COMMANDE COMPLÈTE 🎉
        console.log("🎊 COMMANDE COMPLÈTEMENT TRAITÉE !");
        
        // RÉSUMÉ COMPLET POUR LES LOGS 📊
        console.log("📊 Résumé:", {
          order_id: newOrder.id,                    // ID commande Supabase
          session_id: session.id,                  // ID session Stripe
          email: orderData.user_email,             // Email client
          total: orderData.total_amount + "€",     // Montant total
          items_count: createdItems.length,        // Nombre d'articles
          payment_status: orderData.payment_status, // Statut paiement
          order_status: orderData.order_status,    // Statut commande
        });

        // ===== TODOS POUR LES PROCHAINES VERSIONS =====
        // TODO: Envoyer email de confirmation au client
        // TODO: Notifier l'équipe d'une nouvelle commande
        // TODO: Déclencher le workflow de préparation automatique
        // TODO: Mettre à jour les stocks produits
        // TODO: Créer les étiquettes d'expédition

      } catch (error) {
        // ==========================================
        // ❌ GESTION D'ERREURS LORS DU TRAITEMENT DE COMMANDE
        // ==========================================
        
        // LOG D'ERREUR DÉTAILLÉ 🔍
        console.error("❌ ERREUR lors du traitement de la commande:", error);
        console.error("🔍 Détails session:", {
          session_id: session.id,
          email: session.customer_email,
          amount: session.amount_total / 100,
        });

        // ⚠️ STRATÉGIE IMPORTANTE : RÉPONSE 200 MÊME EN CAS D'ERREUR
        // En cas d'erreur, on renvoie quand même 200 pour éviter que Stripe retente
        // Mais on logue l'erreur pour investigation manuelle
        // TODO: Système d'alerte automatique pour les erreurs webhook
        // TODO: Queue de retry pour les commandes échouées
      }

      break; // Fin du case checkout.session.completed

    case "payment_intent.payment_failed":
      // ===== ❌ PAIEMENT ÉCHOUÉ =====
      
      // LOG DE L'ÉCHEC DE PAIEMENT 📝
      console.log("❌ Paiement échoué:", event.data.object.last_payment_error);
      
      // TODO: Logger l'échec en base pour analytics
      // TODO: Notifier l'administrateur si échecs fréquents
      // TODO: Analyser les raisons d'échec pour optimisation
      break;

    case "checkout.session.expired":
      // ===== ⏰ SESSION EXPIRÉE =====
      
      // LOG DE L'EXPIRATION 📝
      console.log("⏰ Session expirée:", event.data.object.id);
      
      // TODO: Nettoyer les données temporaires si nécessaire
      // TODO: Analytics sur les abandons de panier
      // TODO: Remarketing automatique pour sessions expirées
      break;

    default:
      // ===== ℹ️ ÉVÉNEMENT NON GÉRÉ =====
      
      // LOG DES ÉVÉNEMENTS INCONNUS 📝
      console.log(`ℹ️ Événement non géré: ${event.type}`);
      
      // Pas d'action requise, mais utile pour monitoring
      // TODO: Ajouter de nouveaux événements si nécessaire
  }

  // ==========================================
  // ✅ RÉPONSE OBLIGATOIRE POUR STRIPE
  // ==========================================
  
  // CONFIRMATION DE RÉCEPTION POUR STRIPE 📨
  // Stripe attend OBLIGATOIREMENT une réponse 200 pour confirmer la réception
  // Sans cette réponse, Stripe considère le webhook comme échoué et le renvoie
  res.json({ received: true });
};

/**
 * =============================================
 * 🔍 VÉRIFICATION STATUT SESSION
 * =============================================
 *
 * 🎯 RÔLE :
 * Permet de vérifier le statut d'une session Stripe depuis le frontend.
 * Utilisée notamment sur la page de succès pour afficher les détails.
 *
 * 🔧 UTILISATION :
 * • Page de succès Angular pour récupérer les détails de commande
 * • Vérification du statut de paiement en temps réel
 * • Support client pour vérifier l'état d'une transaction
 *
 * @param {Object} req - Requête avec sessionId en paramètre d'URL
 * @param {Object} res - Réponse avec les détails de la session
 */
export const getSessionStatus = async (req, res) => {
  try {
    // RÉCUPÉRATION DE L'ID SESSION DEPUIS L'URL 🔗
    const { sessionId } = req.params;

    // ==========================================
    // 🔍 RÉCUPÉRATION DE LA SESSION STRIPE
    // ==========================================
    
    // APPEL API STRIPE POUR RÉCUPÉRER LES DÉTAILS 📡
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // ==========================================
    // 📤 RÉPONSE AVEC LES INFORMATIONS ESSENTIELLES
    // ==========================================
    
    // DONNÉES FILTRÉES POUR LE FRONTEND 🎯
    // On ne renvoie que les informations nécessaires (sécurité)
    res.json({
      success: true,
      session: {
        id: session.id,                                    // ID de session
        payment_status: session.payment_status,           // "paid", "unpaid", "no_payment_required"
        customer_email: session.customer_email,           // Email du client
        amount_total: session.amount_total / 100,         // Montant en euros (conversion)
        currency: session.currency,                       // Devise
        created: session.created,                         // Timestamp création
        metadata: session.metadata,                       // Métadonnées personnalisées
      },
    });
  } catch (error) {
    // GESTION D'ERREUR (SESSION INTROUVABLE) ❌
    console.error("❌ Erreur récupération session:", error);
    res.status(404).json({
      success: false,
      error: "Session non trouvée",
    });
  }
};

/**
 * =============================================
 * 🧪 FONCTION DE TEST - SESSION SIMPLE (10€)
 * =============================================
 *
 * 🎯 RÔLE :
 * Route de test pour valider l'intégration Stripe sans panier complexe.
 * Permet de tester rapidement le flow de paiement complet.
 *
 * 🔧 UTILISATION :
 * • Tests de développement et validation rapide
 * • Démonstrations client sans données réelles
 * • Vérification de l'intégration webhook
 *
 * @param {Object} req - Requête Express (pas de données requises)
 * @param {Object} res - Réponse Express avec URL de test
 */
export const createTestSessionSimple = async (req, res) => {
  try {
    // LOG DE DÉBUT DE TEST 🧪
    console.log("🧪 Création session TEST SIMPLE...");

    // CRÉATION D'UNE SESSION DE TEST BASIQUE 💳
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Test Soundora - Simple",
              description: "Test de paiement simple pour Soundora",
            },
            unit_amount: 1000, // 10€ en centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // URLS DE REDIRECTION AVEC FALLBACK 🔗
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:4200"
      }/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:4200"}/cart`,
      
      // MÉTADONNÉES DE TEST 🏷️
      metadata: {
        test: "soundora_simple",
        environment: "development",
      },
    });

    // LOG DE SUCCÈS 📝
    console.log("✅ Session TEST SIMPLE créée:", session.id);

    // RÉPONSE AVEC DÉTAILS DE TEST 📤
    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      test: "simple",
      amount: "10€",
    });
  } catch (error) {
    // GESTION D'ERREUR TEST ❌
    console.error("❌ Erreur Test Simple:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * =============================================
 * 🧪 FONCTION DE TEST - SESSION COMPLÈTE (99€)
 * =============================================
 *
 * 🎯 RÔLE :
 * Route de test avancée avec métadonnées complètes et configuration étendue.
 * Simule une vraie commande Soundora avec tous les paramètres.
 *
 * 🔧 UTILISATION :
 * • Tests avancés avec configuration complète
 * • Validation de toutes les fonctionnalités Stripe
 * • Tests de métadonnées et adresses
 *
 * @param {Object} req - Requête Express (pas de données requises)
 * @param {Object} res - Réponse Express avec URL de test complète
 */
export const createTestSessionComplete = async (req, res) => {
  try {
    // LOG DE DÉBUT DE TEST AVANCÉ
    console.log("Creation session TEST COMPLETE...");

    // CRÉATION D'UNE SESSION DE TEST AVANCÉE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Guitare Test Soundora Premium",
              description: "Test de paiement complet pour le projet Soundora",
              images: [
                "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Guitare",
              ],
            },
            unit_amount: 9900, // 99€ en centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      success_url: "http://localhost:4200/order/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:4200/cart",

      metadata: {
        test: "soundora_complete",
        environment: "development",
        timestamp: new Date().toISOString(),
      },

      locale: "fr",
      billing_address_collection: "required",
    });

    console.log("Session TEST COMPLETE creee:", session.id);
    console.log("URL:", session.url);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      test: "complete",
      amount: "99 EUR",
      debug: {
        created: session.created,
        expires_at: session.expires_at,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Erreur Test Complet:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || "unknown",
    });
  }
};
