// app/api/products/[id].ts
// attempt for dyanamic routes

import { stripe } from "@/app/lib/config/stripe";

// temporray will need to ingrate with mongoDB
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: priceId } = await params;

  try {
    const product = await stripe.prices.retrieve(priceId);

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response('Failed to fetch product', { status: 500 });
  }
}

