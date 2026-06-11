import { chalkArcadeBest } from "@/app/arcade/actions";
import { BoilerDig } from "@/components/arcade/boiler-dig";
import { currentUser } from "@/lib/auth-helpers";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Boiler Dig — Free Digging Arcade Game",
  description:
    "An original tunnel digger below decks: carve the soot, vent rust mites with the steam lance, and drop loose cargo on anything that skitters.",
  path: "/arcade/boiler-dig",
});

export default async function BoilerDigPage() {
  const user = await currentUser();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Penny Arcade", path: "/arcade" },
          { name: "Boiler Dig", path: "/arcade/boiler-dig" },
        ])}
      />
      <Section spacing="none" className="pt-28 pb-20">
        <Container>
          <BoilerDig chalk={{ signedIn: Boolean(user), action: chalkArcadeBest }} />
        </Container>
      </Section>
    </>
  );
}
