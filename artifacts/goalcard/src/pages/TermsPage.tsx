export default function TermsPage() {
  const s = { fontSize: "14px", color: "#94a3b8", lineHeight: "1.8", marginBottom: "16px" } as React.CSSProperties;
  const h2 = { fontSize: "18px", fontWeight: 700, color: "#e2e8f0", marginTop: "36px", marginBottom: "10px", fontFamily: "'Oswald', sans-serif" } as React.CSSProperties;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Poppins', sans-serif" }}>

      <header style={{ background: "linear-gradient(135deg, #0a1628, #0f2040, #0a1628)", borderBottom: "3px solid #16a34a", padding: "20px 24px", textAlign: "center" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: 900, color: "#fff" }}>
            ⚽ <span style={{ color: "#22c55e" }}>Pred</span>ictionCard
          </div>
        </a>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", letterSpacing: "2px" }}>TERMS OF SERVICE</div>
      </header>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "8px", fontFamily: "'Oswald', sans-serif" }}>Terms of Service</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "36px" }}>Last updated: June 2026</p>

        <p style={s}>Welcome to PredictionCard ("the Service"), operated by PredictionCard ("we", "us", "our"). By accessing or using perdictioncard.com, you agree to be bound by these Terms of Service.</p>

        <h2 style={h2}>1. Use of the Service</h2>
        <p style={s}>PredictionCard provides a free online tool that lets you generate FIFA World Cup 2026 match prediction image cards. You may use the Service for personal, non-commercial purposes. You must not use the Service to generate, share, or distribute any content that is offensive, illegal, defamatory, or infringes on third-party rights.</p>

        <h2 style={h2}>2. Premium Upgrade</h2>
        <p style={s}>The Service offers a one-time optional upgrade for $1.99 USD that removes the watermark from generated cards and unlocks additional card themes. This is a digital product delivered instantly. All payments are processed securely by our third-party payment provider. By completing a purchase you agree to their terms as well.</p>

        <h2 style={h2}>3. Refund Policy</h2>
        <p style={s}>Because the premium upgrade is a digital product that is delivered immediately upon payment, all sales are final and non-refundable. If you experience a technical issue with your upgrade, please contact us at support@perdictioncard.com and we will work to resolve it promptly.</p>

        <h2 style={h2}>4. Intellectual Property</h2>
        <p style={s}>The prediction cards you generate are yours to share. The PredictionCard branding, logo, design, and source code are owned by us and may not be reproduced or redistributed without permission. This service is not affiliated with, endorsed by, or sponsored by FIFA or any national football federation.</p>

        <h2 style={h2}>5. Disclaimer of Warranties</h2>
        <p style={s}>The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be error-free, uninterrupted, or always available. We are not responsible for any loss of data or inability to generate or download a card.</p>

        <h2 style={h2}>6. Limitation of Liability</h2>
        <p style={s}>To the fullest extent permitted by law, PredictionCard shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, even if we have been advised of the possibility of such damages.</p>

        <h2 style={h2}>7. Changes to Terms</h2>
        <p style={s}>We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the updated Terms.</p>

        <h2 style={h2}>8. Contact</h2>
        <p style={s}>For questions about these Terms, contact us at: <a href="mailto:support@perdictioncard.com" style={{ color: "#22c55e" }}>support@perdictioncard.com</a></p>

        <div style={{ marginTop: "48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <a href="/" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px" }}>← Back to PredictionCard</a>
          <span style={{ color: "#374151", margin: "0 12px" }}>·</span>
          <a href="/privacy" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px" }}>Privacy Policy →</a>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&family=Poppins:wght@400;600;700&display=swap');`}</style>
    </div>
  );
}
