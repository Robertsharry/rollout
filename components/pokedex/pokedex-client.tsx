"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";

import { TeamBar } from "@/components/pokedex/team-bar";
import {
  ALL_TYPES,
  DEX,
  MON_BY_ID,
  spriteUrl,
  TYPE_COLORS,
  type DexMon,
} from "@/lib/pokedex";
import { cn } from "@/lib/utils";

const TEAM_KEY = "rollout-team";
const TEAM_EVENT = "rollout-team-change";
const PAGE = 72;

/* ----------------------------- the squad lives in localStorage ---------- */

function readTeam(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(TEAM_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((n) => typeof n === "number" && MON_BY_ID.has(n)).slice(0, 6)
      : [];
  } catch {
    return [];
  }
}

let teamCache: { raw: string; value: number[] } = { raw: "", value: [] };

function teamSnapshot(): number[] {
  let raw = "";
  try {
    raw = localStorage.getItem(TEAM_KEY) ?? "";
  } catch {
    /* keep empty */
  }
  if (raw !== teamCache.raw) teamCache = { raw, value: readTeam() };
  return teamCache.value;
}

function subscribeTeam(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(TEAM_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(TEAM_EVENT, cb);
  };
}

function writeTeam(ids: number[]) {
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(ids.slice(0, 6)));
  } catch {
    /* private browsing — the squad rides in memory only */
  }
  window.dispatchEvent(new Event(TEAM_EVENT));
}

const NO_TEAM: number[] = [];

/* ------------------------------------------------------------------------ */

function TypeChip({
  type,
  active,
  onClick,
}: {
  type: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] capitalize transition-colors",
        active
          ? "border-brass bg-primary text-primary-foreground"
          : "border-border text-sage hover:border-brass/60",
      )}
    >
      <span
        aria-hidden
        className="size-2 rounded-full"
        style={{ background: TYPE_COLORS[type] }}
      />
      {type}
    </button>
  );
}

export function PokedexClient() {
  const [query, setQuery] = useState("");
  const [gen, setGen] = useState(0);
  const [type, setType] = useState("");
  const [shown, setShown] = useState(PAGE);

  const teamIds = useSyncExternalStore(subscribeTeam, teamSnapshot, () => NO_TEAM);
  const team = teamIds.map((id) => MON_BY_ID.get(id)!).filter(Boolean);

  // a shared squad link seeds the bench once
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("team");
    if (!param) return;
    const ids = param
      .split(",")
      .map(Number)
      .filter((n) => MON_BY_ID.has(n))
      .slice(0, 6);
    if (ids.length > 0) writeTeam(ids);
  }, []);

  // keep the address bar shareable as the squad changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (teamIds.length > 0) url.searchParams.set("team", teamIds.join(","));
    else url.searchParams.delete("team");
    window.history.replaceState(null, "", url.toString());
  }, [teamIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEX.filter((m) => {
      if (gen && m.g !== gen) return false;
      if (type && !m.t.includes(type)) return false;
      if (q && !m.n.toLowerCase().includes(q) && String(m.i) !== q) return false;
      return true;
    });
  }, [query, gen, type]);

  const visible = filtered.slice(0, shown);

  const toggleMon = (mon: DexMon) => {
    if (teamIds.includes(mon.i)) {
      writeTeam(teamIds.filter((id) => id !== mon.i));
    } else if (teamIds.length < 6) {
      writeTeam([...teamIds, mon.i]);
    }
  };

  return (
    <div className="pb-24">
      {/* the registry controls */}
      <div className="space-y-3">
        <label className="flex h-12 items-center gap-3 rounded-md border border-border bg-background/40 px-4 focus-within:border-brass">
          <Search className="size-4 shrink-0 text-sage" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE);
            }}
            placeholder="Search by name or dex number"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGen(g);
                setShown(PAGE);
              }}
              aria-pressed={gen === g}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
                gen === g
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage hover:border-brass/60",
              )}
            >
              {g === 0 ? "All gens" : `Gen ${g}`}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setType("");
              setShown(PAGE);
            }}
            aria-pressed={type === ""}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] transition-colors",
              type === ""
                ? "border-brass bg-primary text-primary-foreground"
                : "border-border text-sage hover:border-brass/60",
            )}
          >
            All types
          </button>
          {ALL_TYPES.map((t) => (
            <TypeChip
              key={t}
              type={t}
              active={type === t}
              onClick={() => {
                setType(type === t ? "" : t);
                setShown(PAGE);
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
        {filtered.length} of {DEX.length} specimens
        {team.length < 6
          ? " · tap one to add it to your squad"
          : " · squad is full — tap a slot to release"}
      </p>

      {/* the registry */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
        {visible.map((mon) => {
          const drafted = teamIds.includes(mon.i);
          return (
            <button
              key={mon.i}
              type="button"
              onClick={() => toggleMon(mon)}
              aria-pressed={drafted}
              className={cn(
                "group rounded-lg border bg-card/40 p-2 text-center transition-all hover:-translate-y-0.5",
                drafted
                  ? "border-gold-light bg-card/80"
                  : "border-border hover:border-brass/60",
              )}
            >
              <Image
                src={spriteUrl(mon.i)}
                alt=""
                width={68}
                height={68}
                loading="lazy"
                className="pixelated mx-auto"
              />
              <p className="font-mono text-[10px] text-muted-foreground">
                №{String(mon.i).padStart(4, "0")}
              </p>
              <p className="truncate text-xs font-medium">{mon.n}</p>
              <p className="mt-1 flex items-center justify-center gap-1">
                {mon.t.map((t) => (
                  <span
                    key={t}
                    title={t}
                    aria-label={t}
                    className="size-2 rounded-full"
                    style={{ background: TYPE_COLORS[t] }}
                  />
                ))}
              </p>
            </button>
          );
        })}
      </div>

      {visible.length < filtered.length ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE * 2)}
            className="h-11 rounded-md border border-brass/50 px-6 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
          >
            Open more drawers · {filtered.length - visible.length} remain
          </button>
        </div>
      ) : null}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-sage">
          No specimen by that name in the registry. Check the spelling — the
          house catalogs all {DEX.length}.
        </p>
      ) : null}

      <TeamBar
        team={team}
        onRemove={(id) => writeTeam(teamIds.filter((t) => t !== id))}
        onClear={() => writeTeam([])}
      />
    </div>
  );
}
