"use client";

import { useEffect, useRef, useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

type Stage = "idle" | "collect" | "send" | "process" | "respond" | "done";

const PART_LABELS: Record<string, string> = {
  "use-server": '"use server" — this code runs on the server, not in the browser',
  action: "action={donate} — wires the form's submit to the server function",
  input: 'name="amount" — the key the form posts under',
  button: "the submit button — the only thing the user clicks",
  "form-data": 'formData.get("amount") — pulls the value out of the request',
  "return": "return { … } — what the server sends back to the browser",
};

const STAGES: { id: Stage; label: string; sub: string }[] = [
  { id: "collect", label: "1 · Collect", sub: "browser packs the form into a request" },
  { id: "send", label: "2 · Send", sub: "request travels across the wires" },
  { id: "process", label: "3 · Server runs", sub: "donate(formData) executes on our server" },
  { id: "respond", label: "4 · Respond", sub: "server hands a result back to the browser" },
  { id: "done", label: "5 · React updates", sub: "the page rerenders with the result" },
];

export function StationSignal() {
  const [amount, setAmount] = useState("25");
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setResult(null);
    setStage("collect");
    timers.current.push(setTimeout(() => setStage("send"), 500));
    timers.current.push(setTimeout(() => setStage("process"), 1100));
    timers.current.push(setTimeout(() => setStage("respond"), 1900));
    timers.current.push(setTimeout(() => {
      setStage("done");
      setResult(`Thanks for the patronage of $${amount || "0"}`);
    }, 2500));
    timers.current.push(setTimeout(() => setStage("idle"), 4500));
  };

  const hover = (id: string | null) => setActive(id);

  const lines: CodeLine[] = [
    { text: "// actions.ts — runs on the SERVER" },
    { text: '"use server";', id: "use-server" },
    { text: "" },
    { text: "export async function donate(formData) {", id: "use-server" },
    { text: '  const amount = formData.get("amount");', id: "form-data" },
    { text: "  // talk to Stripe here, save to the database, etc." },
    { text: "  return { ok: true, amount };", id: "return" },
    { text: "}" },
    { text: "" },
    { text: "// page.tsx — rendered on the server, shipped to BROWSER" },
    { text: "<form action={donate}>", id: "action" },
    { text: '  <input name="amount" type="number" />', id: "input" },
    { text: "  <button type=\"submit\">Send it</button>", id: "button" },
    { text: "</form>" },
  ];

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id] ?? id,
  });

  const lit = (id: string) => active === id;
  const ring = (id: string) =>
    lit(id) ? "ring-2 ring-gold-light" : "";

  const stageIndex = (s: Stage) => STAGES.findIndex((x) => x.id === s);
  const currentIdx = stageIndex(stage);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="donate.ts — one form, two sides of the wire"
          lines={lines}
          activeId={active}
          onActivate={hover}
        />

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Hover any line. Then press Send it and watch every leg of the round trip light up in order."}
          </p>
        </div>
      </div>

      <div>
        {/* the form — browser side */}
        <div className="rounded-md border border-brass/40 bg-card/40 p-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
            Browser
          </p>
          <form onSubmit={send} className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="block font-display text-sm font-semibold text-foreground/95">
                How much do you mean?
              </span>
              <input
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onMouseEnter={() => hover("input")}
                onMouseLeave={() => hover(null)}
                onFocus={() => hover("input")}
                onBlur={() => hover(null)}
                className={cn(
                  "mt-1 w-full rounded-sm border border-border bg-background/60 px-3 py-2 font-mono text-lg outline-none transition-all focus:border-brass",
                  ring("input"),
                )}
              />
            </label>
            <button
              type="submit"
              disabled={stage !== "idle"}
              {...partProps("button")}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-60",
                ring("button"),
              )}
            >
              {stage === "idle" ? "Send it ☞" : "Sending…"}
            </button>
          </form>
        </div>

        {/* the trip */}
        <ol className="mt-4 space-y-2">
          {STAGES.map((s, i) => {
            const reached = currentIdx >= i;
            const current = stage === s.id;
            return (
              <li
                key={s.id}
                className={cn(
                  "rounded-md border px-3 py-2 transition-all",
                  current
                    ? "border-gold-light bg-card/70 ring-2 ring-gold-light/40"
                    : reached
                      ? "border-brass/40 bg-card/50"
                      : "border-border bg-card/20",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "font-mono text-[11px] tracking-[0.16em] uppercase",
                      current
                        ? "text-gold-light"
                        : reached
                          ? "text-foreground/90"
                          : "text-sage/60",
                    )}
                  >
                    {s.label}
                  </p>
                  {s.id === "process" ? (
                    <span className="font-mono text-[9px] tracking-[0.18em] text-oxblood-bright/70 uppercase">
                      server
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs leading-snug text-sage">{s.sub}</p>
              </li>
            );
          })}
        </ol>

        {result ? (
          <div className="mt-3 rounded-md border border-gold-light/60 bg-card/60 px-4 py-2">
            <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
              The server&apos;s reply
            </p>
            <p className="mt-1 text-sm text-foreground/95">{result}</p>
          </div>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-sage">
          A server action is a function the browser is allowed to call as if
          it were local — except it actually runs on our machine, with access
          to Stripe and the database. The{" "}
          <code className="font-mono">&quot;use server&quot;</code> line at the
          top of the file is the whole magic. Everything else is plain
          JavaScript.
        </p>
      </div>
    </div>
  );
}
