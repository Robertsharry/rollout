import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark, show only the mark (e.g. tight mobile spots). */
  markOnly?: boolean;
}

export function Logo({ className, markOnly }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-md bg-neon/15 ring-1 ring-neon/40">
        <span className="font-display text-sm font-extrabold text-neon">R</span>
        <span
          aria-hidden
          className="absolute inset-0 rounded-md bg-neon/20 opacity-0 blur-md transition-opacity duration-300 group-hover/logo:opacity-100"
        />
      </span>
      {!markOnly ? (
        <span className="font-display text-lg font-extrabold tracking-wider">
          {SITE.name}
        </span>
      ) : null}
    </span>
  );
}
