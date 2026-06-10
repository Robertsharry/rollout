import type { MDXComponents } from "mdx/types";

/** House styling for long form guide prose. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 border-b border-brass/25 pb-2.5 font-display text-2xl font-bold tracking-tight sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 font-display text-xl font-bold tracking-tight"
      {...props}
    />
  ),
  p: (props) => (
    <p className="my-4 text-base leading-relaxed text-foreground/90" {...props} />
  ),
  ul: (props) => (
    <ul
      className="my-4 list-disc space-y-2 pl-5 text-foreground/90 marker:text-brass"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-5 text-foreground/90 marker:text-brass"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gold-light" {...props} />
  ),
  a: (props) => (
    <a
      className="text-brass underline underline-offset-4 transition-colors hover:text-gold-light"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-brass pl-4 text-sage italic"
      {...props}
    />
  ),
  hr: () => (
    <div aria-hidden className="my-10 flex items-center gap-3">
      <span className="h-px flex-1 bg-brass/30" />
      <span className="size-1.5 rotate-45 bg-brass/70" />
      <span className="h-px flex-1 bg-brass/30" />
    </div>
  ),
  code: (props) => (
    <code
      className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border border-border text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-card/70" {...props} />,
  th: (props) => (
    <th
      className="border-b border-border px-3 py-2.5 text-left font-mono text-xs font-medium tracking-[0.14em] text-gold-light uppercase"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-border/50 px-3 py-2.5 text-foreground/90"
      {...props}
    />
  ),
};
