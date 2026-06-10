import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/**
 * The house mark: a brass roundel that reads as both a card room chip and a
 * paddlewheel — twelve spokes between two rings, diamond at center.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className={cn("text-brass", className)}
    >
      <circle cx="32" cy="32" r="31" style={{ fill: "var(--card)" }} />
      <circle
        cx="32"
        cy="32"
        r="29.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* twelve paddle spokes via dashed stroke */}
      <circle
        cx="32"
        cy="32"
        r="26.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeDasharray="2.6 11.27"
        strokeDashoffset="1.3"
      />
      <circle
        cx="32"
        cy="32"
        r="23.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.8"
      />
      <path d="M32 20.5 L43.5 32 L32 43.5 L20.5 32 Z" fill="currentColor" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Hide the wordmark, show only the mark (e.g. tight mobile spots). */
  markOnly?: boolean;
}

export function Logo({ className, markOnly }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8" />
      {!markOnly ? (
        <span className="font-display text-lg font-bold tracking-[0.18em]">
          {SITE.name}
        </span>
      ) : null}
    </span>
  );
}
