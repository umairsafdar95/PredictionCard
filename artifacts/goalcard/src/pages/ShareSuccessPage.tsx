interface ShareSuccessPageProps {
  onMakeAnother: () => void;
}

export default function ShareSuccessPage({ onMakeAnother }: ShareSuccessPageProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "80px", marginBottom: "24px", animation: "bounce 0.6s ease-out" }}>🎉</div>

      <div style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: "36px",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "2px",
        marginBottom: "12px",
      }}>Card Shared!</div>

      <div style={{
        fontSize: "17px",
        color: "#aaa",
        maxWidth: "340px",
        lineHeight: 1.6,
        marginBottom: "40px",
      }}>
        Challenge your friends to predict this match too! 🏆
      </div>

      <button
        onClick={onMakeAnother}
        style={{
          padding: "18px 40px",
          background: "#e94560",
          border: "none",
          borderRadius: "14px",
          color: "#fff",
          fontSize: "18px",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          letterSpacing: "2px",
          cursor: "pointer",
          textTransform: "uppercase",
          boxShadow: "0 4px 24px rgba(233,69,96,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        ⚽ Make Another Prediction
      </button>

      <div style={{ marginTop: "40px", color: "#555", fontSize: "14px" }}>
        ⚽ goalcard.app
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
