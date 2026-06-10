import { Link } from "next-view-transitions";

import { StationBones } from "@/components/learn/station-bones";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-bones");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Bones — HTML by Taking the Theater Apart`,
  description:
    "Learn what HTML actually is by dissecting this site's Showboat Theater stage. Hover each line of markup and watch the matching part light up.",
  path: "/learn/the-bones",
});

const RECAP = [
  "HTML is structure: every tag is a labeled box, and boxes nest inside boxes.",
  "The screen <div> contains the picture, the velvet, and the valance — hover it and the whole family lights up.",
  "Tags carry meaning: <figure> says exhibit, <figcaption> says caption for it. Browsers and screen readers both read that meaning.",
  "Every fancy thing on this site sits on bones this simple.",
];

export default function TheBonesPage() {
  const next = stationAfter("the-bones");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The bones", path: "/learn/the-bones" },
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
              The bones
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              You have seen our Showboat Theater — the marquee, the velvet, the
              picture behind it. Here is the secret: under the paint, that whole
              stage is about ten lines of HTML. HTML is not a programming
              language; it is a way of naming boxes and putting boxes inside
              other boxes. The browser reads the names and builds the structure.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is the real shape of our stage, simplified. Run your pointer
              over the code — or over the stage itself — and watch the two light
              up together. That connection in your head is the whole lesson.
            </p>
          </header>

          <div className="mt-10">
            <StationBones />
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
        </Container>
      </Section>
    </>
  );
}
