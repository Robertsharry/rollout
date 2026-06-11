import { chalkArcadeBest } from "@/app/arcade/actions";
import { ChipChase } from "@/components/arcade/chip-chase";
import { currentUser } from "@/lib/auth-helpers";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Chip Chase — Free Maze Arcade Game",
  description:
    "An original house maze chase: pocket every chip, dodge four card sharps with four different hunting styles, and flip the tables with house markers.",
  path: "/arcade/chip-chase",
});

export default async function ChipChasePage() {
  const user = await currentUser();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Penny Arcade", path: "/arcade" },
          { name: "Chip Chase", path: "/arcade/chip-chase" },
        ])}
      />
      <Section spacing="none" className="pt-28 pb-20">
        <Container>
          <ChipChase chalk={{ signedIn: Boolean(user), action: chalkArcadeBest }} />
        </Container>
      </Section>
    </>
  );
}
