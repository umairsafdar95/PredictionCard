interface ShareSuccessPageProps {
  onMakeAnother: () => void;
}

export default function ShareSuccessPage({ onMakeAnother }: ShareSuccessPageProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "48px 36px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        border: "1px solid #e5e7eb",
        maxWidth: "380px",
        width: "100%",
      }}>
        <div style={{ fontSize: "72px", marginBottom: "20px", animation: "bounce 0.6s ease-out" }}>🎉</div>

        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          color: "#16a34a",
          letterSpacing: "2px",
          marginBottom: "12px",
        }}>Card Shared!</div>

        <div style={{
          fontSize: "16px",
          color: "#6b7280",
          maxWidth: "300px",
          lineHeight: 1.6,
          marginBottom: "32px",
          margin: "0 auto 32px",
        }}>
          Challenge your friends to predict this match too! 🏆
        </div>

        <button
          onClick={onMakeAnother}
          style={{
            padding: "18px 40px",
            background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "18px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 6px 24px rgba(22,163,74,0.40)",
            transition: "transform 0.2s",
            width: "100%",
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          ⚽ Make Another Prediction
        </button>
      </div>

      <div style={{ marginTop: "32px", color: "#9ca3af", fontSize: "14px" }}>
        ⚽ PredictionCard.com — Free to use
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
