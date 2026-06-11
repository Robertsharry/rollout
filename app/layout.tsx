import type { Metadata, Viewport } from "next";
import {
  Cutive_Mono,
  Fraunces,
  Pinyon_Script,
  Source_Serif_4,
} from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "./globals.css";

import { auth } from "@/auth";
import { getSessionUser } from "@/auth";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { LenisProvider } from "@/components/effects/lenis-provider";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Navbar } from "@/components/site/navbar";
import { PorterTour } from "@/components/tour/porter-tour";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const cutive = Cutive_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cutive",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: "#152b21",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  // Ring the bell for whoever is checked in.
  let unread = 0;
  if (user) {
    const [{ unreadCounts }, session] = await Promise.all([
      import("@/lib/community"),
      auth().catch(() => null),
    ]);
    if (session?.user?.id) {
      const counts = await unreadCounts(session.user.id).catch(() => null);
      if (counts) unread = counts.notifications + counts.messages;
    }
  }

  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${sourceSerif.variable} ${fraunces.variable} ${pinyon.variable} ${cutive.variable} dark`}
        suppressHydrationWarning
      >
        <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:ring-1 focus:ring-brass"
          >
            Skip to content
          </a>

          <TooltipProvider>
            <LenisProvider>
              <Navbar user={user} unread={unread} />
              <main id="main" className="flex flex-1 flex-col">
                {children}
              </main>
              <Footer />
            </LenisProvider>
          </TooltipProvider>

          <NoiseOverlay />
          <CustomCursor />
          <PorterTour signedIn={Boolean(user)} />
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ViewTransitions>
  );
}
