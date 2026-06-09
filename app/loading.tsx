export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-2 border-border border-t-neon" />
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Loading…
        </span>
      </div>
    </div>
  );
}
