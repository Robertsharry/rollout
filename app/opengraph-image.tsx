import { ImageResponse } from "next/og";

import { GAMES, SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(900px 500px at 80% -10%, rgba(34,211,238,0.18), transparent), radial-gradient(700px 500px at 0% 110%, rgba(244,63,151,0.18), transparent), #0a0e1a",
          color: "#f2f5fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#22d3ee",
              boxShadow: "0 0 24px #22d3ee",
            }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 8,
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Your squad’s command center.
          </div>
          <div style={{ fontSize: 30, color: "#9aa4b6", maxWidth: 820 }}>
            Tutorials, loadouts, leaderboards & forums — built by the squad.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 22,
            letterSpacing: 4,
            color: "#22d3ee",
            fontWeight: 700,
          }}
        >
          {GAMES.map((game) => (
            <div key={game.slug}>{game.short}</div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
