"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { env, isAuthConfigured } from "@/lib/env";
import { SITE } from "@/lib/site";
import { stripe } from "@/lib/stripe";

const Input = z.object({
  kind: z.enum(["house", "amount", "monthly"]),
  amount: z.coerce.number().int().min(1).max(999).optional(),
});

const MONTHLY_AMOUNTS = new Set([5, 15]);

/** Opens a Stripe Checkout session and walks the patron to it. */
export async function openLedger(formData: FormData) {
  if (!stripe) redirect("/donate?trouble=1");

  const parsed = Input.safeParse({
    kind: formData.get("kind"),
    amount: formData.get("amount") || undefined,
  });
  if (!parsed.success) redirect("/donate?trouble=1");
  const { kind, amount } = parsed.data;

  let email: string | undefined;
  if (isAuthConfigured) {
    const session = await auth().catch(() => null);
    email = session?.user?.email ?? undefined;
  }

  const common = {
    success_url: `${SITE.url}/donate/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE.url}/donate?canceled=1`,
    customer_email: email,
    metadata: { source: "rollout-patrons-ledger", kind },
  } as const;

  let url: string | null = null;
  try {
    if (kind === "house" && env.STRIPE_DONATION_PRICE_ID) {
      // The house price lets the patron name their own figure on Stripe's page.
      const session = await stripe.checkout.sessions.create({
        ...common,
        mode: "payment",
        submit_type: "donate",
        line_items: [{ price: env.STRIPE_DONATION_PRICE_ID, quantity: 1 }],
      });
      url = session.url;
    } else if (kind === "amount" && amount) {
      const session = await stripe.checkout.sessions.create({
        ...common,
        mode: "payment",
        submit_type: "donate",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount * 100,
              product_data: {
                name: "Patronage — the Rollout gaming house",
                description: "One time support. Keeps the boilers lit and the house free of ads.",
              },
            },
          },
        ],
      });
      url = session.url;
    } else if (kind === "monthly" && amount && MONTHLY_AMOUNTS.has(amount)) {
      const session = await stripe.checkout.sessions.create({
        ...common,
        mode: "subscription",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount * 100,
              recurring: { interval: "month" },
              product_data: {
                name:
                  amount >= 15
                    ? "Boiler Club — monthly patronage"
                    : "Crew — monthly patronage",
              },
            },
          },
        ],
      });
      url = session.url;
    }
  } catch (err) {
    console.error("[patrons-ledger] checkout failed", err);
  }

  redirect(url ?? "/donate?trouble=1");
}
