import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSubscriptionRecord, updateProfile } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.metadata?.email || "";
    const userId = session.metadata?.userId || "";
    const plan = session.metadata?.plan || "pro";

    await updateProfile(userId, { plan, credits: plan === "pro" ? 30 : 3 });
    await createSubscriptionRecord({ user_id: userId, plan, status: "active", stripe_customer_id: session.customer as string, customer_email: customerEmail });
  }

  return NextResponse.json({ received: true });
}
