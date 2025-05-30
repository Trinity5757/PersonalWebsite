// singleton pattern - idea for course work project
//app/lib/stripejs.ts - note this client side stripe library
// maybe rename to stripe-client.ts????
// https://github.com/stripe/stripe-js
// https://docs.stripe.com/payments/elements
import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;