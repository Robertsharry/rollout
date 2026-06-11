import { chalkArcadeBest } from "@/app/arcade/actions";
import { Topside } from "@/components/arcade/topside";
import { currentUser } from "@/lib/auth-helpers";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Topside — Free Formation Shooter",
  description:
    "An original deck gun shooter: wasp formations assemble, break, and dive. Two shells in the air at a time, a bonus swarm every third wave.",
  path: "/arcade/topside",
});

export default async function TopsidePage() {
  const user = await currentUser();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Penny Arcade", path: "/arcade" },
          { name: "Topside", path: "/arcade/topside" },
        ])}
      />
      <Section spacing="none" className="pt-28 pb-20">
        <Container>
          <Topside chalk={{ signedIn: Boolean(user), action: chalkArcadeBest }} />
        </Container>
      </Section>
    </>
  );
}
