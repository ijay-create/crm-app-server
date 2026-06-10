const Stripe = require("stripe");

let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("✅ Stripe initialized");
} else {
  console.warn("⚠️ STRIPE_SECRET_KEY not found. Stripe disabled.");
}

module.exports = stripe;