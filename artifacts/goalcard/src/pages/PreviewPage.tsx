import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import PredictionCard from "@/components/PredictionCard";
import { FormState } from "@/types";
import { getTeam } from "@/data/teams";
import { getTodaysMatches } from "@/data/matches";

interface PreviewPageProps {
  formState: FormState;
  onBack: () => void;
  onNewCard: () => void;
  onShared: () => void;
  onIncrementCounter: () => void;
}

export default function PreviewPage({ formState, onBack, onNewCard, onShared, onIncrementCounter }: PreviewPageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { team1, team2, score1, score2, name } = formState;

  const t1 = getTeam(team1);
  const t2 = getTeam(team2);
  const todayOtherMatches = getTodaysMatches()
    .filter((m) => m.team1 !== team1 && m.team2 !== team2)
    .slice(0, 3);

  const generateImage = async () => {
    if (!cardRef.current) throw new Error("Card not found");
    return toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      width: 1080,
      height: 1080,
      style: { transform: "scale(1)", transformOrigin: "top left" },
    });
  };

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const dataUrl = await generateImage();
      const filename = `perdictioncard-${team1.replace(/\s/g, "-")}-vs-${team2.replace(/\s/g, "-")}.png`;

      if (isIOS()) {
        // iOS Safari does not support the download attribute on data: URLs.
        // Open the image in a new tab — user long-presses to save to Camera Roll.
        const newWin = window.open("", "_blank");
        if (newWin) {
          newWin.document.write(`<!DOCTYPE html><html><head>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Save Your Card</title>
            <style>
              body{margin:0;background:#0a0a1a;display:flex;flex-direction:column;
                   align-items:center;justify-content:center;min-height:100vh;
                   font-family:sans-serif;padding:16px;box-sizing:border-box;}
              img{max-width:100%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.6);}
              p{color:#fff;margin-top:20px;font-size:15px;text-align:center;line-height:1.5;
                background:rgba(255,255,255,0.08);padding:12px 20px;border-radius:10px;}
            </style></head><body>
            <img src="${dataUrl}" alt="Prediction Card">
            <p>📸 Long-press the image and tap<br><strong>"Save to Photos"</strong></p>
            </body></html>`);
          newWin.document.close();
        }
      } else {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      onIncrementCounter();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const dataUrl = await generateImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "my-prediction.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My World Cup Prediction ⚽",
          text: `I predict ${t1?.flag ?? ""} ${team1} ${score1}–${score2} ${team2} ${t2?.flag ?? ""}! Make yours at perdictioncard.com`,
          files: [file],
        });
        onShared();
      } else {
        const link = document.createElement("a");
        link.download = `predictioncard-${team1.replace(/\s/g, "-")}-vs-${team2.replace(/\s/g, "-")}.png`;
        link.href = dataUrl;
        link.click();
        alert("Image downloaded! Share it on WhatsApp or Instagram. 🎉");
      }
      onIncrementCounter();
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error("Share failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyChallenge = async () => {
    const params = new URLSearchParams({ challenge: name, team1, team2 });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>

      {/* ── TOP NAV BAR ── */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "12px 20px",
        background: "linear-gradient(160deg, #061220 0%, #0a1f14 100%)",
        borderBottom: "3px solid #16a34a",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.85)",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px", fontWeight: 500,
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >← Back</button>
        <div style={{
          flex: 1, textAlign: "center",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "18px", fontWeight: 800,
          letterSpacing: "1px", color: "#fff",
        }}>
          ⚽ <span style={{ color: "#22c55e" }}>PredictionCard</span>
        </div>
        <button
          onClick={onNewCard}
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.35)",
            color: "#22c55e",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px", fontWeight: 600,
          }}
        >+ New</button>
      </div>

      {/* ── MATCH HEADLINE ── */}
      <div style={{
        background: "linear-gradient(160deg, #061220 0%, #0a1f14 100%)",
        padding: "20px 20px 28px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>
          Your Prediction
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px" }}>{t1?.flag ?? "🏳"}</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "16px", color: "#fff", fontWeight: 700 }}>{t1?.shortName ?? team1}</div>
          </div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "42px", fontWeight: 900, color: "#fff",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px", padding: "6px 20px", lineHeight: 1,
          }}>{score1} – {score2}</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px" }}>{t2?.flag ?? "🏳"}</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "16px", color: "#fff", fontWeight: 700 }}>{t2?.shortName ?? team2}</div>
          </div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
          Predicted by <span style={{ color: "#22c55e", fontWeight: 600 }}>{name}</span>
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "24px 16px 64px" }}>

        {/* ── CARD PREVIEW ── */}
        <div style={{
          display: "flex", justifyContent: "center",
          marginBottom: "24px",
          animation: "slideUp 0.4s ease-out",
        }}>
          <div style={{ position: "relative" }}>
            {/* Glow behind card */}
            <div style={{
              position: "absolute", inset: "-12px",
              background: "radial-gradient(ellipse at center, rgba(34,197,94,0.20) 0%, transparent 70%)",
              borderRadius: "30px",
              pointerEvents: "none",
            }} />
            <div style={{
              width: "360px", height: "360px",
              overflow: "hidden",
              borderRadius: "20px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.08)",
              position: "relative",
            }}>
              <div style={{
                transform: "scale(0.3333)",
                transformOrigin: "top left",
                width: "1080px", height: "1080px",
              }}>
                <PredictionCard formState={formState} cardRef={cardRef} />
              </div>
            </div>
          </div>
        </div>

        {/* ── DOWNLOAD (PRIMARY) ── */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          style={{
            width: "100%", padding: "20px",
            background: isLoading
              ? "linear-gradient(135deg, #166534, #15803d)"
              : "linear-gradient(135deg, #14532d 0%, #15803d 40%, #16a34a 100%)",
            border: "none", borderRadius: "16px",
            color: "#fff", fontSize: "18px",
            fontFamily: "'Oswald', sans-serif", fontWeight: 800,
            letterSpacing: "3px", cursor: isLoading ? "wait" : "pointer",
            marginBottom: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            opacity: isLoading ? 0.8 : 1,
            boxShadow: "0 8px 32px rgba(22,163,74,0.40)",
            transition: "transform 0.15s, box-shadow 0.15s",
            textTransform: "uppercase",
          }}
          onMouseOver={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,163,74,0.55)"; } }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.40)"; }}
        >
          {isLoading ? (
            <>
              <span style={{
                display: "inline-block", width: "20px", height: "20px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Generating PNG…
            </>
          ) : (
            <>⬇ Download 1080×1080 PNG</>
          )}
        </button>

        {/* ── SHARE + NEW ROW ── */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={handleShare}
            disabled={isLoading}
            style={{
              flex: 1, padding: "16px",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              color: "#374151", fontSize: "15px",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600,
              cursor: isLoading ? "wait" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => { if (!isLoading) { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#15803d"; } }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; }}
          >
            📲 Share
          </button>
          <button
            onClick={onNewCard}
            style={{
              flex: 1, padding: "16px",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              color: "#374151", fontSize: "15px",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#15803d"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; }}
          >
            🔄 New Card
          </button>
        </div>

        {/* ── CHALLENGE PANEL ── */}
        <div style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0f2040 100%)",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "18px",
          padding: "22px",
          marginBottom: "16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative glow */}
          <div style={{
            position: "absolute", top: "-20px", left: "50%",
            transform: "translateX(-50%)",
            width: "200px", height: "100px",
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏆</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px", fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}>
            Challenge a Friend!
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "18px" }}>
            Share your link — they'll see your prediction and make their own
          </div>
          <button
            onClick={handleCopyChallenge}
            style={{
              background: copied
                ? "linear-gradient(135deg, #14532d, #15803d)"
                : "rgba(212,175,55,0.15)",
              border: `1px solid ${copied ? "#22c55e" : "rgba(212,175,55,0.40)"}`,
              borderRadius: "10px",
              color: copied ? "#86efac" : "#d4af37",
              padding: "12px 28px",
              fontSize: "14px", fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              transition: "all 0.25s",
              letterSpacing: "0.5px",
            }}
          >
            {copied ? "✅ Challenge Link Copied!" : "🔗 Copy Challenge Link"}
          </button>
        </div>

        {/* ── UPSELL ── */}
        <div style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
          border: "2px solid #f59e0b",
          borderRadius: "18px",
          padding: "22px 20px",
          textAlign: "center",
          marginBottom: "28px",
          boxShadow: "0 4px 24px rgba(245,158,11,0.18)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow blob */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "100px", height: "100px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>⭐</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#fbbf24", marginBottom: "4px", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}>
            REMOVE WATERMARK
          </div>
          <div style={{ fontSize: "13px", color: "#fcd34d", marginBottom: "6px" }}>
            + unlock 2 exclusive premium themes
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>$4.99</span>
            <span style={{ fontSize: "22px", fontWeight: 900, color: "#fff", fontFamily: "'Oswald', sans-serif" }}>$1.99</span>
            <span style={{ fontSize: "10px", background: "#16a34a", color: "#fff", borderRadius: "6px", padding: "2px 7px", fontWeight: 700 }}>ONE-TIME</span>
          </div>
          <button
            onClick={() => window.open("https://perdictioncard.com/upgrade", "_blank")}
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
              border: "none", borderRadius: "10px",
              color: "#1a0800", padding: "12px 36px",
              fontSize: "14px", fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "1px",
              boxShadow: "0 4px 20px rgba(245,158,11,0.5)",
              width: "100%",
            }}
          >
            ⚡ UPGRADE NOW — $1.99
          </button>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "10px" }}>
            Instant unlock · No account needed · Pay once
          </div>
        </div>

        {/* ── OTHER MATCHES ── */}
        {todayOtherMatches.length > 0 && (
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
              🗓 Predict another match
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {todayOtherMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { window.location.href = `${window.location.pathname}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}`; }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#fff", border: "1.5px solid #e2e8f0",
                    borderRadius: "12px", padding: "13px 16px",
                    cursor: "pointer", color: "#0f172a",
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.background = "#f0fdf4"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {getTeam(m.team1)?.flag} {m.team1} <span style={{ color: "#9ca3af" }}>vs</span> {getTeam(m.team2)?.flag} {m.team2}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", background: "#f1f5f9", borderRadius: "6px", padding: "3px 8px" }}>{m.time}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "48px", textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 700, color: "#15803d", marginBottom: "4px" }}>⚽ PerdictionCard</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>perdictioncard.com · Free to use</div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
