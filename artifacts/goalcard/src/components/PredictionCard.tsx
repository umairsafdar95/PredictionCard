import React from "react";
import { FormState, languageLabels } from "@/types";
import { getTeam } from "@/data/teams";

interface PredictionCardProps {
  formState: FormState;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function PredictionCard({ formState, cardRef }: PredictionCardProps) {
  const { team1, team2, score1, score2, name, theme, language } = formState;
  const t1 = getTeam(team1);
  const t2 = getTeam(team2);
  const labels = languageLabels[language];
  const isRTL = language === "ar";

  const baseCard: React.CSSProperties = {
    width: "1080px",
    height: "1080px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Oswald', 'Arial Black', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    direction: isRTL ? "rtl" : "ltr",
  };

  /* ─────────────────────────────────────────────────────────────────
     THEME 1 — NIGHT MATCH
     Dark cinematic stadium. All content in flex flow (no backdropFilter).
  ───────────────────────────────────────────────────────────────── */
  if (theme === "dark") {
    return (
      <div ref={cardRef} style={{
        ...baseCard,
        background: "linear-gradient(160deg, #050d14 0%, #0a1a0d 50%, #050d14 100%)",
        justifyContent: "center",
        padding: "0 80px",
        gap: "0",
      }}>
        {/* Decorative: green spotlight from top — absolute, behind everything */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "1000px", height: "520px",
          background: "radial-gradient(ellipse 80% 65% at 50% -5%, rgba(34,197,94,0.20) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Decorative: faint pitch arc */}
        <div style={{
          position: "absolute", bottom: "-220px", left: "50%",
          transform: "translateX(-50%)",
          width: "1400px", height: "1400px",
          border: "2px solid rgba(34,197,94,0.07)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        {/* Corner label */}
        <div style={{
          position: "absolute", top: "44px", left: "48px",
          fontFamily: "'Oswald', sans-serif", fontSize: "18px",
          color: "rgba(34,197,94,0.35)", letterSpacing: "3px",
        }}>FIFA WC 2026</div>

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "52px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "50px", marginBottom: "12px" }}>⚽</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "22px", letterSpacing: "7px",
            color: "#22c55e", textTransform: "uppercase", fontWeight: 400,
            marginBottom: "8px",
          }}>WORLD CUP 2026</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px", letterSpacing: "4px",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
          }}>{labels.title}</div>
        </div>

        {/* ── TEAMS ROW ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "50px", marginBottom: "40px",
          position: "relative", zIndex: 1, width: "100%",
        }}>
          {/* Team 1 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "108px", lineHeight: 1 }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "3px",
            }}>{t1?.shortName ?? team1}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
            }}>{team1}</div>
          </div>

          {/* VS */}
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: 700,
            color: "#22c55e",
            background: "rgba(34,197,94,0.12)",
            border: "2px solid rgba(34,197,94,0.4)",
            borderRadius: "10px", padding: "12px 22px", letterSpacing: "4px",
            flexShrink: 0,
          }}>{labels.vs}</div>

          {/* Team 2 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "108px", lineHeight: 1 }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "3px",
            }}>{t2?.shortName ?? team2}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
            }}>{team2}</div>
          </div>
        </div>

        {/* ── SCORE ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "28px",
          marginBottom: "48px", position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "175px", fontWeight: 900,
            color: "#ffffff", lineHeight: 1,
            textShadow: "0 0 70px rgba(34,197,94,0.45)",
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "80px",
            color: "rgba(255,255,255,0.15)", fontWeight: 300, lineHeight: 1,
          }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "175px", fontWeight: 900,
            color: "#ffffff", lineHeight: 1,
            textShadow: "0 0 70px rgba(34,197,94,0.45)",
          }}>{score2}</div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{
          width: "560px", height: "2px",
          background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
          marginBottom: "44px", position: "relative", zIndex: 1,
        }} />

        {/* ── PREDICTED BY ── */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.3)", letterSpacing: "5px",
            textTransform: "uppercase", marginBottom: "12px",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "62px", fontWeight: 700,
            color: "#ffffff", letterSpacing: "2px",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "38px", right: "48px",
          fontFamily: "'Poppins', sans-serif", fontSize: "18px",
          color: "rgba(255,255,255,0.12)", letterSpacing: "1px",
        }}>⚽ predictioncard.com</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
     THEME 2 — NATIONAL COLORS
     Clean 50/50 vertical split. ALL content in flex column flow.
     NO backdropFilter (breaks html-to-image). Solid colors only.
  ───────────────────────────────────────────────────────────────── */
  if (theme === "colors") {
    const p1 = t1?.primary ?? "#003087";
    const p2 = t2?.primary ?? "#ce1126";
    const s1 = t1?.secondary ?? "#ffffff";
    const s2 = t2?.secondary ?? "#ffffff";

    return (
      <div ref={cardRef} style={{
        ...baseCard,
        background: `linear-gradient(90deg, ${p1} 50%, ${p2} 50%)`,
        justifyContent: "space-between",
        padding: "0",
      }}>
        {/* Decorative: center divider line */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "5px", height: "100%",
          background: "rgba(255,255,255,0.45)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ── TOP HEADER STRIP — solid, no blur ── */}
        <div style={{
          width: "100%", padding: "44px 40px 40px",
          background: "rgba(0,0,0,0.52)",
          textAlign: "center",
          position: "relative", zIndex: 1,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "22px", letterSpacing: "6px",
            color: "rgba(255,255,255,0.9)", textTransform: "uppercase",
          }}>WORLD CUP 2026 • {labels.title.toUpperCase()}</div>
        </div>

        {/* ── TEAMS SIDE BY SIDE — all in normal flow ── */}
        <div style={{
          display: "flex", alignItems: "center", width: "100%",
          flex: 1, position: "relative", zIndex: 1,
        }}>
          {/* Team 1 — left half */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "16px",
            padding: "0 30px",
          }}>
            <div style={{ fontSize: "130px", lineHeight: 1 }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "56px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "5px", textTransform: "uppercase",
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}>{t1?.shortName ?? team1}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "20px",
              color: "rgba(255,255,255,0.65)",
            }}>{team1}</div>
          </div>

          {/* Center VS badge */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
            gap: "20px", zIndex: 2,
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "26px", fontWeight: 700,
              color: "#ffffff",
              background: "rgba(0,0,0,0.65)",
              border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: "10px", padding: "10px 22px", letterSpacing: "3px",
            }}>{labels.vs}</div>
          </div>

          {/* Team 2 — right half */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "16px",
            padding: "0 30px",
          }}>
            <div style={{ fontSize: "130px", lineHeight: 1 }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "56px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "5px", textTransform: "uppercase",
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}>{t2?.shortName ?? team2}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "20px",
              color: "rgba(255,255,255,0.65)",
            }}>{team2}</div>
          </div>
        </div>

        {/* ── SCORE — solid background, NO blur ── */}
        <div style={{
          width: "100%", display: "flex", justifyContent: "center", alignItems: "center",
          padding: "28px 0",
          background: "rgba(0,0,0,0.62)",
          position: "relative", zIndex: 1, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "145px", fontWeight: 900,
              color: "#ffffff", lineHeight: 1,
              textShadow: "0 4px 16px rgba(0,0,0,0.7)",
            }}>{score1}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "70px",
              color: "rgba(255,255,255,0.30)", fontWeight: 300,
            }}>:</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "145px", fontWeight: 900,
              color: "#ffffff", lineHeight: 1,
              textShadow: "0 4px 16px rgba(0,0,0,0.7)",
            }}>{score2}</div>
          </div>
        </div>

        {/* ── PREDICTED BY — solid background, NO blur ── */}
        <div style={{
          width: "100%", padding: "44px 40px",
          background: "rgba(0,0,0,0.55)",
          borderTop: "2px solid rgba(255,255,255,0.15)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          position: "relative", zIndex: 1, flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.45)", letterSpacing: "5px",
            textTransform: "uppercase",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "56px", fontWeight: 700,
            color: "#ffffff", letterSpacing: "2px",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "14px", right: "48px",
          fontFamily: "'Poppins', sans-serif", fontSize: "16px",
          color: "rgba(255,255,255,0.18)", zIndex: 5,
        }}>⚽ predictioncard.com</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
     THEME 4 — RETRO CLASSIC
     Warm cream vintage poster. Bold red accents. All in flex flow.
     NO backdropFilter.
  ───────────────────────────────────────────────────────────────── */
  if (theme === "retro") {
    return (
      <div ref={cardRef} style={{
        ...baseCard,
        background: "#f5ede0",
        justifyContent: "center",
        padding: "0 88px",
        gap: "0",
      }}>
        {/* Decorative: bold red top-right triangle */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "0", height: "0",
          borderStyle: "solid",
          borderWidth: "0 320px 320px 0",
          borderColor: "transparent #c0392b transparent transparent",
          pointerEvents: "none",
        }} />
        {/* Decorative: bold red bottom-left triangle */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "0", height: "0",
          borderStyle: "solid",
          borderWidth: "220px 0 0 220px",
          borderColor: "transparent transparent transparent #c0392b",
          pointerEvents: "none",
        }} />
        {/* Decorative: black frame */}
        <div style={{
          position: "absolute", inset: "32px",
          border: "5px solid #1a0800",
          borderRadius: "0",
          pointerEvents: "none",
        }} />
        {/* Decorative: inner red frame line */}
        <div style={{
          position: "absolute", inset: "44px",
          border: "2px solid #c0392b",
          borderRadius: "0",
          pointerEvents: "none",
        }} />

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "44px", position: "relative", zIndex: 1 }}>
          <div style={{
            background: "#1a0800",
            display: "inline-block",
            padding: "14px 56px",
            marginBottom: "18px",
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "19px", letterSpacing: "8px",
              color: "#f5ede0", textTransform: "uppercase", fontWeight: 400,
            }}>FIFA WORLD CUP 2026</div>
          </div>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px", letterSpacing: "5px",
            color: "#7a4a2a", textTransform: "uppercase",
          }}>{labels.title}</div>
        </div>

        {/* ── TEAMS ROW ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "48px", marginBottom: "44px",
          position: "relative", zIndex: 1, width: "100%",
        }}>
          {/* Team 1 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "112px", lineHeight: 1 }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "46px", fontWeight: 700,
              color: "#1a0800", letterSpacing: "4px",
            }}>{t1?.shortName ?? team1}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "16px",
              color: "#7a4a2a",
            }}>{team1}</div>
          </div>

          {/* VS badge */}
          <div style={{
            background: "#c0392b",
            padding: "18px 26px",
            fontFamily: "'Oswald', sans-serif", fontSize: "30px", fontWeight: 900,
            color: "#f5ede0", letterSpacing: "3px",
            flexShrink: 0,
          }}>{labels.vs}</div>

          {/* Team 2 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "112px", lineHeight: 1 }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "46px", fontWeight: 700,
              color: "#1a0800", letterSpacing: "4px",
            }}>{t2?.shortName ?? team2}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "16px",
              color: "#7a4a2a",
            }}>{team2}</div>
          </div>
        </div>

        {/* ── RED RULE ── */}
        <div style={{
          width: "100%", height: "6px",
          background: "#c0392b",
          marginBottom: "36px", position: "relative", zIndex: 1,
        }} />

        {/* ── SCORE ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "28px",
          marginBottom: "36px", position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "172px", fontWeight: 900,
            color: "#1a0800", lineHeight: 1,
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "80px",
            color: "#c0392b", fontWeight: 900, lineHeight: 1,
          }}>–</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "172px", fontWeight: 900,
            color: "#1a0800", lineHeight: 1,
          }}>{score2}</div>
        </div>

        {/* ── RED RULE ── */}
        <div style={{
          width: "100%", height: "6px",
          background: "#c0392b",
          marginBottom: "36px", position: "relative", zIndex: 1,
        }} />

        {/* ── PREDICTED BY ── */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "15px",
            color: "#7a4a2a", letterSpacing: "6px",
            textTransform: "uppercase", marginBottom: "10px",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "60px", fontWeight: 700,
            color: "#1a0800", letterSpacing: "2px",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "52px", right: "62px",
          fontFamily: "'Poppins', sans-serif", fontSize: "16px",
          color: "rgba(26,8,0,0.18)", zIndex: 5,
        }}>⚽ predictioncard.com</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
     THEME 5 — NEON LIGHTS
     Jet black with electric cyan neon glow. All in flex flow.
     Glow via textShadow/boxShadow only — NO backdropFilter.
  ───────────────────────────────────────────────────────────────── */
  if (theme === "neon") {
    return (
      <div ref={cardRef} style={{
        ...baseCard,
        background: "radial-gradient(ellipse at 50% 30%, #07101a 0%, #010508 100%)",
        justifyContent: "center",
        padding: "0 80px",
        gap: "0",
      }}>
        {/* Decorative: neon border frame */}
        <div style={{
          position: "absolute", inset: "28px",
          border: "2px solid rgba(0,232,255,0.35)",
          borderRadius: "12px",
          boxShadow: "0 0 30px rgba(0,232,255,0.08)",
          pointerEvents: "none",
        }} />
        {/* Decorative: corner glow dots */}
        {[
          { top: "36px", left: "36px" }, { top: "36px", right: "36px" },
          { bottom: "36px", left: "36px" }, { bottom: "36px", right: "36px" },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: "10px", height: "10px",
            borderRadius: "50%",
            background: "#00e8ff",
            boxShadow: "0 0 12px 4px rgba(0,232,255,0.7)",
            pointerEvents: "none",
          }} />
        ))}
        {/* Decorative: horizontal scan line */}
        <div style={{
          position: "absolute", top: "50%", left: "28px", right: "28px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,232,255,0.08), transparent)",
          pointerEvents: "none",
        }} />

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "48px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "46px", marginBottom: "14px" }}>⚡</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "21px", letterSpacing: "8px",
            color: "#00e8ff", textTransform: "uppercase", fontWeight: 400,
            textShadow: "0 0 20px rgba(0,232,255,0.90), 0 0 60px rgba(0,232,255,0.40)",
            marginBottom: "10px",
          }}>WORLD CUP 2026</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "14px", letterSpacing: "5px",
            color: "rgba(255,255,255,0.22)", textTransform: "uppercase",
          }}>{labels.title}</div>
        </div>

        {/* ── TEAMS ROW ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "44px", marginBottom: "40px",
          position: "relative", zIndex: 1, width: "100%",
        }}>
          {/* Team 1 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div style={{
              fontSize: "100px", lineHeight: 1,
              filter: "drop-shadow(0 0 14px rgba(0,232,255,0.45))",
            }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "4px",
              textShadow: "0 0 20px rgba(0,232,255,0.55)",
            }}>{t1?.shortName ?? team1}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "17px",
              color: "rgba(255,255,255,0.30)",
            }}>{team1}</div>
          </div>

          {/* VS badge */}
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "24px", fontWeight: 700,
            color: "#00e8ff",
            border: "2px solid rgba(0,232,255,0.50)",
            borderRadius: "8px",
            padding: "12px 20px",
            letterSpacing: "4px",
            textShadow: "0 0 14px rgba(0,232,255,0.90)",
            boxShadow: "0 0 20px rgba(0,232,255,0.15)",
            flexShrink: 0,
          }}>{labels.vs}</div>

          {/* Team 2 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div style={{
              fontSize: "100px", lineHeight: 1,
              filter: "drop-shadow(0 0 14px rgba(0,232,255,0.45))",
            }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
              color: "#ffffff", letterSpacing: "4px",
              textShadow: "0 0 20px rgba(0,232,255,0.55)",
            }}>{t2?.shortName ?? team2}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "17px",
              color: "rgba(255,255,255,0.30)",
            }}>{team2}</div>
          </div>
        </div>

        {/* ── NEON SCORE ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "24px",
          marginBottom: "48px", position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "175px", fontWeight: 900,
            color: "#00e8ff", lineHeight: 1,
            textShadow: "0 0 30px rgba(0,232,255,1), 0 0 80px rgba(0,232,255,0.60), 0 0 160px rgba(0,232,255,0.25)",
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "80px",
            color: "rgba(0,232,255,0.20)", fontWeight: 300, lineHeight: 1,
          }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "175px", fontWeight: 900,
            color: "#00e8ff", lineHeight: 1,
            textShadow: "0 0 30px rgba(0,232,255,1), 0 0 80px rgba(0,232,255,0.60), 0 0 160px rgba(0,232,255,0.25)",
          }}>{score2}</div>
        </div>

        {/* ── NEON DIVIDER ── */}
        <div style={{
          width: "560px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,232,255,0.60), transparent)",
          boxShadow: "0 0 10px rgba(0,232,255,0.40)",
          marginBottom: "40px", position: "relative", zIndex: 1,
        }} />

        {/* ── PREDICTED BY ── */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "15px",
            color: "rgba(0,232,255,0.45)", letterSpacing: "6px",
            textTransform: "uppercase", marginBottom: "12px",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "62px", fontWeight: 700,
            color: "#ffffff", letterSpacing: "2px",
            textShadow: "0 0 24px rgba(0,232,255,0.35)",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "42px", right: "52px",
          fontFamily: "'Poppins', sans-serif", fontSize: "17px",
          color: "rgba(0,232,255,0.15)", zIndex: 5,
        }}>⚽ predictioncard.com</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
     THEME 3 — FIFA GOLD
     Deep FIFA navy with gold trophy accents. All content in flex flow.
     NO backdropFilter.
  ───────────────────────────────────────────────────────────────── */
  return (
    <div ref={cardRef} style={{
      ...baseCard,
      background: "linear-gradient(160deg, #071330 0%, #0d1e4a 50%, #071330 100%)",
      justifyContent: "center",
      padding: "0 80px",
      gap: "0",
    }}>
      {/* Decorative: gold shimmer diagonal */}
      <div style={{
        position: "absolute", top: "-200px", right: "-80px",
        width: "480px", height: "1600px",
        background: "linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.07) 50%, transparent 100%)",
        transform: "rotate(-25deg)",
        pointerEvents: "none",
      }} />
      {/* Decorative: subtle radial glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translateX(-50%)",
        width: "800px", height: "400px",
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── TOP GOLD BAR ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "10px",
        background: "linear-gradient(90deg, #b8860b, #ffd700, #f5e17a, #ffd700, #b8860b)",
      }} />

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: "48px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>🏆</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "20px", letterSpacing: "8px",
          color: "#d4af37", textTransform: "uppercase", fontWeight: 400,
          marginBottom: "8px",
        }}>FIFA WORLD CUP 2026</div>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "15px", letterSpacing: "4px",
          color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
        }}>{labels.title}</div>
      </div>

      {/* ── TEAM PANELS — two clearly separated cards with VS between ── */}
      <div style={{
        display: "flex", alignItems: "center", width: "940px",
        marginBottom: "36px", gap: "0",
        position: "relative", zIndex: 1,
      }}>
        {/* Team 1 panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "38px 20px",
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "16px",
          gap: "14px",
        }}>
          <div style={{ fontSize: "92px", lineHeight: 1 }}>{t1?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
            color: "#f5e17a", letterSpacing: "4px",
          }}>{t1?.shortName ?? team1}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "17px",
            color: "rgba(255,255,255,0.38)",
          }}>{team1}</div>
        </div>

        {/* VS label — sits between panels, not a panel itself */}
        <div style={{
          flexShrink: 0, width: "96px", textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(212,175,55,0.60)", letterSpacing: "3px",
          }}>{labels.vs}</div>
        </div>

        {/* Team 2 panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "38px 20px",
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "16px",
          gap: "14px",
        }}>
          <div style={{ fontSize: "92px", lineHeight: 1 }}>{t2?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "44px", fontWeight: 700,
            color: "#f5e17a", letterSpacing: "4px",
          }}>{t2?.shortName ?? team2}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "17px",
            color: "rgba(255,255,255,0.38)",
          }}>{team2}</div>
        </div>
      </div>

      {/* ── SCORE ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "24px",
        marginBottom: "40px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "168px", fontWeight: 900,
          color: "#f5e17a", lineHeight: 1,
          textShadow: "0 0 60px rgba(212,175,55,0.55), 0 4px 12px rgba(0,0,0,0.7)",
        }}>{score1}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "80px",
          color: "rgba(212,175,55,0.25)", fontWeight: 300,
        }}>:</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "168px", fontWeight: 900,
          color: "#f5e17a", lineHeight: 1,
          textShadow: "0 0 60px rgba(212,175,55,0.55), 0 4px 12px rgba(0,0,0,0.7)",
        }}>{score2}</div>
      </div>

      {/* ── GOLD DIVIDER ── */}
      <div style={{
        width: "560px", height: "1px",
        background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
        marginBottom: "38px", position: "relative", zIndex: 1,
      }} />

      {/* ── PREDICTED BY ── */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: "18px",
          color: "rgba(212,175,55,0.55)", letterSpacing: "5px",
          textTransform: "uppercase", marginBottom: "12px",
        }}>{labels.predictedBy}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "60px", fontWeight: 700,
          color: "#ffffff", letterSpacing: "2px",
        }}>{name}</div>
      </div>

      {/* ── BOTTOM GOLD BAR ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "10px",
        background: "linear-gradient(90deg, #b8860b, #ffd700, #f5e17a, #ffd700, #b8860b)",
      }} />

      {/* Watermark */}
      <div style={{
        position: "absolute", bottom: "22px", right: "48px",
        fontFamily: "'Poppins', sans-serif", fontSize: "18px",
        color: "rgba(212,175,55,0.22)", letterSpacing: "1px", zIndex: 1,
      }}>⚽ predictioncard.com</div>
    </div>
  );
}
