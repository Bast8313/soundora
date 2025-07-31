// =====================================
// CONTROLLER STRIPE POUR SOUNDORA
// =====================================
// Gère les paiements via Stripe Checkout
import Stripe from "stripe";
import { supabase } from "../config/supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * CRÉATION D'UNE SESSION CHECKOUT STRIPE
 * Transforme le panier Soundora en session de paiement Stripe
 *
 * @param {Object} req - Requête Express avec cartItems et userEmail
 * @param {Object} res - Réponse Express
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, userEmail } = req.body;

    console.log(" Création session Stripe pour:", userEmail);
    console.log(" Nombre d'articles:", cartItems?.length || 0);

    // VALIDATION DES DONNÉES REÇUES
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le panier est vide ou invalide",
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: "Email utilisateur requis",
      });
    }

    // CONVERSION : Panier Soundora → Format Stripe
    const lineItems = cartItems.map((item) => {
      // Validation de chaque article
      if (!item.name || !item.price) {
        throw new Error(`Article invalide: ${JSON.stringify(item)}`);
      }

      return {
        price_data: {
          currency: "eur", // Devise européenne
          product_data: {
            name: `${item.brands?.name || ""} ${item.name}`.trim(), // Nom complet
            description:
              item.short_description ||
              item.description ||
              "Instrument de musique",
            images: [item.images?.[0] || "/assets/images/no-image.jpg"],
            metadata: {
              product_id: item.id || "", // ID produit pour référence
              sku: item.sku || "", // Référence produit
              category: item.categories?.name || "", // Catégorie
              brand: item.brands?.name || "", // Marque
            },
          },
          unit_amount: Math.round(item.price * 100), // Prix en centimes (Stripe requirement)
        },
        quantity: item.quantity || 1,
      };
    });

    // CALCUL DU TOTAL POUR LOGS
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    console.log(" Total commande:", totalAmount, "€");

    // CRÉATION SESSION STRIPE CHECKOUT
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Types de paiement acceptés
      line_items: lineItems, // Articles du panier
      mode: "payment", // Mode one-shot (pas abonnement)

      // INFORMATIONS CLIENT
      customer_email: userEmail,

      // URLS DE REDIRECTION
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,

      // MÉTADONNÉES pour webhook et suivi
      metadata: {
        user_email: userEmail,
        order_source: "soundora_website",
        cart_total: totalAmount.toString(),
        items_count: cartItems.length.toString(),
      },

      // PERSONNALISATION INTERFACE
      locale: "fr", // Interface française
      billing_address_collection: "required", // Adresse de facturation obligatoire
      shipping_address_collection: {
        // Adresse de livraison
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "ES", "IT"],
      },

      // CONFIGURATION AVANCÉE
      payment_intent_data: {
        metadata: {
          order_source: "soundora",
          total_items: cartItems.length.toString(),
        },
      },
    });

    console.log(" Session Stripe créée:", session.id);

    // RÉPONSE SUCCÈS
    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url, // URL vers Stripe Checkout
      message: "Session de paiement créée avec succès",
    });
  } catch (error) {
    console.error(" Erreur Stripe Checkout:", error);

    // GESTION D'ERREURS DÉTAILLÉE
    let errorMessage = "Erreur lors de la création du paiement";
    if (error.type === "StripeCardError") {
      errorMessage = "Erreur de carte bancaire";
    } else if (error.type === "StripeRateLimitError") {
      errorMessage = "Trop de requêtes, veuillez réessayer";
    } else if (error.type === "StripeInvalidRequestError") {
      errorMessage = "Requête invalide";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * WEBHOOK STRIPE - CONFIRMATION PAIEMENT
 * Stripe appelle cette URL quand le paiement est confirmé
 * CRITIQUE : Permet de créer la commande après paiement réussi
 *
 * @param {Object} req - Requête Express avec signature Stripe
 * @param {Object} res - Réponse Express
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // VÉRIFICATION SIGNATURE STRIPE (sécurité obligatoire)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(" Webhook signature invalide:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(" Webhook Stripe reçu:", event.type);

  // TRAITEMENT DES ÉVÉNEMENTS STRIPE
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(" Paiement confirmé pour session:", session.id);

      try {
        // CRÉER LA COMMANDE EN BASE DE DONNÉES
        await createOrderFromStripeSession(session);
        console.log("Commande créée en base de données");

        // TODO: Envoyer email de confirmation
        // await sendOrderConfirmationEmail(session);
      } catch (orderError) {
        console.error(" Erreur création commande:", orderError);
      }
      break;

    case "payment_intent.payment_failed":
      console.log(" Paiement échoué:", event.data.object.last_payment_error);
      break;

    case "checkout.session.expired":
      console.log(" Session expirée:", event.data.object.id);
      break;

    default:
      console.log(`ℹ Événement non géré: ${event.type}`);
  }

  // RÉPONSE OBLIGATOIRE POUR STRIPE
  res.json({ received: true });
};

/**
 * CRÉATION COMMANDE APRÈS PAIEMENT STRIPE
 * Fonction utilitaire pour créer la commande en base de données
 *
 * @param {Object} session - Session Stripe complétée
 */
async function createOrderFromStripeSession(session) {
  try {
    // RÉCUPÉRER LES DÉTAILS COMPLETS DE LA SESSION
    const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });

    console.log(" Détails session récupérés:", sessionDetails.id);

    // PRÉPARER LES DONNÉES DE COMMANDE
    const orderData = {
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      user_email: session.customer_email,
      total_amount: session.amount_total / 100, // Reconvertir centimes → euros
      currency: session.currency,
      payment_status: "completed",
      order_status: "confirmed",

      // ADRESSES (si fournies)
      billing_address: session.customer_details?.address
        ? JSON.stringify(session.customer_details.address)
        : null,
      shipping_address: session.shipping_details?.address
        ? JSON.stringify(session.shipping_details.address)
        : null,

      // MÉTADONNÉES
      metadata: JSON.stringify(session.metadata),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // INSERTION EN BASE SUPABASE
    const { data: orderResult, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      throw new Error(`Erreur insertion commande: ${orderError.message}`);
    }

    console.log(" Commande créée avec ID:", orderResult.id);

    // TODO: Insérer les articles de commande dans une table order_items
    // TODO: Mettre à jour le stock des produits
    // TODO: Envoyer notification email

    return orderResult;
  } catch (error) {
    console.error(" Erreur création commande:", error);
    throw error;
  }
}

/**
 * VÉRIFICATION STATUT SESSION
 * Permet de vérifier le statut d'une session Stripe
 * Utilisé sur la page de succès frontend
 *
 * @param {Object} req - Requête avec sessionId en paramètre
 * @param {Object} res - Réponse Express
 */
export const getSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // RÉCUPÉRER LA SESSION STRIPE
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        amount_total: session.amount_total / 100,
        currency: session.currency,
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
