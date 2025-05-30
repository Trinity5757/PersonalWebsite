import "server-only";
// app/lib/config/stripe.ts
// configuration for stripe using the secret key
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2024-10-28.acacia", // specify latest API version
  typescript: true,
 
});
