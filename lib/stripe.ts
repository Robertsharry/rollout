import Stripe from "stripe";

import { env } from "@/lib/env";

/**
 * Stripe client, or null when no key is set — the donate page renders a
 * graceful "ledger opens soon" state instead of crashing.
 */
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;
