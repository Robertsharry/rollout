"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const PART_LABELS: Record<string, string> = {
  body: "<body> — everything visible on the page",
  header: "<header> — the strip across the top of every page",
  nav: "<nav> — the row of links inside the header",
  main: "<main> — the unique content of THIS page",
  article: "<article> — a single self-contained reading",
  aside: "<aside> — related but secondary content",
  footer: "<footer> — the strip across the bottom",
};

const LINES: CodeLine[] = [
  { text: "<body>", id: "body" },
  { text: "  <header>", id: "header" },
  { text: "    <a>ROLLOUT</a>", id: "header" },
  { text: "    <nav>", id: "nav" },
  { text: "      <a>Games</a>", id: "nav" },
  { text: "      <a>Theater</a>", id: "nav" },
  { text: "      <a>Engine Room</a>", id: "nav" },
  { text: "    </nav>", id: "nav" },
  { text: "  </header>", id: "header" },
  { text: "  <main>", id: "main" },
  { text: "    <article>", id: "article" },
  { text: "      <h1>The signposts</h1>", id: "article" },
  { text: "      <p>The lesson body…</p>", id: "article" },
  { text: "    </article>", id: "article" },
  { text: "    <aside>", id: "aside" },
  { text: "      <p>What you just learned</p>", id: "aside" },
  { text: "    </aside>", id: "aside" },
  { text: "  </main>", id: "main" },
  { text: "  <footer>", id: "footer" },
  { text: "    <p>Built by the squad</p>", id: "footer" },
  { text: "  </footer>", id: "footer" },
  { text: "</body>", id: "body" },
];

const CHILDREN_OF: Record<string, string[]> = {
  body: ["header", "nav", "main", "article", "aside", "footer"],
  header: ["nav"],
  main: ["article", "aside"],
};

export function StationSignposts() {
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id],
  });

  const lit = (id: string) => {
    if (active === id) return "self";
    if (active && CHILDREN_OF[active]?.includes(id)) return "child";
    return false;
  };

  const ringClass = (id: string) => {
    const state = lit(id);
    if (state === "self") return "ring-2 ring-gold-light";
    if (state === "child") return "ring-1 ring-gold-light/50";
    return "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CodeBlock
        title="page.html — the page as named rooms"
        lines={LINES}
        activeId={active}
        onActivate={hover}
      />

      <div>
        <div
          {...partProps("body")}
          className={cn(
            "cursor-pointer rounded-md border border-brass/30 bg-card/40 p-2 transition-all",
            ringClass("body"),
          )}
        >
          <p className="mb-1 font-mono text-[10px] tracking-[0.14em] text-sage/70 uppercase">
            &lt;body&gt;
          </p>

          {/* header */}
          <div
            {...partProps("header")}
            className={cn(
              "cursor-pointer rounded-sm border border-border bg-mahogany/30 p-2 transition-all",
              ringClass("header"),
            )}
          >
            <p className="font-mono text-[9px] tracking-[0.18em] text-gold-light uppercase">
              &lt;header&gt;
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="font-display text-[11px] font-bold tracking-wider text-foreground/90">
                ROLLOUT
              </span>
              <div
                {...partProps("nav")}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-sm border border-border bg-card/40 px-2 py-1 transition-all",
                  ringClass("nav"),
                )}
              >
                <span className="font-mono text-[8px] tracking-[0.18em] text-gold-light uppercase">
                  &lt;nav&gt;
                </span>
                <span className="font-mono text-[9px] tracking-[0.1em] text-sage">
                  Games · Theater · Engine Room
                </span>
              </div>
            </div>
          </div>

          {/* main */}
          <div
            {...partProps("main")}
            className={cn(
              "mt-2 cursor-pointer rounded-sm border border-border p-2 transition-all",
              ringClass("main"),
            )}
          >
            <p className="font-mono text-[9px] tracking-[0.18em] text-gold-light uppercase">
              &lt;main&gt;
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_1fr]">
              <div
                {...partProps("article")}
                className={cn(
                  "cursor-pointer rounded-sm border border-border bg-card/40 p-2 transition-all",
                  ringClass("article"),
                )}
              >
                <p className="font-mono text-[8px] tracking-[0.18em] text-gold-light uppercase">
                  &lt;article&gt;
                </p>
                <p className="mt-1.5 font-display text-sm font-bold leading-tight text-foreground/95">
                  The signposts
                </p>
                <p className="mt-1 text-[10px] leading-snug text-sage">
                  The lesson body lives here — one self contained reading.
                </p>
              </div>
              <div
                {...partProps("aside")}
                className={cn(
                  "cursor-pointer rounded-sm border border-border bg-card/40 p-2 transition-all",
                  ringClass("aside"),
                )}
              >
                <p className="font-mono text-[8px] tracking-[0.18em] text-gold-light uppercase">
                  &lt;aside&gt;
                </p>
                <p className="mt-1.5 text-[10px] leading-snug text-sage">
                  What you just learned
                </p>
              </div>
            </div>
          </div>

          {/* footer */}
          <div
            {...partProps("footer")}
            className={cn(
              "mt-2 cursor-pointer rounded-sm border border-border bg-mahogany/30 px-2 py-1.5 text-center transition-all",
              ringClass("footer"),
            )}
          >
            <p className="font-mono text-[9px] tracking-[0.18em] text-gold-light uppercase">
              &lt;footer&gt;
            </p>
            <p className="mt-1 text-[10px] leading-snug text-sage">
              Built by the squad · ©
            </p>
          </div>
        </div>

        <div className="mt-3 flex min-h-10 items-center rounded-md border border-border bg-card/50 px-4 py-2">
          <p className="font-mono text-xs tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Hover any tag or any region — every page on this site is laid out by these same five rooms."}
          </p>
        </div>
      </div>
    </div>
  );
}
