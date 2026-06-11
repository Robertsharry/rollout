import { Link } from "next-view-transitions";

import { StationForms } from "@/components/learn/station-forms";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-forms");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Forms — HTML Inputs on the Donation Desk`,
  description:
    "Learn HTML forms the way the donate page is actually built — <form>, <label>, <input>, <button>. Type a figure, watch the same value travel from the input into the post body.",
  path: "/learn/the-forms",
  keywords: [
    "html forms tutorial",
    "input label button",
    "form action method",
    "beginner form coding",
  ],
});

const RECAP = [
  "A form is an envelope. The <input>s are what you write inside it, the <button> licks the stamp, the action attribute is the address.",
  "Every input has a name. The name is the key the server reads on the other end — change it, and the receiver looks under a different label.",
  "The <label> is tied to its input with a matching id. Click the label, the input takes focus — and a screen reader announces them together.",
  "Our real donate form is built out of exactly these four tags. The Stripe wiring sits behind the form, not inside it.",
];

export default function TheFormsPage() {
  const next = stationAfter("the-forms");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The forms", path: "/learn/the-forms" },
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
              The forms
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              The forms desk is the part of any house the patron actually
              touches. Sign your name, name a figure, press the lever. The
              tags behind it are simple: a form to hold them together, a label
              to ask the question, an input to take the answer, a button to
              send it on its way.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a working miniature of our donation desk. Type a
              figure. Hover each tag and each field. Press Send it — watch the
              exact bundle of data leave the form.
            </p>
          </header>

          <div className="mt-10">
            <StationForms />
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

          {next ? (
            <div className="mt-8 text-right">
              <Link
                href={`/learn/${next.slug}`}
                className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
              >
                Next — Station {next.number}: {next.title} <span aria-hidden>☞</span>
              </Link>
            </div>
          ) : null}
          <StationLogButton slug="the-forms" />

        </Container>
      </Section>
    </>
  );
}
