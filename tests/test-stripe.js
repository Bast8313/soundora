// ===================================
// TEST SIMPLE STRIPE - SOUNDORA
// ===================================
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware pour webhook Stripe (raw body nécessaire)
app.use("/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cors());

// Route de test
app.get("/test", (req, res) => {
  res.json({ message: " Serveur Soundora OK !", stripe: "Configuré" });
});

// Page de succès
app.get("/success", (req, res) => {
  const sessionId = req.query.session_id;
  res.send(`
    <h1> Paiement réussi !</h1>
    <p>Session ID: ${sessionId}</p>
    <p>Merci pour votre achat test sur Soundora !</p>
    <a href="/">Retour à l'accueil</a>
  `);
});

// Page d'annulation
app.get("/cancel", (req, res) => {
  res.send(`
    <h1> Paiement annulé</h1>
    <p>Votre paiement a été annulé.</p>
    <a href="/">Retour à l'accueil</a>
  `);
});

// Test création session Stripe SIMPLE
app.post("/test-stripe-simple", async (req, res) => {
  try {
    console.log(" Création session ULTRA-SIMPLE...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Test Soundora",
            },
            unit_amount: 1000, // 10€ seulement
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    console.log("Session SIMPLE créée:", session.id);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error(" Erreur:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test création session Stripe
app.post("/test-stripe", async (req, res) => {
  try {
    console.log(" Création d'une nouvelle session Stripe...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: " Guitare Test Soundora",
              description: "Test de paiement pour le projet Soundora",
            },
            unit_amount: 9900, // 99€ en centimes (plus accessible pour test)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:3010/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3010/cancel",

      // MÉTADONNÉES pour debug
      metadata: {
        test: "soundora_test",
        timestamp: new Date().toISOString(),
      },
    });

    console.log(" Session créée avec succès!");
    console.log(" Session ID:", session.id);
    console.log(" URL complète:", session.url);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      debug: {
        created: session.created,
        expires_at: session.expires_at,
        status: session.status,
      },
    });
  } catch (error) {
    console.error(" Erreur Stripe:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || "unknown",
    });
  }
});

// Webhook Stripe pour tests
app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Pour les tests, on utilise un secret webhook simple ou on skip la vérification
    console.log(" Webhook reçu !");
    console.log(" Type:", req.body ? "Body présent" : "Pas de body");
    console.log(" Signature:", sig ? "Présente" : "Absente");

    // En mode test, on parse simplement le JSON
    if (req.body) {
      try {
        event = JSON.parse(req.body);
      } catch (e) {
        console.log(" Body brut:", req.body.toString());
        return res.status(400).send("Invalid JSON");
      }
    } else {
      return res.status(400).send("No body");
    }

    console.log(" Type d'événement:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        console.log(" PAIEMENT CONFIRMÉ !");
        console.log(" Session ID:", event.data.object.id);
        console.log(" Email:", event.data.object.customer_email);
        console.log(" Montant:", event.data.object.amount_total / 100, "€");
        break;

      case "payment_intent.succeeded":
        console.log(" Paiement réussi !");
        break;

      default:
        console.log(`ℹ Événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(" Erreur webhook:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(` Serveur TEST démarré sur le port ${PORT}`);
  console.log(` Test: http://localhost:${PORT}/test`);
  console.log(` Stripe: http://localhost:${PORT}/test-stripe`);
});
