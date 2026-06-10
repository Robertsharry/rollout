import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DiscordIcon } from "@/components/site/discord-button";
import { Logo } from "@/components/site/logo";
import { Container, Section } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { signInDiscord } from "@/lib/auth-actions";
import { isAuthConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to Rollout with Discord.",
  path: "/signin",
  noIndex: true,
});

export default async function SignInPage() {
  const session = isAuthConfigured ? await auth().catch(() => null) : null;
  if (session?.user) redirect("/profile");

  return (
    <Section spacing="lg" className="grid min-h-[82vh] place-items-center">
      <Container className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-brass/15 blur-[120px]"
        />
        <div className="mx-auto w-full max-w-md">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold">
              Welcome back to the house
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Check in with Discord to post, climb the house board, and take
              your seat at the table.
            </p>

            {isAuthConfigured ? (
              <form action={signInDiscord} className="mt-7">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4]"
                >
                  <DiscordIcon className="size-5" />
                  Continue with Discord
                </button>
              </form>
            ) : (
              <div className="mt-7 rounded-lg border border-border bg-card/50 p-4 text-left text-sm text-muted-foreground">
                Discord login isn’t wired up yet. Add{" "}
                <code className="font-mono text-xs text-brass">AUTH_DISCORD_ID</code>{" "}
                and{" "}
                <code className="font-mono text-xs text-brass">
                  AUTH_DISCORD_SECRET
                </code>{" "}
                to enable it.
              </div>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              House rules are simple: be good to the squad.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost" }), "h-9")}
            >
              <ArrowLeft className="size-4" />
              Return to the foyer
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
