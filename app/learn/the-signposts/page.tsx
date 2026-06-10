import { Link } from "next-view-transitions";

import { StationSignposts } from "@/components/learn/station-signposts";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-signposts");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Signposts — Semantic HTML Landmarks`,
  description:
    "Why a page uses <header>, <nav>, <main>, <article>, <aside>, <footer> instead of unlabelled boxes. Hover each landmark and watch the matching region of a real page outline itself.",
  path: "/learn/the-signposts",
  keywords: [
    "semantic html",
    "html landmarks",
    "header nav main footer",
    "accessible page structure",
  ],
});

const RECAP = [
  "Every page on the web is a few labelled rooms: a header up top, the main content in the middle, a footer at the bottom.",
  "<header>, <nav>, <main>, <article>, <aside>, <footer> are not paint — they are signposts. They tell a browser, a screen reader, and a search engine which box is which.",
  "Could you use plain <div>s? Yes. Should you? No. The signposts are free, and they make your page legible to readers who cannot see.",
  "Every page on this site uses exactly this skeleton — open the inspector on any of them, you will recognise it.",
];

export default function TheSignpostsPage() {
  const next = stationAfter("the-signposts");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The signposts", path: "/learn/the-signposts" },
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
              The signposts
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              A page is a few rooms. There is the strip across the top with the
              name of the house and the row of links — the header. There is
              the main reading you came for — the main. There is the small
              print and the copyright at the bottom — the footer. HTML has a
              tag for each of these rooms, and using the right one is one of
              the kindest things you can do for the readers you will never
              meet: screen reader users, search engines, future you.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a stripped down sketch of any page on this site. Hover
              any tag, hover any room. They are the same five signposts on the
              Pokemon cabinet, the Theater, the Patrons&apos; Ledger — every page.
            </p>
          </header>

          <div className="mt-10">
            <StationSignposts />
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
