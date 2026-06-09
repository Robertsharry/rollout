import { ComingSoon } from "@/components/site/coming-soon";
import { buildMetadata } from "@/lib/seo";
import { SECTION_BY_SLUG } from "@/lib/site";

const section = SECTION_BY_SLUG.leaderboard;

export const metadata = buildMetadata({
  title: section.title,
  description: section.blurb,
  path: "/leaderboard",
});

export default function LeaderboardPage() {
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
