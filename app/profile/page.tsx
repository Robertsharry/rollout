import { LogOut, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container, Section } from "@/components/site/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/lib/auth-actions";
import { isAuthConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Profile",
  path: "/profile",
  noIndex: true,
});

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </div>
  );
}

export default async function ProfilePage() {
  const session = isAuthConfigured ? await auth().catch(() => null) : null;
  if (!session?.user) redirect("/signin");

  const user = session.user;
  const initials = (user.name ?? "U").slice(0, 2).toUpperCase();

  return (
    <Section spacing="none" className="pt-28 pb-24">
      <Container className="max-w-2xl">
        <div className="glass relative overflow-hidden rounded-2xl p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 size-64 rounded-full bg-neon/10 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar className="size-20 ring-2 ring-neon/40">
              <AvatarImage src={user.image ?? undefined} alt="" />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold">
                {user.name ?? "Operator"}
              </h1>
              {user.email ? (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="size-3.5 text-neon" />
                  Member
                </Badge>
              </div>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Status" value="Active" />
            <InfoCard label="Joined via" value="Discord" />
          </div>

          <div className="relative mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Profile customization, badges, and post history arrive in Phase 2.
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-destructive/50 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
