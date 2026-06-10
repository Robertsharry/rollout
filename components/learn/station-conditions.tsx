"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 6px, #87333A 12px, #6E262B 18px, #571E22 24px)";

type Status = "intermission" | "ready" | "running";

const PART_LABELS: Record<string, string> = {
  intermission: "branch: status === 'intermission' — show the curtain",
  ready: "branch: status === 'ready' — show the picture, no marquee yet",
  running: "branch: status === 'running' — show the picture AND the marquee",
  state: "the status variable — drives every branch below",
  curtain: "the velvet — shown only on the intermission branch",
  picture: "the picture — shown on the ready and running branches",
  marquee: "the marquee — added only on the running branch with &&",
};

export function StationConditions() {
  const [status, setStatus] = useState<Status>("intermission");
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const lines: CodeLine[] = [
    { text: `let status = "${status}";`, id: "state" },
    { text: "" },
    { text: "function Stage() {" },
    { text: "  return (" },
    {
      text: '    status === "intermission" ? <Curtain />',
      id: "intermission",
    },
    {
      text: '    : status === "ready"      ? <Picture />',
      id: "ready",
    },
    {
      text: '    : (',
      id: "running",
    },
    {
      text: '        <>',
      id: "running",
    },
    {
      text: '          <Picture />',
      id: "running",
    },
    {
      text: '          <Marquee />',
      id: "running",
    },
    {
      text: '        </>',
      id: "running",
    },
    {
      text: '      )',
      id: "running",
    },
    { text: "  );" },
    { text: "}" },
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

  // Highlight rules: the active branch + the parts it draws
  const ringCurtain =
    status === "intermission" &&
    (lit("intermission") || lit("curtain") || lit("state"));
  const ringPicture =
    (status === "ready" || status === "running") &&
    (lit("ready") ||
      lit("running") ||
      lit("picture") ||
      lit("state"));
  const ringMarquee =
    status === "running" && (lit("running") || lit("marquee") || lit("state"));

  const branchActive = (branch: Status) => status === branch;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="stage.tsx — the conditional under the hood"
          lines={lines}
          activeId={active}
          onActivate={hover}
        />

        <div className="mt-4 space-y-2">
          <p className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
            Set the status — pick a branch
          </p>
          <div className="flex flex-wrap gap-2">
            {(["intermission", "ready", "running"] as Status[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                onMouseEnter={() => hover(s)}
                onMouseLeave={() => hover(null)}
                aria-pressed={status === s}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                  status === s
                    ? "border-brass bg-primary text-primary-foreground"
                    : "border-border text-sage hover:border-brass/60 hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Pick a status. Only the matching branch runs; the others are not drawn at all."}
          </p>
        </div>
      </div>

      <div>
        <div className="relative rounded-lg border border-brass/40 bg-[#241A12] p-3">
          <div
            {...partProps("marquee")}
            className={cn(
              "cursor-pointer rounded-sm border bg-[#2E2218] px-3 py-2 text-center font-display text-[11px] font-semibold tracking-[0.22em] uppercase transition-all",
              status === "running" ? "border-brass/40 text-gold-light" : "border-dashed border-sage/20 text-sage/30",
              ringMarquee && "border-gold-light ring-2 ring-gold-light/70",
            )}
          >
            {status === "running"
              ? "Now showing · Captain's welcome"
              : "(marquee not rendered)"}
          </div>

          <div className="relative mt-2 aspect-video overflow-hidden rounded-sm bg-[#070B08]">
            <div
              {...partProps("picture")}
              className={cn(
                "absolute inset-0 cursor-pointer transition-all duration-300",
                status === "intermission" ? "opacity-0" : "opacity-100",
                ringPicture && "ring-2 ring-gold-light",
              )}
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #E6C375 0%, #8A5F1E 55%, #1A1208 100%)",
              }}
            />

            <div
              {...partProps("curtain")}
              aria-hidden={status !== "intermission"}
              className={cn(
                "absolute inset-y-0 left-0 z-10 w-[52%] cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
                ringCurtain && "outline outline-2 -outline-offset-2 outline-gold-light",
              )}
              style={{
                background: VELVET,
                transform:
                  status === "intermission" ? "translateX(0)" : "translateX(-103%)",
              }}
            />
            <div
              {...partProps("curtain")}
              aria-hidden={status !== "intermission"}
              className={cn(
                "absolute inset-y-0 right-0 z-10 w-[52%] cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
                ringCurtain && "outline outline-2 -outline-offset-2 outline-gold-light",
              )}
              style={{
                background: VELVET,
                transform:
                  status === "intermission" ? "translateX(0)" : "translateX(103%)",
              }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {(
            [
              { id: "intermission" as Status, label: "intermission → only <Curtain />" },
              { id: "ready" as Status, label: "ready → only <Picture />" },
              { id: "running" as Status, label: "running → <Picture /> + <Marquee />" },
            ]
          ).map((b) => (
            <div
              key={b.id}
              {...partProps(b.id)}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-all",
                branchActive(b.id)
                  ? "border-brass bg-card/60 text-gold-light"
                  : "border-border bg-card/30 text-sage",
                lit(b.id) && "ring-2 ring-gold-light",
              )}
            >
              {b.label}
              {branchActive(b.id) ? (
                <span className="ml-2 text-foreground/60">· active</span>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-sage">
          A condition is the boat&apos;s fork in the road.{" "}
          <code className="font-mono">status === &apos;intermission&apos;</code>{" "}
          draws the curtain; otherwise the picture. Branches the condition does
          not take are not drawn at all — the browser never sees them. That
          economy is the whole point.
        </p>
      </div>
    </div>
  );
}
