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

/** "just now", "12m ago", "3h ago", "2d ago", else a short date. */
export function formatRelative(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 14) return `${days}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
