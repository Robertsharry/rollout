"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <div className="font-mono text-xs tracking-[0.18em] text-destructive uppercase">
          Trouble below decks
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold">
          Something jammed in the machinery
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Give it another turn. If it keeps up, flag down the crew in the
          Discord.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
