"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface Slip {
  name: string;
  brief: string;
  html: string;
  css: string;
}

const SLIPS: Slip[] = [
  {
    name: "Blank slip",
    brief: "An empty hull. Build whatever you want.",
    html: `<h1>My first build</h1>\n<p>Straight from the dry dock.</p>`,
    css: `h1 {\n  color: #C9A14E;\n  font-family: Georgia, serif;\n}\np {\n  color: #B9C9B4;\n}`,
  },
  {
    name: "The marquee",
    brief: "Build a little marquee: a framed box, a heading, a line of small print under it.",
    html: `<div class="marquee">\n  <h1>Now showing</h1>\n  <p>Your name in lights</p>\n</div>`,
    css: `.marquee {\n  border: 2px solid #C9A14E;\n  padding: 24px;\n  text-align: center;\n  background: #241A12;\n}\nh1 {\n  color: #E3C77E;\n  letter-spacing: 4px;\n  margin: 0;\n}\np {\n  color: #B9C9B4;\n  letter-spacing: 2px;\n}`,
  },
  {
    name: "Daylight livery",
    brief: "Repaint the card below for daylight: parchment background, ink text, keep the brass.",
    html: `<div class="card">\n  <span class="kicker">Munitions deck</span>\n  <h2>Helldivers 2</h2>\n  <p>Loadouts for every planet.</p>\n</div>`,
    css: `.card {\n  background: #1E3A2C;\n  color: #EFE6CF;\n  border: 1px solid #C9A14E;\n  padding: 20px;\n  font-family: Georgia, serif;\n}\n.kicker {\n  color: #C9A14E;\n  font-size: 12px;\n  letter-spacing: 3px;\n  text-transform: uppercase;\n}`,
  },
  {
    name: "Your own curtain",
    brief: "Two velvet halves and a transition. Make them part when the box is hovered.",
    html: `<div class="stage">\n  <div class="curtain left"></div>\n  <div class="curtain right"></div>\n  <p class="reel">The picture</p>\n</div>`,
    css: `.stage {\n  position: relative;\n  height: 180px;\n  background: #070B08;\n  overflow: hidden;\n}\n.reel {\n  color: #E3C77E;\n  text-align: center;\n  line-height: 180px;\n  margin: 0;\n  font-family: Georgia, serif;\n}\n.curtain {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 52%;\n  background: repeating-linear-gradient(90deg, #571E22 0 7px, #87333A 14px, #571E22 28px);\n  transition: transform 700ms cubic-bezier(0.65, 0, 0.35, 1);\n}\n.curtain.left { left: 0; }\n.curtain.right { right: 0; }\n.stage:hover .curtain.left { transform: translateX(-103%); }\n.stage:hover .curtain.right { transform: translateX(103%); }`,
  },
];

export function StationDryDock() {
  const [slip, setSlip] = useState(0);
  const [html, setHtml] = useState(SLIPS[0].html);
  const [css, setCss] = useState(SLIPS[0].css);

  const loadSlip = (index: number) => {
    setSlip(index);
    setHtml(SLIPS[index].html);
    setCss(SLIPS[index].css);
  };

  const doc = `<!doctype html><html><head><style>
    body { margin: 16px; background: #10130E; font-family: Georgia, serif; }
    ${css}
  </style></head><body>${html}</body></html>`;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SLIPS.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => loadSlip(i)}
            aria-pressed={slip === i}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
              slip === i
                ? "border-brass bg-primary text-primary-foreground"
                : "border-border text-sage hover:border-brass/60 hover:text-foreground",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-sage">{SLIPS[slip].brief}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
              The bones — HTML
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={9}
              spellCheck={false}
              className="mt-2 w-full rounded-md border border-brass/30 bg-[#10130E] p-3 font-mono text-[13px] leading-relaxed text-[#B9C9B4] outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
              The paint — CSS
            </label>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              rows={11}
              spellCheck={false}
              className="mt-2 w-full rounded-md border border-brass/30 bg-[#10130E] p-3 font-mono text-[13px] leading-relaxed text-[#B9C9B4] outline-none focus:border-brass"
            />
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
            The slip — rendered live
          </p>
          <div className="mt-2 overflow-hidden rounded-md border border-brass/40 bg-[#10130E]">
            <iframe
              title="Your build, rendered"
              sandbox=""
              srcDoc={doc}
              className="h-[420px] w-full"
            />
          </div>
          <p className="mt-2 text-xs text-sage">
            The slip runs with scripts off — pure bones and paint. Copy your
            work somewhere safe before you leave; the dry dock keeps no
            records.
          </p>
        </div>
      </div>
    </div>
  );
}
