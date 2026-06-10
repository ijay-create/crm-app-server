const stripe = require("../config/stripe");
const Company = require("../models/Company");

const createCheckoutSession = async (req, res) => {
  try {
    // Stripe disabled
    if (!stripe) {
      return res.status(503).json({
        message: "Stripe is not configured",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "CRM Pro Plan",
            },

            unit_amount: 2000,

            recurring: {
              interval: "month",
            },
          },

          quantity: 1,
        },
      ],

      success_url:
        process.env.STRIPE_SUCCESS_URL ||
        "http://localhost:5173/dashboard",

      cancel_url:
        process.env.STRIPE_CANCEL_URL ||
        "http://localhost:5173/billing",
    });

    return res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return res.status(500).json({
      message: "Stripe error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  createCheckoutSession,
};