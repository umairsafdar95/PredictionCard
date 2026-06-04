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

  const cardStyle: React.CSSProperties = {
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

  if (theme === "dark") {
    return (
      <div ref={cardRef} style={{
        ...cardStyle,
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)",
      }}>
        {/* Stadium glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top label */}
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "28px",
          letterSpacing: "6px",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "60px",
          textAlign: "center",
        }}>
          WORLD CUP 2026 • {labels.title.toUpperCase()}
        </div>

        {/* Flags row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "80px",
          marginBottom: "40px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "120px", lineHeight: 1, marginBottom: "16px" }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "36px",
              color: "#ccc",
              letterSpacing: "2px",
              maxWidth: "260px",
              textAlign: "center",
            }}>{t1?.shortName ?? team1}</div>
          </div>

          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "48px",
            fontWeight: 900,
            color: "#e94560",
            background: "rgba(233,69,96,0.15)",
            border: "3px solid #e94560",
            borderRadius: "12px",
            padding: "12px 28px",
            letterSpacing: "4px",
          }}>{labels.vs}</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "120px", lineHeight: 1, marginBottom: "16px" }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "36px",
              color: "#ccc",
              letterSpacing: "2px",
              maxWidth: "260px",
              textAlign: "center",
            }}>{t2?.shortName ?? team2}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          marginBottom: "60px",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "160px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            textShadow: "0 0 40px rgba(233,69,96,0.5)",
          }}>{score1}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "80px",
            color: "#555",
            fontWeight: 300,
          }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "160px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            textShadow: "0 0 40px rgba(233,69,96,0.5)",
          }}>{score2}</div>
        </div>

        {/* Divider */}
        <div style={{
          width: "600px",
          height: "1px",
          background: "rgba(255,255,255,0.15)",
          marginBottom: "50px",
        }} />

        {/* Predicted by */}
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "24px",
          color: "#888",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>{labels.predictedBy}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "56px",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "2px",
        }}>{name}</div>

        {/* Watermark */}
        <div style={{
          position: "absolute",
          bottom: "40px",
          right: "50px",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "22px",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "1px",
        }}>⚽ goalcard.app</div>

        {/* Corner decoration */}
        <div style={{
          position: "absolute",
          top: "30px",
          left: "40px",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "22px",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "3px",
        }}>FIFA WC 2026</div>
      </div>
    );
  }

  if (theme === "colors") {
    const p1 = t1?.primary ?? "#002868";
    const p2 = t2?.primary ?? "#CE1126";
    return (
      <div ref={cardRef} style={{
        ...cardStyle,
        background: `linear-gradient(135deg, ${p1} 50%, ${p2} 50%)`,
        position: "relative",
      }}>
        {/* Diagonal overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, transparent 48%, rgba(255,255,255,0.12) 49%, rgba(255,255,255,0.12) 51%, transparent 52%)",
          pointerEvents: "none",
        }} />

        {/* Semi-transparent center panel */}
        <div style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          padding: "80px 100px",
          border: "2px solid rgba(255,255,255,0.2)",
          width: "820px",
        }}>
          {/* Label */}
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "24px",
            letterSpacing: "6px",
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            marginBottom: "50px",
          }}>WORLD CUP 2026 • {labels.title.toUpperCase()}</div>

          {/* Flags & teams */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "60px",
            marginBottom: "40px",
            width: "100%",
          }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "100px", lineHeight: 1 }}>{t1?.flag ?? "🏳"}</div>
              <div style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "30px",
                color: "#fff",
                marginTop: "12px",
                letterSpacing: "2px",
              }}>{team1}</div>
            </div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "40px",
              fontWeight: 900,
              color: "rgba(255,255,255,0.8)",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: "8px",
              padding: "8px 20px",
            }}>{labels.vs}</div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "100px", lineHeight: 1 }}>{t2?.flag ?? "🏳"}</div>
              <div style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "30px",
                color: "#fff",
                marginTop: "12px",
                letterSpacing: "2px",
              }}>{team2}</div>
            </div>
          </div>

          {/* Score */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            marginBottom: "50px",
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "150px",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>{score1}</div>
            <div style={{ fontSize: "70px", color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>:</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "150px",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>{score2}</div>
          </div>

          {/* Divider */}
          <div style={{ width: "400px", height: "1px", background: "rgba(255,255,255,0.25)", marginBottom: "40px" }} />

          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "22px",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>{labels.predictedBy}</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "52px",
            fontWeight: 700,
            color: "#fff",
          }}>{name}</div>
        </div>

        {/* Watermark */}
        <div style={{
          position: "absolute",
          bottom: "36px",
          right: "50px",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "20px",
          color: "rgba(255,255,255,0.25)",
        }}>⚽ goalcard.app</div>
      </div>
    );
  }

  // Clean Modern theme
  return (
    <div ref={cardRef} style={{
      ...cardStyle,
      background: "#ffffff",
      border: "2px solid #e5e7eb",
    }}>
      {/* Top accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "12px",
        background: "linear-gradient(90deg, #002868, #e94560)",
      }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px",
        width: "100%",
      }}>
        {/* Top label */}
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "22px",
          color: "#9ca3af",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "60px",
        }}>FIFA WORLD CUP 2026</div>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "30px",
          letterSpacing: "3px",
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: "60px",
        }}>{labels.title}</div>

        {/* Flags */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          marginBottom: "50px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "96px", lineHeight: 1, marginBottom: "16px" }}>{t1?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "32px",
              fontWeight: 500,
              color: "#0a0a1a",
              letterSpacing: "2px",
            }}>{team1}</div>
          </div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "36px",
            fontWeight: 700,
            color: "#9ca3af",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            padding: "10px 24px",
          }}>{labels.vs}</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "96px", lineHeight: 1, marginBottom: "16px" }}>{t2?.flag ?? "🏳"}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "32px",
              fontWeight: 500,
              color: "#0a0a1a",
              letterSpacing: "2px",
            }}>{team2}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "60px",
          background: "#f9fafb",
          borderRadius: "20px",
          padding: "30px 80px",
          border: "1px solid #e5e7eb",
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "150px",
            fontWeight: 900,
            color: "#0a0a1a",
            lineHeight: 1,
          }}>{score1}</div>
          <div style={{ fontSize: "60px", color: "#d1d5db", fontWeight: 300 }}>:</div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "150px",
            fontWeight: 900,
            color: "#0a0a1a",
            lineHeight: 1,
          }}>{score2}</div>
        </div>

        {/* Divider */}
        <div style={{ width: "500px", height: "1px", background: "#e5e7eb", marginBottom: "50px" }} />

        {/* Name */}
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "20px",
          color: "#9ca3af",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}>{labels.predictedBy}</div>
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "52px",
          fontWeight: 700,
          color: "#0a0a1a",
          letterSpacing: "2px",
        }}>{name}</div>
      </div>

      {/* Bottom watermark */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        right: "50px",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "20px",
        color: "#d1d5db",
      }}>⚽ goalcard.app</div>

      {/* Bottom accent bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "8px",
        background: "linear-gradient(90deg, #e94560, #002868)",
      }} />
    </div>
  );
}
