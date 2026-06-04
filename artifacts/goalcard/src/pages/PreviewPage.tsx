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
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    });
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const dataUrl = await generateImage();
      const link = document.createElement("a");
      link.download = `goalcard-${team1.replace(/\s/g, "-")}-vs-${team2.replace(/\s/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
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
          text: `I predict ${t1?.flag ?? ""} ${team1} ${score1}–${score2} ${team2} ${t2?.flag ?? ""}! Make your own at predictioncard.com`,
          files: [file],
        });
        onShared();
      } else {
        const link = document.createElement("a");
        link.download = `goalcard-${team1.replace(/\s/g, "-")}-vs-${team2.replace(/\s/g, "-")}.png`;
        link.href = dataUrl;
        link.click();
        alert("Image downloaded! Share it on WhatsApp or Instagram. 🎉");
      }
      onIncrementCounter();
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyChallenge = async () => {
    const params = new URLSearchParams({
      match: `${t1?.shortName ?? team1}-${t2?.shortName ?? team2}`,
      challenge: name,
      team1,
      team2,
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const secondaryBtn: React.CSSProperties = {
    flex: 1,
    padding: "16px",
    background: "#fff",
    border: "1.5px solid #d1d5db",
    borderRadius: "12px",
    color: "#374151",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "1.5px solid #d1d5db",
            color: "#374151",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >← Back</button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "1px", color: "#16a34a" }}>
          ⚽ PredictionCard — Your Card is Ready! 🎉
        </div>
        <div style={{ width: "80px" }} />
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 16px" }}>
        {/* Card preview */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "28px",
          animation: "fadeIn 0.5s ease-out",
        }}>
          <div style={{
            width: "360px",
            height: "360px",
            overflow: "hidden",
            borderRadius: "18px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            position: "relative",
            border: "3px solid #e5e7eb",
          }}>
            <div style={{
              transform: "scale(0.3333)",
              transformOrigin: "top left",
              width: "1080px",
              height: "1080px",
            }}>
              <PredictionCard formState={formState} cardRef={cardRef} />
            </div>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "18px",
            background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "18px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: "1px",
            cursor: isLoading ? "wait" : "pointer",
            marginBottom: "12px",
            transition: "transform 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: isLoading ? 0.75 : 1,
            boxShadow: "0 6px 24px rgba(22,163,74,0.40)",
          }}
          onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isLoading ? (
            <>
              <span style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Generating...
            </>
          ) : "⬇️ Download PNG"}
        </button>

        {/* Share + New Card row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={handleShare}
            disabled={isLoading}
            style={{ ...secondaryBtn, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "wait" : "pointer" }}
            onMouseOver={(e) => { if (!isLoading) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "#16a34a"; } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#d1d5db"; }}
          >📲 Share</button>
          <button
            onClick={onNewCard}
            style={secondaryBtn}
            onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "#16a34a"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#d1d5db"; }}
          >🔄 New Card</button>
        </div>

        {/* Challenge link */}
        <div style={{
          background: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "22px 20px",
          marginBottom: "20px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>🏆</div>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", color: "#0f172a" }}>
            Challenge a friend to predict this match!
          </div>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>
            They'll see your challenge when they open the link
          </div>
          <button
            onClick={handleCopyChallenge}
            style={{
              background: copied ? "#f0fdf4" : "#fafafa",
              border: `1.5px solid ${copied ? "#16a34a" : "#d1d5db"}`,
              borderRadius: "8px",
              color: copied ? "#16a34a" : "#374151",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {copied ? "✅ Link Copied!" : "🔗 Copy Challenge Link"}
          </button>
        </div>

        {/* Premium upsell */}
        <div style={{
          border: "2px dashed #fbbf24",
          borderRadius: "14px",
          padding: "22px 20px",
          textAlign: "center",
          marginBottom: "32px",
          background: "#fffbeb",
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>✨</div>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", color: "#92400e" }}>
            Remove watermark + unlock 2 more themes
          </div>
          <div style={{ fontSize: "13px", color: "#b45309", marginBottom: "16px" }}>
            One-time payment: $1.99
          </div>
          <button
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 28px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 4px 16px rgba(217,119,6,0.35)",
            }}
          >Upgrade Now</button>
        </div>

        {/* Today's other matches */}
        {todayOtherMatches.length > 0 && (
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#374151", marginBottom: "14px" }}>
              🗓️ Today's Other Matches
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayOtherMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    window.location.href = `${window.location.pathname}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}`;
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    color: "#0f172a",
                    fontFamily: "'Poppins', sans-serif",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(22,163,74,0.15)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {getTeam(m.team1)?.flag} {m.team1} vs {getTeam(m.team2)?.flag} {m.team2}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", background: "#f3f4f6", borderRadius: "6px", padding: "3px 8px" }}>{m.time}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
