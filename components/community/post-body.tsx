import { MENTION_RE } from "@/lib/community";

interface PostBodyProps {
  body: string;
  className?: string;
}

/** Renders a post with @handles picked out in brass. Plain text otherwise. */
export function PostBody({ body, className }: PostBodyProps) {
  const splitter = new RegExp(`(${MENTION_RE.source})`, "g");
  return (
    <div className={className}>
      {body.split("\n\n").map((paragraph, pi) => (
        <p
          key={pi}
          className="my-3 text-[15px] leading-relaxed whitespace-pre-line text-foreground/90 first:mt-0 last:mb-0"
        >
          {paragraph.split(splitter).map((part, i) =>
            /^@[a-z0-9_]{2,32}$/.test(part) ? (
              <span key={i} className="font-medium text-brass">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
