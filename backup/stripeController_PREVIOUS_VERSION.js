// =====================================
// CONTROLLER STRIPE POUR SOUNDORA
// =====================================
// Gère les paiements via Stripe Checkout
//
// FONCTIONNALITÉS INCLUSES :
// - Création de sessions de paiement Stripe à partir du panier
// - Gestion des webhooks pour confirmer les paiements
// - Vérification du statut des sessions
// - Routes de test pour le développement
//
// SÉCURITÉ :
// - Validation des données reçues
// - Vérification des signatures webhook
// - Gestion d'erreurs robuste
// =====================================

import Stripe from "stripe";
import supabase from "../config/supabase.js"; // CORRECTION : Import par défaut au lieu d'import nommé

// Initialisation de Stripe avec la clé secrète depuis .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * =============================================
 * CRÉATION D'UNE SESSION CHECKOUT STRIPE
 * =============================================
 *
 * RÔLE : Transforme le panier Soundora en session de paiement Stripe
 *
 * PROCESSUS :
 * 1. Validation des données reçues (panier + email)
 * 2. Conversion des articles Soundora au format Stripe
 * 3. Calcul du total de la commande
 * 4. Création de la session Stripe avec configuration complète
 * 5. Retour de l'URL de paiement au frontend
 *
 * SÉCURITÉ :
 * - Route protégée par authentification Supabase
 * - Validation stricte des données reçues
 * - Gestion d'erreurs détaillée selon le type d'erreur Stripe
 *
 * @param {Object} req - Requête Express avec cartItems et userEmail
 * @param {Object} res - Réponse Express
 */
export const createCheckoutSession = async (req, res) => {
  try {
    // ==========================================
    // ÉTAPE 1 : EXTRACTION DES DONNÉES DE LA REQUÊTE
    // ==========================================
    const { cartItems, userEmail } = req.body;

    console.log("🛒 Création session Stripe pour:", userEmail);
    console.log("📦 Nombre d'articles:", cartItems?.length || 0);

    // ==========================================
    // ÉTAPE 2 : VALIDATION DES DONNÉES REÇUES
    // ==========================================

    // VALIDATION DU PANIER - SÉCURITÉ CRITIQUE 🔒
    // Cette vérification empêche la création de sessions Stripe vides ou malformées
    // !cartItems : Vérifie que la propriété existe (pas undefined/null)
    // !Array.isArray(cartItems) : S'assure que c'est bien un tableau (pas un objet ou string)
    // cartItems.length === 0 : Empêche les paniers vides de créer des sessions
    // ⚠️ SANS CETTE VALIDATION : Stripe générerait une erreur 400 côté serveur
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le panier est vide ou invalide", // Message utilisateur friendly
      });
    }

    // VALIDATION EMAIL UTILISATEUR - OBLIGATOIRE POUR STRIPE 📧
    // Stripe Checkout nécessite un email pour :
    // 1. Pré-remplir le formulaire de paiement
    // 2. Envoyer le reçu de paiement automatiquement
    // 3. Identifier le client dans le dashboard Stripe
    // 4. Créer la commande dans Supabase avec l'email correct
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: "Email utilisateur requis", // Empêche les sessions anonymes
      });
    }

    // ==========================================
    // ÉTAPE 3 : CONVERSION PANIER SOUNDORA → FORMAT STRIPE
    // ==========================================

    // TRANSFORMATION CRITIQUE : SOUNDORA DATA → STRIPE LINE_ITEMS 🔄
    // Chaque article du panier Soundora doit être converti au format attendu par Stripe
    // Cette étape est CRUCIALE car Stripe ne comprend que son propre format de données
    const lineItems = cartItems.map((item) => {
      // VALIDATION INDIVIDUELLE DE CHAQUE ARTICLE 🛡️
      // Vérification que chaque produit a les propriétés minimales requises
      // item.name : Nom du produit (obligatoire pour l'affichage Stripe)
      // item.price : Prix unitaire (obligatoire pour le calcul total)
      // ⚠️ SANS CES DONNÉES : L'API Stripe retournerait une erreur 400
      if (!item.name || !item.price) {
        throw new Error(`Article invalide: ${JSON.stringify(item)}`);
      }

      // CONSTRUCTION DE L'OBJET STRIPE LINE_ITEM 🏗️
      // Structure exacte attendue par l'API Stripe Checkout Sessions
      return {
        price_data: {
          // DEVISE EUROPÉENNE - Configuration régionale 🇪🇺
          currency: "eur", // Devise européenne pour le marché français de Soundora

          product_data: {
            // CONSTRUCTION DU NOM PRODUIT COMPLET 🏷️
            // Combine la marque + nom pour un affichage professionnel
            // Exemple : "Gibson" + "Les Paul Studio" = "Gibson Les Paul Studio"
            // .trim() supprime les espaces en trop si marque manquante
            name: `${item.brands?.name || ""} ${item.name}`.trim(),

            // DESCRIPTION AVEC FALLBACK EN CASCADE 📝
            // Priorité : short_description > description > texte par défaut
            // Assure qu'il y a toujours une description, même minimale
            description:
              item.short_description || // Description courte (priorité 1)
              item.description || // Description complète (priorité 2)
              "Instrument de musique", // Fallback générique (priorité 3)

            // GESTION DES IMAGES PRODUIT 🖼️
            // Stripe accepte un tableau d'URLs d'images
            // [0] = première image du produit Soundora
            // Fallback sur image par défaut si pas d'image disponible
            images: [item.images?.[0] || "/assets/images/no-image.jpg"],

            // MÉTADONNÉES SOUNDORA → STRIPE 📊
            // Ces données permettent la réconciliation entre Stripe et Supabase
            // Conservées lors du webhook pour recréer la commande complète
            metadata: {
              product_id: item.id || "", // ID produit Soundora (pour lien Supabase)
              sku: item.sku || "", // Référence produit (gestion stock)
              category: item.categories?.name || "", // Catégorie musicale (guitares, batteries...)
              brand: item.brands?.name || "", // Marque de l'instrument (Gibson, Fender...)
            },
          },

          // CONVERSION PRIX CRITIQUE : EUROS → CENTIMES 💰
          // ⚠️ IMPORTANT : Stripe travaille UNIQUEMENT en centimes !
          // Exemples : 1299€ → 129900 centimes, 49.99€ → 4999 centimes
          // Math.round() évite les erreurs d'arrondis JavaScript (ex: 49.99 * 100 = 4998.999...)
          unit_amount: Math.round(item.price * 100),
        },

        // QUANTITÉ DE CET ARTICLE DANS LE PANIER 🔢
        // Fallback sur 1 si quantité non spécifiée (sécurité)
        quantity: item.quantity || 1,
      };
    });

    // ==========================================
    // ÉTAPE 4 : CALCUL DU TOTAL POUR LES LOGS DE DEBUG
    // ==========================================

    // CALCUL DU MONTANT TOTAL DE LA COMMANDE 🧮
    // Utilise Array.reduce() pour sommer tous les articles du panier
    // sum = accumulateur (total progressif), item = article courant
    // Formule : prix_unitaire × quantité pour chaque article
    // ⚠️ Ce calcul est UNIQUEMENT pour les logs - Stripe calculera le vrai total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1), // Fallback quantity = 1
      0 // Valeur initiale de l'accumulateur
    );

    // LOG DE DEBUG POUR LE DÉVELOPPEMENT 📊
    // Permet de vérifier que le total est cohérent avant envoi à Stripe
    console.log("💰 Total commande:", totalAmount, "€");

    // ==========================================
    // ÉTAPE 5 : CRÉATION DE LA SESSION STRIPE CHECKOUT
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
        user_email: userEmail, // Email pour création commande Supabase
        order_source: "soundora_website", // Source de la commande (vs app mobile)
        cart_total: totalAmount.toString(), // Total calculé (conversion string obligatoire)
        items_count: cartItems.length.toString(), // Nombre d'articles (pour validation)
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
          order_source: "soundora", // Identification claire de la source
          total_items: cartItems.length.toString(), // Nombre d'articles pour validation croisée
        },
      },
    });

    console.log(" Session Stripe créée:", session.id);

    // ==========================================
    // ÉTAPE 6 : RÉPONSE DE SUCCÈS AU FRONTEND
    // ==========================================
    // Envoi de l'URL de paiement au frontend Angular
    res.json({
      success: true,
      sessionId: session.id, // ID de session pour le suivi
      checkoutUrl: session.url, // URL vers l'interface de paiement Stripe
      message: "Session de paiement créée avec succès",
    });
  } catch (error) {
    console.error(" Erreur Stripe Checkout:", error);

    // ==========================================
    // GESTION D'ERREURS DÉTAILLÉE PAR TYPE STRIPE
    // ==========================================
    let errorMessage = "Erreur lors de la création du paiement";

    // Classification des erreurs selon les types Stripe
    if (error.type === "StripeCardError") {
      errorMessage = "Erreur de carte bancaire";
    } else if (error.type === "StripeRateLimitError") {
      errorMessage = "Trop de requêtes, veuillez réessayer";
    } else if (error.type === "StripeInvalidRequestError") {
      errorMessage = "Requête invalide";
    } else if (error.type === "StripeAPIError") {
      errorMessage = "Erreur temporaire du service de paiement";
    } else if (error.type === "StripeConnectionError") {
      errorMessage = "Erreur de connexion au service de paiement";
    } else if (error.type === "StripeAuthenticationError") {
      errorMessage = "Erreur d'authentification du service de paiement";
    }

    // Réponse d'erreur avec détails en mode développement
    res.status(500).json({
      success: false,
      error: errorMessage,
      // En développement, on affiche le message d'erreur complet
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * =============================================
 * WEBHOOK STRIPE - CONFIRMATION PAIEMENT
 * =============================================
 *
 * RÔLE : Stripe appelle cette URL quand un paiement est confirmé
 * CRITIQUE : Permet de créer la commande dans Supabase après paiement réussi
 *
 * SÉCURITÉ :
 * - Vérification obligatoire de la signature Stripe
 * - Protection contre les attaques par rejeu
 *
 * ÉVÉNEMENTS GÉRÉS :
 * - checkout.session.completed : Paiement réussi
 * - payment_intent.payment_failed : Paiement échoué
 * - checkout.session.expired : Session expirée
 *
 * @param {Object} req - Requête Express avec signature Stripe
 * @param {Object} res - Réponse Express
 */
/**
 * =============================================
 * WEBHOOK STRIPE - CONFIRMATION PAIEMENT
 * =============================================
 *
 * RÔLE : Stripe appelle cette URL quand un paiement est confirmé
 * CRITIQUE : Permet de créer la commande dans Supabase après paiement réussi
 *
 * SÉCURITÉ :
 * - Vérification obligatoire de la signature Stripe
 * - Protection contre les attaques par rejeu
 *
 * ÉVÉNEMENTS GÉRÉS :
 * - checkout.session.completed : Paiement réussi
 * - payment_intent.payment_failed : Paiement échoué
 * - checkout.session.expired : Session expirée
 *
 * LOGIQUE DE CRÉATION DE COMMANDE :
 * 1. Vérification de la signature Stripe (sécurité)
 * 2. Traitement de l'événement checkout.session.completed
 * 3. Récupération des détails complets de la session
 * 4. Extraction des line_items (articles achetés)
 * 5. Création de l'enregistrement dans la table 'orders'
 * 6. Création des enregistrements dans 'order_items'
 * 7. Logging complet pour debugging
 *
 * @param {Object} req - Requête Express avec signature Stripe
 * @param {Object} res - Réponse Express
 */
export const stripeWebhook = async (req, res) => {
  // Récupération de la signature Stripe depuis les headers
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ==========================================
    // VÉRIFICATION SIGNATURE STRIPE (SÉCURITÉ OBLIGATOIRE)
    // ==========================================
    // Construction et vérification de l'événement avec la signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature invalide:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🎉 Webhook Stripe reçu:", event.type);

  // ==========================================
  // TRAITEMENT DES ÉVÉNEMENTS STRIPE
  // ==========================================
  switch (event.type) {
    case "checkout.session.completed":
      // ===== PAIEMENT CONFIRMÉ ET RÉUSSI =====
      const session = event.data.object;
      console.log("💰 PAIEMENT CONFIRMÉ !");
      console.log("📧 Email client:", session.customer_email);
      console.log("💶 Montant:", session.amount_total / 100, "€");
      console.log("🆔 Session ID:", session.id);

      try {
        // ==========================================
        // ÉTAPE 1 : RÉCUPÉRATION DES DÉTAILS COMPLETS DE LA SESSION
        // ==========================================
        // Stripe ne donne que les infos de base dans le webhook
        // On doit faire un appel API pour récupérer les line_items
        console.log("🔍 Récupération des détails complets de la session...");

        const detailedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items", "line_items.data.price.product"], // Expansion pour récupérer tous les détails
          }
        );

        console.log(
          "📦 Nombre d'articles:",
          detailedSession.line_items.data.length
        );

        // ==========================================
        // ÉTAPE 2 : PRÉPARATION DES DONNÉES POUR LA COMMANDE
        // ==========================================
        const orderData = {
          // === IDENTIFIANTS STRIPE ===
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,

          // === INFORMATIONS CLIENT ===
          user_email: session.customer_email,
          // user_id: null, // TODO: Lier avec l'utilisateur Supabase si connecté

          // === MONTANTS ===
          total_amount: session.amount_total / 100, // Conversion centimes → euros
          currency: session.currency || "eur",

          // === STATUTS ===
          payment_status: "completed", // Paiement confirmé par Stripe
          order_status: "confirmed", // Commande confirmée, en attente de traitement

          // === ADRESSES ===
          // Stripe peut fournir les adresses de facturation et livraison
          billing_address: session.customer_details
            ? {
                name: session.customer_details.name,
                email: session.customer_details.email,
                phone: session.customer_details.phone,
                address: session.customer_details.address,
              }
            : null,

          shipping_address: session.shipping_details
            ? {
                name: session.shipping_details.name,
                address: session.shipping_details.address,
              }
            : null,

          // === MÉTADONNÉES ===
          metadata: {
            ...session.metadata, // Métadonnées définies lors de la création de session
            stripe_session_created: session.created,
            stripe_session_expires: session.expires_at,
            webhook_processed_at: new Date().toISOString(),
            payment_method_types: session.payment_method_types,
          },
        };

        console.log("📝 Données de commande préparées:", {
          email: orderData.user_email,
          total: orderData.total_amount,
          items_count: detailedSession.line_items.data.length,
        });

        // ==========================================
        // ÉTAPE 3 : VÉRIFICATION DE L'UNICITÉ DE LA COMMANDE
        // ==========================================
        // S'assurer qu'on ne crée pas deux fois la même commande
        console.log("🔒 Vérification de l'unicité de la commande...");

        const { data: existingOrder, error: checkError } = await supabase
          .from("orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .single();

        if (existingOrder) {
          console.log(
            "⚠️ Commande déjà existante pour cette session:",
            existingOrder.id
          );
          return res.json({ received: true, status: "already_processed" });
        }

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116 = "row not found", c'est normal
          throw new Error(`Erreur vérification unicité: ${checkError.message}`);
        }

        // ==========================================
        // ÉTAPE 4 : CRÉATION DE LA COMMANDE DANS SUPABASE
        // ==========================================
        console.log("💾 Création de la commande dans Supabase...");

        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert([orderData])
          .select()
          .single();

        if (orderError) {
          throw new Error(`Erreur création commande: ${orderError.message}`);
        }

        console.log("✅ Commande créée avec l'ID:", newOrder.id);

        // ==========================================
        // ÉTAPE 5 : CRÉATION DES ITEMS DE COMMANDE
        // ==========================================
        console.log("📦 Création des items de commande...");

        const orderItems = [];

        for (const lineItem of detailedSession.line_items.data) {
          const product = lineItem.price.product;

          const itemData = {
            order_id: newOrder.id,

            // === INFORMATIONS PRODUIT ===
            // Extraction depuis les métadonnées Stripe ou nom du produit
            product_id: product.metadata?.product_id
              ? parseInt(product.metadata.product_id)
              : null,
            product_name: product.name,
            product_sku: product.metadata?.sku || null,
            brand_name: product.metadata?.brand || null,
            category_name: product.metadata?.category || null,

            // === PRIX ET QUANTITÉ ===
            unit_price: lineItem.price.unit_amount / 100, // Conversion centimes → euros
            quantity: lineItem.quantity,
            total_price: lineItem.amount_total / 100, // Prix total pour cet item

            // === MÉTADONNÉES ===
            product_image_url: product.images?.[0] || null,
            product_metadata: {
              stripe_price_id: lineItem.price.id,
              stripe_product_id: product.id,
              product_description: product.description,
              product_metadata: product.metadata,
            },
          };

          orderItems.push(itemData);

          console.log(
            `  📱 Item: ${itemData.product_name} x${itemData.quantity} = ${itemData.total_price}€`
          );
        }

        // Insertion en batch de tous les items
        const { data: createdItems, error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)
          .select();

        if (itemsError) {
          throw new Error(`Erreur création items: ${itemsError.message}`);
        }

        console.log("✅ Items créés:", createdItems.length);

        // ==========================================
        // ÉTAPE 6 : LOGGING FINAL ET CONFIRMATION
        // ==========================================
        console.log("🎊 COMMANDE COMPLÈTEMENT TRAITÉE !");
        console.log("📊 Résumé:", {
          order_id: newOrder.id,
          session_id: session.id,
          email: orderData.user_email,
          total: orderData.total_amount + "€",
          items_count: createdItems.length,
          payment_status: orderData.payment_status,
          order_status: orderData.order_status,
        });

        // TODO: Envoyer email de confirmation au client
        // TODO: Notifier l'équipe d'une nouvelle commande
        // TODO: Déclencher le workflow de préparation
      } catch (error) {
        // ==========================================
        // GESTION D'ERREURS LORS DU TRAITEMENT
        // ==========================================
        console.error("❌ ERREUR lors du traitement de la commande:", error);
        console.error("🔍 Détails session:", {
          session_id: session.id,
          email: session.customer_email,
          amount: session.amount_total / 100,
        });

        // En cas d'erreur, on renvoie quand même 200 pour éviter que Stripe retente
        // Mais on logue l'erreur pour investigation manuelle
        // TODO: Système d'alerte pour les erreurs webhook
      }

      break;

    case "payment_intent.payment_failed":
      // ===== PAIEMENT ÉCHOUÉ =====
      console.log("❌ Paiement échoué:", event.data.object.last_payment_error);
      // TODO: Logger l'échec, notifier l'administrateur si nécessaire
      break;

    case "checkout.session.expired":
      // ===== SESSION EXPIRÉE =====
      console.log("⏰ Session expirée:", event.data.object.id);
      // TODO : Nettoyer les données temporaires si nécessaire
      break;

    default:
      // ===== ÉVÉNEMENT NON GÉRÉ =====
      console.log(`ℹ️ Événement non géré: ${event.type}`);
  }

  // ==========================================
  // RÉPONSE OBLIGATOIRE POUR STRIPE
  // ==========================================
  // Stripe attend une réponse 200 pour confirmer la réception
  res.json({ received: true });
};

/**
 * =============================================
 * VÉRIFICATION STATUT SESSION
 * =============================================
 *
 * RÔLE : Permet de vérifier le statut d'une session Stripe
 * UTILISATION : Page de succès frontend pour afficher les détails
 *
 * @param {Object} req - Requête avec sessionId en paramètre
 * @param {Object} res - Réponse Express
 */
export const getSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // ==========================================
    // RÉCUPÉRATION DE LA SESSION STRIPE
    // ==========================================
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Réponse avec les informations essentielles
    res.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status, // "paid", "unpaid", "no_payment_required"
        customer_email: session.customer_email,
        amount_total: session.amount_total / 100, // Conversion centimes → euros
        currency: session.currency,
        created: session.created,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error(" Erreur récupération session:", error);
    res.status(404).json({
      success: false,
      error: "Session non trouvée",
    });
  }
};

/**
 * =============================================
 * FONCTION DE TEST - SESSION SIMPLE (10€)
 * =============================================
 *
 * RÔLE : Route pour tester Stripe sans authentification
 * UTILISATION : Tests de développement et validation de l'intégration
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const createTestSessionSimple = async (req, res) => {
  try {
    console.log(" Création session TEST SIMPLE...");

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
            unit_amount: 1000, // 10€
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:4200"
      }/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:4200"}/cart`,
      metadata: {
        test: "soundora_simple",
        environment: "development",
      },
    });

    console.log("✅ Session TEST SIMPLE créée:", session.id);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      test: "simple",
      amount: "10€",
    });
  } catch (error) {
    console.error("❌ Erreur Test Simple:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * =============================================
 * FONCTION DE TEST - SESSION COMPLÈTE (99€)
 * =============================================
 *
 * RÔLE : Route pour tester Stripe avec métadonnées complètes
 * UTILISATION : Tests avancés avec configuration complète
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const createTestSessionComplete = async (req, res) => {
  try {
    console.log("🔥 Création session TEST COMPLÈTE...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "🎸 Guitare Test Soundora",
              description: "Test de paiement complet pour le projet Soundora",
              images: [
                "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=🎸",
              ],
            },
            unit_amount: 9900, // 99€
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:4200/order/success?session_id`,
      cancel_url: `http://localhost:4200/cart`,

      // Métadonnées pour debug
      metadata: {
        test: "soundora_complete",
        environment: "development",
        timestamp: new Date().toISOString(),
      },

      // Configuration avancée
      locale: "fr",
      billing_address_collection: "required",
    });

    console.log(" Session TEST COMPLÈTE créée:", session.id);
    console.log(" URL:", session.url);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      test: "complete",
      amount: "99€",
      debug: {
        created: session.created,
        expires_at: session.expires_at,
        status: session.status,
      },
    });
  } catch (error) {
    console.error(" Erreur Test Complet:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || "unknown",
    });
  }
};
