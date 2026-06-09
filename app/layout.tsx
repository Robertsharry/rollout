import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "./globals.css";

import { getSessionUser } from "@/auth";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { LenisProvider } from "@/components/effects/lenis-provider";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Navbar } from "@/components/site/navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${inter.variable} ${chakra.variable} ${jetbrains.variable} dark`}
        suppressHydrationWarning
      >
        <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:ring-1 focus:ring-neon"
          >
            Skip to content
          </a>

          <TooltipProvider>
            <LenisProvider>
              <Navbar user={user} />
              <main id="main" className="flex flex-1 flex-col">
                {children}
              </main>
              <Footer />
            </LenisProvider>
          </TooltipProvider>

          <NoiseOverlay />
          <CustomCursor />
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ViewTransitions>
  );
}
