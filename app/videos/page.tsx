import { Theater } from "@/components/theater/theater";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { PROGRAM, embedUrl, posterUrl, watchUrl } from "@/lib/theater";

export const metadata = buildMetadata({
  title: "The Showboat Theater — Gaming Videos & Highlights",
  description:
    "Hand picked gaming reels shown on the house stage: Helldivers 2, Arc Raiders, UFC knockouts, and Pokémon — with the curtain, the marquee, and the house lights.",
  path: "/videos",
  keywords: [
    "gaming videos",
    "helldivers 2 cinematic",
    "arc raiders trailer",
    "ufc knockouts",
    "pokemon trailers",
  ],
});

function programJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Showboat Theater — tonight's program",
    itemListElement: PROGRAM.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: entry.ytTitle,
        description: entry.blurb,
        thumbnailUrl: posterUrl(entry.id),
        embedUrl: embedUrl(entry.id),
        contentUrl: watchUrl(entry.id),
      },
    })),
  };
}

export default function VideosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Showboat Theater", path: "/videos" },
        ])}
      />
      <JsonLd data={programJsonLd()} />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Deck 3 · The Showboat Theater"
            title="An evening at the pictures."
            description="Seven reels on tonight's bill, hand picked by the house and shown on our own stage. Take a seat anywhere — the curtain does the rest."
          />
        </Container>
      </Section>

      <Section spacing="none" className="pb-24">
        <Container>
          <Theater />

          {/* the house dedication */}
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="inline-block border border-brass/40 px-8 py-4">
              <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-gold-light uppercase">
                The house stage
              </p>
              <p className="font-script mt-1.5 text-xl text-brass">
                for the ones we watch with
              </p>
            </div>
            <p className="mt-8 text-sm text-sage">
              Want your clip on this marquee? Member submissions open with the
              Saloon in Phase 2 — the squad votes the bill, the house runs the
              projector.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
