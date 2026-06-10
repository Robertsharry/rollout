import { ImageResponse } from "next/og";

import { GAMES, SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GREEN = "#163125";
const PARCHMENT = "#EFE6CF";
const BRASS = "#C9A14E";
const GOLD = "#E3C77E";
const SAGE = "#B9C9B4";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: GREEN,
          color: PARCHMENT,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `2px solid ${BRASS}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 38,
            right: 38,
            bottom: 38,
            border: `1px solid ${BRASS}80`,
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 30,
            fontStyle: "italic",
            color: BRASS,
          }}
        >
          The
        </div>
        <div
          style={{
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: 14,
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          ROLLOUT
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 26,
          }}
        >
          <div style={{ width: 130, height: 1, background: BRASS, display: "flex" }} />
          <div
            style={{
              width: 12,
              height: 12,
              background: GOLD,
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div style={{ width: 130, height: 1, background: BRASS, display: "flex" }} />
        </div>

        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            color: GOLD,
            marginTop: 26,
          }}
        >
          GAMING HOUSE & OUTFITTERS
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            color: SAGE,
            marginTop: 12,
          }}
        >
          EST. 2026 · ON THE RIVER · ALL HANDS WELCOME
        </div>

        <div
          style={{
            display: "flex",
            gap: 34,
            fontSize: 21,
            letterSpacing: 4,
            color: PARCHMENT,
            marginTop: 44,
          }}
        >
          {GAMES.map((game, i) => (
            <div key={game.slug} style={{ display: "flex", gap: 34, alignItems: "center" }}>
              {i > 0 ? (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: BRASS,
                    transform: "rotate(45deg)",
                    display: "flex",
                  }}
                />
              ) : null}
              <div style={{ display: "flex" }}>{game.short}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
