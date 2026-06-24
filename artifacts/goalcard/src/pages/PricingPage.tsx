export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Poppins', sans-serif", color: "#0f172a" }}>

      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)", borderBottom: "3px solid #16a34a", padding: "20px 24px", textAlign: "center" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: 900, color: "#fff" }}>
            ⚽ <span style={{ color: "#22c55e" }}>Pred</span>ictionCard
          </div>
        </a>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", letterSpacing: "2px" }}>PRICING</div>
      </header>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>

        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: "8px", fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}>
          Simple, One-Time Pricing
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "15px", marginBottom: "48px" }}>
          No subscriptions. No hidden fees. Pay once, unlock forever.
        </p>

        {/* Free tier */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", marginBottom: "20px", border: "2px solid #e2e8f0" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", letterSpacing: "2px", marginBottom: "12px" }}>FREE</div>
          <div style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", fontFamily: "'Oswald', sans-serif", marginBottom: "4px" }}>$0</div>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "24px" }}>Always free · No account needed</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Generate unlimited prediction cards", "5 card styles", "7 languages", "Download as PNG", "Share challenge links", "FIFA World Cup 2026 schedule"].map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151" }}>
                <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "16px" }}>✓</span> {f}
              </li>
            ))}
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#9ca3af" }}>
              <span style={{ color: "#d1d5db", fontWeight: 700 }}>✗</span> Card includes watermark
            </li>
          </ul>
          <a href="/" style={{ display: "block", marginTop: "28px", padding: "13px", background: "#f1f5f9", borderRadius: "10px", textAlign: "center", textDecoration: "none", color: "#374151", fontWeight: 700, fontSize: "14px" }}>
            Start Free →
          </a>
        </div>

        {/* Premium tier */}
        <div style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)", borderRadius: "20px", padding: "32px", border: "2px solid #f59e0b", boxShadow: "0 8px 32px rgba(245,158,11,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24", letterSpacing: "2px" }}>PREMIUM</div>
            <div style={{ background: "#16a34a", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>ONE-TIME</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", textDecoration: "line-through", fontFamily: "'Oswald', sans-serif" }}>$4.99</span>
            <span style={{ fontSize: "42px", fontWeight: 900, color: "#fff", fontFamily: "'Oswald', sans-serif" }}>$1.99</span>
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>Pay once · Unlocks permanently</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Everything in Free", "No watermark on your cards", "2 exclusive premium card themes", "Priority new features"].map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#fcd34d" }}>
                <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "16px" }}>⭐</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.open("https://safdar84.gumroad.com/l/brizke", "_blank")}
            style={{ display: "block", width: "100%", marginTop: "28px", padding: "14px", background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)", border: "none", borderRadius: "10px", textAlign: "center", color: "#1a0800", fontWeight: 800, fontSize: "15px", cursor: "pointer", fontFamily: "'Oswald', sans-serif", letterSpacing: "1px", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}
          >
            ⚡ UPGRADE NOW — $1.99
          </button>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "10px" }}>
            Instant unlock · No account needed
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "20px", fontFamily: "'Oswald', sans-serif" }}>Frequently Asked Questions</h2>
          {[
            { q: "How does the upgrade work?", a: "Click the upgrade button, complete the $1.99 payment, and your card is unlocked instantly — no account or login required." },
            { q: "Is this a subscription?", a: "No. It's a single one-time payment of $1.99. You pay once and the watermark is removed permanently on your device." },
            { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, PayPal, Apple Pay, and Google Pay through our secure payment processor." },
            { q: "Can I get a refund?", a: "Since this is a digital product that is instantly delivered, we do not offer refunds. Please contact us at support@perdictioncard.com if you have any issues." },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 0" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>{q}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>{a}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <a href="/" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px" }}>← Back to PredictionCard</a>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&family=Poppins:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}
