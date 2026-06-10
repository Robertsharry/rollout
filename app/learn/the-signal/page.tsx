import { Link } from "next-view-transitions";

import { StationSignal } from "@/components/learn/station-signal";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-signal");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Signal — Forms and Server Actions`,
  description:
    "What happens between clicking submit and the server saying thanks. Watch every leg of the round trip — collect, send, process, respond, rerender — on a miniature donate form.",
  path: "/learn/the-signal",
  keywords: [
    "server actions tutorial",
    "form submission explained",
    "next js server action",
    "request response basics",
  ],
});

const RECAP = [
  "The browser and the server are two computers separated by a few hundred milliseconds of wire. Most of the web is them passing notes.",
  "A form's action attribute is the address it posts to. In Next.js you can hand it a real function — 'use server' makes that function run on our machine instead of the patron's.",
  "The browser packs the input values into a request, the server runs the function with them, the result comes back, and React rerenders with whatever returned.",
  "Our real donate flow is exactly this: a form, an action, a Stripe call, a return. Add a database write or an email — same shape.",
];

export default function TheSignalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The signal", path: "/learn/the-signal" },
        ])}
      />

      <Section spacing="none" className="pt-28 pb-20">
        <Container className="max-w-5xl">
          <Link
            href="/learn"
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← The Engine Room
          </Link>

          <header className="mt-5 max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] text-gold-light uppercase">
              Station {STATION.number} · {STATION.teaches}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The signal
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Most of the web is two computers passing notes. The patron&apos;s
              browser packs an envelope. Our server reads it, does something,
              writes back. Then the browser unfolds the reply and rerenders
              the page. That round trip is the most important shape in
              programming, and on this stack it is shorter than you think.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a miniature of our real donate form. Press Send it and
              watch every leg of the trip — collect, send, process, respond,
              rerender — in the order they happen. Read the script and you
              have read the actual file under app/donate.
            </p>
          </header>

          <div className="mt-10">
            <StationSignal />
          </div>

          <div className="glass mt-10 rounded-lg p-6">
            <h2 className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
              What you just learned
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
              {RECAP.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-brass" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link
              href="/learn"
              className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
            >
              <span aria-hidden>☜</span> Back to the Engine Room
            </Link>
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
              Curriculum complete · all twelve stations open
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
