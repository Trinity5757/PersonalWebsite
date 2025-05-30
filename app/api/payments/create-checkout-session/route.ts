// app/api/payments/create-checkout-session/route.ts
import { stripe } from "@/app/lib/config/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { priceId } = await req.json(); // Parse the incoming request body

      if (!priceId) {
        return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId, // Use the provided priceId from the request
            quantity: 1,
          },
        ],
        mode: 'subscription', // or 'payment', based on your use case
        success_url: `${req.headers.get('origin')}/success?success=true`,
        cancel_url: `${req.headers.get('origin')}/?canceled=true`,
        automatic_tax: { enabled: true },
      });

      console.log("session", session);
      
      //return NextResponse.redirect(session.url as string, 303);
      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
}


/*
export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
           /// price: 'price_1QHU5iA4oacG8dLnqsNAzo2L',
            price: '{{PRICE_ID}}',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/?success=true`,
        cancel_url: `${req.headers.get('origin')}/?canceled=true`,
        automatic_tax: {enabled: true},
      });
      console.log("session", session);
     
      return NextResponse.redirect(session.url as string, 303);
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });   
  }
}*/

