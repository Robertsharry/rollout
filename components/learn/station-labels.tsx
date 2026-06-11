"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

interface AttrToggle {
  key: string;
  label: string;
  desc: string;
}

const TOGGLES: AttrToggle[] = [
  { key: "target", label: "target", desc: "opens in new tab" },
  { key: "rel", label: "rel", desc: "safe to follow" },
  { key: "aria-label", label: "aria-label", desc: "what the screen reader says" },
  { key: "class", label: "class", desc: "which paint to wear" },
];

const PART_LABELS: Record<string, string> = {
  href: "href — the destination address",
  target: 'target="_blank" — open in a new tab',
  rel: "rel — a safety promise to the browser",
  "aria-label": "aria-label — what a screen reader announces",
  class: "class — which paint to wear",
  tag: "the <a> tag itself",
  content: "the visible text inside the tag",
};

export function StationLabels() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    target: true,
    rel: true,
    "aria-label": true,
    class: true,
  });
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const lines: CodeLine[] = [
    { text: "<a", id: "tag" },
    {
      text: '  href="https://discord.gg/rollout"',
      id: "href",
    },
    ...(enabled.target
      ? [{ text: '  target="_blank"', id: "target" }]
      : []),
    ...(enabled.rel
      ? [{ text: '  rel="noopener noreferrer"', id: "rel" }]
      : []),
    ...(enabled["aria-label"]
      ? [
          {
            text: '  aria-label="Join the Rollout Discord, opens in a new tab"',
            id: "aria-label",
          },
        ]
      : []),
    ...(enabled.class
      ? [{ text: '  class="btn btn-primary"', id: "class" }]
      : []),
    { text: ">", id: "tag" },
    { text: "  Join the Discord", id: "content" },
    { text: "</a>", id: "tag" },
  ];

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id],
  });

  const lit = (id: string) => active === id;
  const linkStyled = enabled.class;

  return (
    <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div>
        <CodeBlock
          title="footer.html — a link with its labels"
          lines={lines}
          activeId={active}
          onActivate={hover}
        />

        <div className="mt-4 space-y-2">
          <p className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
            Take an attribute off — see what it was doing
          </p>
          <div className="flex flex-wrap gap-2">
            {TOGGLES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() =>
                  setEnabled((e) => ({ ...e, [t.key]: !e[t.key] }))
                }
                onMouseEnter={() => hover(t.key)}
                onMouseLeave={() => hover(null)}
                aria-pressed={enabled[t.key]}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
                  enabled[t.key]
                    ? "border-brass bg-primary text-primary-foreground"
                    : "border-border text-sage line-through hover:border-brass/60",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Hover any attribute or any tag on the right — both light up. Toggle one off and watch what disappears."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* href annotation */}
        <div
          {...partProps("href")}
          className={cn(
            "cursor-pointer rounded-md border bg-card/40 p-3 transition-all",
            lit("href")
              ? "border-gold-light ring-2 ring-gold-light/60"
              : "border-border",
          )}
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
            Goes to
          </p>
          <p className="mt-1 font-mono text-sm text-foreground/95">
            https://discord.gg/rollout
          </p>
        </div>

        {/* aria-label speech bubble */}
        <div
          {...partProps("aria-label")}
          className={cn(
            "cursor-pointer rounded-md border p-3 transition-all",
            lit("aria-label")
              ? "border-gold-light bg-card/60 ring-2 ring-gold-light/60"
              : "border-dashed border-sage/40 bg-card/30",
          )}
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
            {enabled["aria-label"]
              ? "Screen reader says"
              : "Screen reader falls back to the visible text"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/95">
            <span aria-hidden>“</span>
            {enabled["aria-label"]
              ? "Join the Rollout Discord, opens in a new tab"
              : "Join the Discord"}
            <span aria-hidden>”</span>
          </p>
        </div>

        {/* the rendered link with its annotations */}
        <div className="rounded-md border border-border bg-card/30 p-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
            How it actually shows up
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              {...partProps("tag")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold transition-all",
                linkStyled
                  ? "rounded-md bg-primary text-primary-foreground"
                  : "text-foreground underline",
                lit("tag") || lit("class")
                  ? "ring-2 ring-gold-light"
                  : "",
                lit("content") && "underline decoration-gold-light decoration-2 underline-offset-4",
              )}
            >
              <span {...partProps("content")} className="cursor-pointer">
                Join the Discord
              </span>
              {enabled.target ? <span aria-hidden>↗</span> : null}
            </span>

            <span
              {...partProps("target")}
              className={cn(
                "cursor-pointer rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
                enabled.target
                  ? lit("target")
                    ? "border-gold-light bg-card text-gold-light"
                    : "border-border text-sage"
                  : "border-dashed border-oxblood-bright/40 text-oxblood-bright/70 line-through",
              )}
            >
              new tab
            </span>

            <span
              {...partProps("rel")}
              className={cn(
                "cursor-pointer rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
                enabled.rel
                  ? lit("rel")
                    ? "border-gold-light bg-card text-gold-light"
                    : "border-border text-sage"
                  : "border-dashed border-oxblood-bright/40 text-oxblood-bright/70",
              )}
            >
              {enabled.rel ? "safe link" : "leaks window.opener"}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-sage">
          Every attribute does one small job. Take them off, the tag still
          works — it just stops doing that one thing. That is how every label
          on the web is built, from a navbar link to a video iframe.
        </p>
      </div>
    </div>
  );
}
