"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Member {
  handle: string;
  name: string | null;
  image: string | null;
}

interface MentionTextareaProps {
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
}

/**
 * A textarea that offers member handles while you type an @mention.
 * Picks insert the handle; everything else is a plain textarea.
 */
export function MentionTextarea({
  name,
  placeholder,
  rows = 4,
  required,
  maxLength = 5000,
}: MentionTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query === null || query.length < 1) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/members?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { members: Member[] };
        setMembers(data.members.slice(0, 6));
      } catch {
        /* the bar is loud; try again on the next keystroke */
      }
    }, 180);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const updateQuery = () => {
    const el = ref.current;
    if (!el) return;
    const upToCaret = el.value.slice(0, el.selectionStart ?? 0);
    const match = upToCaret.match(/@([a-z0-9_]{1,24})$/i);
    setQuery(match ? match[1].toLowerCase() : null);
    if (!match) setMembers([]);
  };

  const insertHandle = (handle: string) => {
    const el = ref.current;
    if (!el) return;
    const caret = el.selectionStart ?? 0;
    const before = el.value
      .slice(0, caret)
      .replace(/@([a-z0-9_]{1,24})$/i, `@${handle} `);
    el.value = before + el.value.slice(caret);
    el.focus();
    el.selectionStart = el.selectionEnd = before.length;
    setQuery(null);
    setMembers([]);
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        onInput={updateQuery}
        onClick={updateQuery}
        onBlur={() => setTimeout(() => setQuery(null), 150)}
        className="w-full rounded-md border border-border bg-background/40 px-3.5 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-brass"
      />
      {query !== null && members.length > 0 ? (
        <ul className="absolute bottom-full left-0 z-20 mb-1 w-72 overflow-hidden rounded-md border border-brass/40 bg-popover shadow-xl">
          {members.map((m) => (
            <li key={m.handle}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertHandle(m.handle);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-card"
              >
                {m.image ? (
                  <Image
                    src={m.image}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <span className="grid size-6 place-items-center rounded-full bg-card text-[10px]">
                    {(m.name ?? "P").slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 truncate text-sm">{m.name}</span>
                <span className="ml-auto font-mono text-[11px] text-gold-light">
                  @{m.handle}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
