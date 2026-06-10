"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const PART_LABELS: Record<string, string> = {
  form: "<form> — the envelope the data travels in",
  label: "<label> — the prompt tied to the field",
  input: "<input> — the box the patron writes in",
  button: '<button type="submit"> — the lever that sends it',
  action: 'action="/donate" — where the envelope goes',
  name: 'name="amount" — the key the value gets posted under',
};

export function StationForms() {
  const [amount, setAmount] = useState("25");
  const [sent, setSent] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const lines: CodeLine[] = [
    { text: '<form action="/donate" method="POST">', id: "form" },
    { text: '  <label for="amount">', id: "label" },
    { text: "    How much do you mean?", id: "label" },
    { text: "  </label>", id: "label" },
    {
      text: `  <input id="amount" name="amount" type="number" value="${amount}" />`,
      id: "input",
    },
    { text: '  <button type="submit">', id: "button" },
    { text: "    Send it", id: "button" },
    { text: "  </button>", id: "button" },
    { text: "</form>", id: "form" },
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(amount);
    setTimeout(() => setSent(null), 2400);
  };

  const ring = (id: string) =>
    lit(id) ? "ring-2 ring-gold-light" : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CodeBlock
        title="donate.html — a form is just an envelope"
        lines={lines}
        activeId={active}
        onActivate={hover}
      />

      <div>
        <form
          onSubmit={submit}
          {...partProps("form")}
          className={cn(
            "cursor-pointer rounded-md border border-brass/40 bg-card/40 p-5 transition-all",
            ring("form"),
          )}
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/70 uppercase">
            &lt;form&gt;
          </p>

          <div className="mt-4 space-y-1.5">
            <label
              htmlFor="amount"
              {...partProps("label")}
              className={cn(
                "block cursor-pointer rounded-sm px-2 py-1 font-display text-base font-semibold text-foreground/95 transition-all",
                ring("label"),
              )}
            >
              How much do you mean?
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onMouseEnter={() => hover("input")}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover("input")}
              onBlur={() => hover(null)}
              aria-label={PART_LABELS.input}
              className={cn(
                "w-full rounded-sm border border-border bg-background/60 px-3 py-2 font-mono text-lg text-foreground outline-none transition-all focus:border-brass",
                ring("input"),
              )}
            />
            <p className="font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
              Each keystroke becomes the value attribute
            </p>
          </div>

          <button
            type="submit"
            {...partProps("button")}
            className={cn(
              "mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110",
              ring("button"),
            )}
          >
            Send it <span aria-hidden>☞</span>
          </button>
        </form>

        <div
          className={cn(
            "mt-4 rounded-md border border-dashed p-4 transition-all",
            sent
              ? "border-gold-light/70 bg-card/50"
              : "border-border bg-card/30",
          )}
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/70 uppercase">
            What the form sends
          </p>
          {sent ? (
            <p className="mt-2 font-mono text-sm leading-relaxed text-gold-light">
              POST /donate
              <br />
              amount={sent}
            </p>
          ) : (
            <p className="mt-2 font-mono text-sm leading-relaxed text-sage/70">
              POST /donate
              <br />
              amount={amount}
              <br />
              <span className="text-xs">(press Send it to dispatch)</span>
            </p>
          )}
        </div>

        <div className="mt-3 flex min-h-10 items-center rounded-md border border-border bg-card/50 px-4 py-2">
          <p className="font-mono text-xs tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Hover a tag or a field — the form is an envelope, the input is what you write, the button posts it."}
          </p>
        </div>
      </div>
    </div>
  );
}
