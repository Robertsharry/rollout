import { ComingSoon } from "@/components/site/coming-soon";
import { buildMetadata } from "@/lib/seo";
import { SECTION_BY_SLUG } from "@/lib/site";

const section = SECTION_BY_SLUG.donate;

export const metadata = buildMetadata({
  title: section.title,
  description: section.blurb,
  path: "/donate",
});

export default function DonatePage() {
  return (
    <ComingSoon
      title={section.title}
      blurb={section.blurb}
      icon={section.icon}
      accent={section.accent}
      phase={section.phase}
    />
  );
}
