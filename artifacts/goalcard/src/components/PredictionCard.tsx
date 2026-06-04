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
    justifyContent: "center",
    direction: isRTL ? "rtl" : "ltr",
  };

  /* ─────────────────────────────────────────────
     THEME 1 — NIGHT MATCH (dark, cinematic)
  ───────────────────────────────────────────── */
  if (theme === "dark") {
    const accentGreen = "#22c55e";
    return (
      <div ref={cardRef} style={{
        ...baseCard,
        background: "linear-gradient(170deg, #0d1117 0%, #131c14 55%, #0d1117 100%)",
      }}>
        {/* Floodlight glow from top */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "900px", height: "500px",
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Pitch lines — decorative arcs */}
        <div style={{
          position: "absolute", bottom: "-200px", left: "50%",
          transform: "translateX(-50%)",
          width: "1400px", height: "1400px",
          border: "2px solid rgba(34,197,94,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-320px", left: "50%",
          transform: "translateX(-50%)",
          width: "1700px", height: "1700px",
          border: "1px solid rgba(34,197,94,0.05)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        {/* Top badge area */}
        <div style={{
          position: "absolute", top: "52px", left: "0", right: "0",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        }}>
          <div style={{ fontSize: "48px" }}>⚽</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "22px", letterSpacing: "6px",
            color: accentGreen, textTransform: "uppercase", fontWeight: 400,
          }}>WORLD CUP 2026</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px", letterSpacing: "4px",
            color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
          }}>{labels.title}</div>
        </div>

        {/* Teams row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "70px", marginBottom: "36px", position: "relative", zIndex: 1,
        }}>
          {/* Team 1 */}
          <div style={{ textAlign: "center", width: "280px" }}>
            <div style={{ fontSize: "110px", lineHeight: 1, marginBottom: "14px" }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "38px", fontWeight: 700,
              color: "#fff", letterSpacing: "3px", textTransform: "uppercase",
            }}>{t1?.shortName ?? team1}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "16px",
              color: "rgba(255,255,255,0.45)", marginTop: "4px",
            }}>{team1}</div>
          </div>

          {/* VS badge */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0",
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "30px", fontWeight: 700,
              color: accentGreen, background: "rgba(34,197,94,0.12)",
              border: "2px solid rgba(34,197,94,0.4)",
              borderRadius: "10px", padding: "10px 22px", letterSpacing: "4px",
            }}>{labels.vs}</div>
          </div>

          {/* Team 2 */}
          <div style={{ textAlign: "center", width: "280px" }}>
            <div style={{ fontSize: "110px", lineHeight: 1, marginBottom: "14px" }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "38px", fontWeight: 700,
              color: "#fff", letterSpacing: "3px", textTransform: "uppercase",
            }}>{t2?.shortName ?? team2}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "16px",
              color: "rgba(255,255,255,0.45)", marginTop: "4px",
            }}>{team2}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{
          display: "flex", alignItems: "center", gap: "28px",
          marginBottom: "48px", position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "168px", fontWeight: 900,
            color: "#fff", lineHeight: 1,
            textShadow: `0 0 60px rgba(34,197,94,0.4), 0 4px 8px rgba(0,0,0,0.6)`,
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "80px",
            color: "rgba(255,255,255,0.2)", fontWeight: 300, lineHeight: 1,
          }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "168px", fontWeight: 900,
            color: "#fff", lineHeight: 1,
            textShadow: `0 0 60px rgba(34,197,94,0.4), 0 4px 8px rgba(0,0,0,0.6)`,
          }}>{score2}</div>
        </div>

        {/* Divider */}
        <div style={{
          width: "580px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)",
          marginBottom: "44px", position: "relative", zIndex: 1,
        }} />

        {/* Predicted by */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.35)", letterSpacing: "5px",
            textTransform: "uppercase", marginBottom: "12px",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "60px", fontWeight: 700,
            color: "#fff", letterSpacing: "2px",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "38px", right: "48px",
          fontFamily: "'Poppins', sans-serif", fontSize: "18px",
          color: "rgba(255,255,255,0.15)", letterSpacing: "1px",
        }}>⚽ goalcard.app</div>

        {/* Top-left corner text */}
        <div style={{
          position: "absolute", top: "48px", left: "48px",
          fontFamily: "'Oswald', sans-serif", fontSize: "18px",
          color: "rgba(34,197,94,0.3)", letterSpacing: "3px",
        }}>FIFA WC 2026</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     THEME 2 — NATIONAL COLORS (clean split)
  ───────────────────────────────────────────── */
  if (theme === "colors") {
    const p1 = t1?.primary ?? "#1a56db";
    const p2 = t2?.primary ?? "#dc2626";
    const s1 = t1?.secondary ?? "rgba(255,255,255,0.85)";
    const s2 = t2?.secondary ?? "rgba(255,255,255,0.85)";

    return (
      <div ref={cardRef} style={{ ...baseCard, background: "#fff" }}>
        {/* Left color block — Team 1 */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "50%", height: "100%", background: p1,
        }} />
        {/* Right color block — Team 2 */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "50%", height: "100%", background: p2,
        }} />

        {/* Center divider line */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "5px", height: "100%",
          background: "rgba(255,255,255,0.5)",
          zIndex: 1,
        }} />

        {/* Top header bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "100px",
          background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px",
            letterSpacing: "6px", color: "rgba(255,255,255,0.9)",
            textTransform: "uppercase",
          }}>WORLD CUP 2026 • {labels.title.toUpperCase()}</div>
        </div>

        {/* Team 1 — left side, flag + short name + full name */}
        <div style={{
          position: "absolute", top: "100px", left: 0,
          width: "50%", height: "calc(100% - 100px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          paddingBottom: "280px",
          zIndex: 2,
        }}>
          <div style={{ fontSize: "130px", lineHeight: 1, marginBottom: "18px" }}>{t1?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "52px", fontWeight: 700,
            color: s1, letterSpacing: "4px", textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>{t1?.shortName ?? team1}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "20px",
            color: "rgba(255,255,255,0.65)", marginTop: "6px",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}>{team1}</div>
        </div>

        {/* Team 2 — right side */}
        <div style={{
          position: "absolute", top: "100px", right: 0,
          width: "50%", height: "calc(100% - 100px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          paddingBottom: "280px",
          zIndex: 2,
        }}>
          <div style={{ fontSize: "130px", lineHeight: 1, marginBottom: "18px" }}>{t2?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "52px", fontWeight: 700,
            color: s2, letterSpacing: "4px", textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>{t2?.shortName ?? team2}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "20px",
            color: "rgba(255,255,255,0.65)", marginTop: "6px",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}>{team2}</div>
        </div>

        {/* Score panel — floating center card */}
        <div style={{
          position: "absolute",
          bottom: "220px", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
          border: "2px solid rgba(255,255,255,0.25)",
          padding: "28px 80px",
          display: "flex", alignItems: "center", gap: "20px",
          minWidth: "380px", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "150px", fontWeight: 900,
            color: s1, lineHeight: 1,
            textShadow: `0 0 30px ${p1}`,
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "70px",
            color: "rgba(255,255,255,0.3)", fontWeight: 300,
          }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "150px", fontWeight: 900,
            color: s2, lineHeight: 1,
            textShadow: `0 0 30px ${p2}`,
          }}>{score2}</div>
        </div>

        {/* Predicted by — bottom strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "200px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "8px",
          zIndex: 3,
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.5)", letterSpacing: "5px",
            textTransform: "uppercase",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "56px", fontWeight: 700,
            color: "#fff", letterSpacing: "2px",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "12px", right: "48px",
          fontFamily: "'Poppins', sans-serif", fontSize: "18px",
          color: "rgba(255,255,255,0.2)", zIndex: 4,
        }}>⚽ goalcard.app</div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     THEME 3 — FIFA GOLD (deep navy + gold)
  ───────────────────────────────────────────── */
  return (
    <div ref={cardRef} style={{
      ...baseCard,
      background: "linear-gradient(160deg, #071330 0%, #0b1e45 50%, #071330 100%)",
    }}>
      {/* Gold shimmer diagonal stripe */}
      <div style={{
        position: "absolute", top: "-200px", right: "-100px",
        width: "500px", height: "1500px",
        background: "linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%)",
        transform: "rotate(-25deg)",
        pointerEvents: "none",
      }} />

      {/* Top gold accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "8px",
        background: "linear-gradient(90deg, #d4af37, #f5e17a, #d4af37)",
      }} />

      {/* Header */}
      <div style={{
        position: "absolute", top: "52px", left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      }}>
        <div style={{ fontSize: "44px" }}>🏆</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "20px",
          letterSpacing: "7px", color: "#d4af37",
          textTransform: "uppercase", fontWeight: 400,
        }}>FIFA WORLD CUP 2026</div>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: "15px",
          letterSpacing: "4px", color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}>{labels.title}</div>
      </div>

      {/* Team panels — side by side */}
      <div style={{
        display: "flex", alignItems: "stretch", justifyContent: "center",
        gap: "0", marginBottom: "32px", width: "860px",
        position: "relative", zIndex: 1,
      }}>
        {/* Team 1 panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 30px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "16px 0 0 16px",
          borderRight: "none",
        }}>
          <div style={{ fontSize: "100px", lineHeight: 1, marginBottom: "16px" }}>{t1?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "42px", fontWeight: 700,
            color: "#d4af37", letterSpacing: "4px",
          }}>{t1?.shortName ?? team1}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.5)", marginTop: "6px",
          }}>{team1}</div>
        </div>

        {/* VS divider */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "0 20px",
          background: "rgba(212,175,55,0.1)",
          border: "1px solid rgba(212,175,55,0.25)",
          minWidth: "90px",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: 700,
            color: "#d4af37", letterSpacing: "3px",
          }}>{labels.vs}</div>
        </div>

        {/* Team 2 panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 30px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "0 16px 16px 0",
          borderLeft: "none",
        }}>
          <div style={{ fontSize: "100px", lineHeight: 1, marginBottom: "16px" }}>{t2?.flag ?? "🏳"}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "42px", fontWeight: 700,
            color: "#d4af37", letterSpacing: "4px",
          }}>{t2?.shortName ?? team2}</div>
          <div style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "18px",
            color: "rgba(255,255,255,0.5)", marginTop: "6px",
          }}>{team2}</div>
        </div>
      </div>

      {/* Score */}
      <div style={{
        display: "flex", alignItems: "center", gap: "24px",
        marginBottom: "44px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "170px", fontWeight: 900,
          color: "#f5e17a", lineHeight: 1,
          textShadow: "0 0 50px rgba(212,175,55,0.5), 0 4px 12px rgba(0,0,0,0.6)",
        }}>{score1}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "80px",
          color: "rgba(212,175,55,0.3)", fontWeight: 300,
        }}>:</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "170px", fontWeight: 900,
          color: "#f5e17a", lineHeight: 1,
          textShadow: "0 0 50px rgba(212,175,55,0.5), 0 4px 12px rgba(0,0,0,0.6)",
        }}>{score2}</div>
      </div>

      {/* Gold divider */}
      <div style={{
        width: "560px", height: "1px",
        background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
        marginBottom: "40px", position: "relative", zIndex: 1,
      }} />

      {/* Predicted by */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: "18px",
          color: "rgba(212,175,55,0.6)", letterSpacing: "5px",
          textTransform: "uppercase", marginBottom: "12px",
        }}>{labels.predictedBy}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "60px", fontWeight: 700,
          color: "#fff", letterSpacing: "2px",
        }}>{name}</div>
      </div>

      {/* Bottom gold bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "8px",
        background: "linear-gradient(90deg, #d4af37, #f5e17a, #d4af37)",
      }} />

      {/* Watermark */}
      <div style={{
        position: "absolute", bottom: "24px", right: "48px",
        fontFamily: "'Poppins', sans-serif", fontSize: "18px",
        color: "rgba(212,175,55,0.25)", letterSpacing: "1px",
      }}>⚽ goalcard.app</div>
    </div>
  );
}
