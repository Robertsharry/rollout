"use client";

import { cn } from "@/lib/utils";

export interface CodeLine {
  text: string;
  /** Lines sharing an id light up together with their matching diagram part. */
  id?: string;
}

interface CodeBlockProps {
  title: string;
  lines: CodeLine[];
  /** Either a single id, an array of ids, or null. Lines with a matching id light up. */
  activeId?: string | string[] | null;
  onActivate?: (id: string | null) => void;
}

/**
 * The Engine Room's code display: plain text lines, no highlighter library,
 * wired so hovering a line lights the matching part of the live demo.
 */
export function CodeBlock({ title, lines, activeId, onActivate }: CodeBlockProps) {
  const activeSet =
    Array.isArray(activeId)
      ? new Set(activeId)
      : activeId
        ? new Set([activeId])
        : null;
  return (
    <div className="overflow-hidden rounded-lg border border-brass/30 bg-[#10130E]">
      <div className="flex items-center justify-between border-b border-brass/25 bg-[#171B14] px-4 py-2">
        <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
          {title}
        </span>
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-oxblood-bright/70" />
          <span className="size-2 rounded-full bg-gold-light/70" />
          <span className="size-2 rounded-full bg-sage/70" />
        </span>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        {lines.map((line, i) => {
          const interactive = Boolean(line.id && onActivate);
          const active = line.id && activeSet?.has(line.id);
          return (
            <div
              key={i}
              onMouseEnter={interactive ? () => onActivate!(line.id!) : undefined}
              onMouseLeave={interactive ? () => onActivate!(null) : undefined}
              onClick={interactive ? () => onActivate!(active ? null : line.id!) : undefined}
              className={cn(
                "flex gap-3 rounded-sm px-2 transition-colors",
                interactive && "cursor-pointer",
                active
                  ? "bg-brass/15 text-gold-light"
                  : "text-[#B9C9B4]",
                interactive && !active && "hover:bg-brass/10",
              )}
            >
              <span className="w-5 shrink-0 text-right font-mono text-[11px] leading-relaxed text-sage/40 select-none">
                {i + 1}
              </span>
              <code className="font-mono whitespace-pre">{line.text}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
