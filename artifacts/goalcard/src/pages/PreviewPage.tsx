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
          text: `I predict ${t1?.flag ?? ""} ${team1} ${score1}–${score2} ${team2} ${t2?.flag ?? ""}! Make your own prediction at goalcard.app`,
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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 20px",
        background: "#111128",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#ccc",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >← Back</button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "1px" }}>
          Your Card is Ready! 🎉
        </div>
        <div style={{ width: "80px" }} />
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 20px" }}>
        {/* Card preview */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          animation: "fadeIn 0.5s ease-out",
        }}>
          <div style={{
            width: "360px",
            height: "360px",
            overflow: "hidden",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            position: "relative",
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
            background: "#e94560",
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
            opacity: isLoading ? 0.7 : 1,
            boxShadow: "0 4px 20px rgba(233,69,96,0.35)",
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
            style={{
              flex: 1,
              padding: "16px",
              background: "#1a1a3e",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "15px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              cursor: isLoading ? "wait" : "pointer",
              transition: "transform 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >📲 Share</button>
          <button
            onClick={onNewCard}
            style={{
              flex: 1,
              padding: "16px",
              background: "#1a1a3e",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "15px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >🔄 New Card</button>
        </div>

        {/* Challenge link */}
        <div style={{
          background: "#111128",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
            Challenge a friend to predict this match!
          </div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>
            They'll see your challenge when they open the link
          </div>
          <button
            onClick={handleCopyChallenge}
            style={{
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(233,69,96,0.1)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(233,69,96,0.3)"}`,
              borderRadius: "8px",
              color: copied ? "#22c55e" : "#e94560",
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
          border: "2px dashed rgba(255,215,0,0.3)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "32px",
          background: "rgba(255,215,0,0.03)",
        }}>
          <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px", color: "#FFD700" }}>
            ✨ Remove watermark + unlock 2 more themes
          </div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>
            One-time payment: $1.99
          </div>
          <button
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              border: "none",
              borderRadius: "8px",
              color: "#000",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}
          >Upgrade Now</button>
        </div>

        {/* Today's other matches */}
        {todayOtherMatches.length > 0 && (
          <div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#ccc", marginBottom: "14px" }}>
              🗓️ Today's Other Matches
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayOtherMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    // This would prefill the form if user clicks back and wants to predict another
                    window.location.href = `${window.location.pathname}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}`;
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#111128",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    color: "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(233,69,96,0.4)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ fontSize: "14px" }}>
                    {getTeam(m.team1)?.flag} {m.team1} vs {getTeam(m.team2)?.flag} {m.team2}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{m.time}</div>
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
