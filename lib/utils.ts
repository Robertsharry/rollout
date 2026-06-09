import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { SITE } from "@/lib/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Build an absolute URL from a site-relative path (for OG/canonical/sitemap). */
export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString()
}

/** Compact number formatting for stats, e.g. 4200 -> "4.2K". */
export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}
