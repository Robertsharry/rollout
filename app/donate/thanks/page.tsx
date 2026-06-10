import { Link } from "next-view-transitions";

import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { stripe } from "@/lib/stripe";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Entered in the ledger",
  path: "/donate/thanks",
  noIndex: true,
});

interface ThanksPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

function formatAmount(cents: number | null, currency: string | null) {
  if (!cents) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format(cents / 100);
}

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const { session_id } = await searchParams;

  let amount: string | null = null;
  let monthly = false;
  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      amount = formatAmount(session.amount_total, session.currency);
      monthly = session.mode === "subscription";
    } catch {
      // a bad or stale id still deserves a warm room
    }
  }

  return (
    <Section spacing="lg" className="grid min-h-[78vh] place-items-center">
      <Container className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-brass/15 blur-[120px]"
        />
        <div className="mx-auto max-w-md text-center">
          <div className="inline-block border border-gold-light/60 px-10 py-6">
            <p className="font-mono text-[11px] tracking-[0.24em] text-gold-light uppercase">
              The Patrons&apos; Ledger
            </p>
            <p className="font-script mt-3 text-3xl text-brass">
              entered &amp; remembered
            </p>
            {amount ? (
              <p className="mt-3 font-display text-2xl font-bold">
                {amount}
                {monthly ? (
                  <span className="font-mono text-sm text-sage"> / month</span>
                ) : null}
              </p>
            ) : null}
          </div>

          <p className="mt-8 leading-relaxed text-sage">
            That keeps the boilers lit, the reels turning, and the house free
            of ads for every hand aboard. Thank you, patron — your plaque goes
            on the ledger wall when it opens.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DiscordButton label="Take a bow in Discord" />
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-brass/50 px-6 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
            >
              Return to the foyer
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
