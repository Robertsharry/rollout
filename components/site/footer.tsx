import { Link } from "next-view-transitions";

import { DiscordButton } from "@/components/site/discord-button";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/site/section";
import { GAMES, SECTIONS, SITE } from "@/lib/site";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Games",
    links: GAMES.map((g) => ({ label: g.name, href: `/${g.slug}` })),
  },
  {
    title: "Community",
    links: SECTIONS.filter((s) => s.slug !== "donate").map((s) => ({
      label: s.title,
      href: `/${s.slug}`,
    })),
  },
  {
    title: "Support",
    links: [
      { label: "Support us", href: "/donate" },
      { label: "Profile", href: "/profile" },
      { label: "Sign in", href: "/signin" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-border/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {SITE.tagline}
            </p>
            <div className="mt-5">
              <DiscordButton />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {SITE.name}. Built by the community, for the squad.
          </p>
          <p className="font-mono text-xs tracking-wider">
            Not affiliated with any game publisher.
          </p>
        </div>
      </Container>
    </footer>
  );
}
