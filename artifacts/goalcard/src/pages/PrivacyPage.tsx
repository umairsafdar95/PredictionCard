export default function PrivacyPage() {
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
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", letterSpacing: "2px" }}>PRIVACY POLICY</div>
      </header>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "8px", fontFamily: "'Oswald', sans-serif" }}>Privacy Policy</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "36px" }}>Last updated: June 2026</p>

        <p style={s}>PredictionCard ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data when you use perdictioncard.com.</p>

        <h2 style={h2}>1. Information We Collect</h2>
        <p style={s}><strong style={{ color: "#e2e8f0" }}>Information you provide:</strong> When you generate a prediction card, you enter team names, a predicted score, and your name. This data is processed entirely in your browser and is never sent to or stored on our servers.</p>
        <p style={s}><strong style={{ color: "#e2e8f0" }}>Payment information:</strong> If you purchase the premium upgrade, payment is handled by our third-party payment processor (Paddle). We do not receive or store your credit card or bank details. We may receive a transaction confirmation and the email address you used to pay, which we use only to confirm your purchase.</p>
        <p style={s}><strong style={{ color: "#e2e8f0" }}>Usage data:</strong> We may collect anonymous, aggregated usage statistics (such as the number of cards generated, stored locally in your browser via localStorage). We do not link this data to any individual identity.</p>

        <h2 style={h2}>2. How We Use Your Information</h2>
        <p style={s}>We use the information we collect to: provide and improve the Service; process payments and confirm upgrades; respond to support requests; and understand how the Service is used in aggregate. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

        <h2 style={h2}>3. Cookies and Local Storage</h2>
        <p style={s}>PredictionCard uses browser localStorage to remember how many cards you have generated and whether you have purchased the premium upgrade. We do not use tracking cookies for advertising. Third-party services (such as Google Fonts) may set their own cookies according to their own privacy policies.</p>

        <h2 style={h2}>4. Third-Party Services</h2>
        <p style={s}>We use the following third-party services:</p>
        <ul style={{ ...s, paddingLeft: "20px" }}>
          <li><strong style={{ color: "#e2e8f0" }}>Paddle</strong> — payment processing. Their privacy policy applies to data collected during checkout.</li>
          <li><strong style={{ color: "#e2e8f0" }}>Google Fonts</strong> — font delivery. Google may log requests for fonts.</li>
          <li><strong style={{ color: "#e2e8f0" }}>flagcdn.com</strong> — serving country flag images.</li>
        </ul>

        <h2 style={h2}>5. Data Retention</h2>
        <p style={s}>Because the core service is fully client-side, we do not store your prediction data on our servers. Data in your browser's localStorage remains until you clear it. Any email address received from a payment confirmation is retained only as long as needed for support purposes.</p>

        <h2 style={h2}>6. Children's Privacy</h2>
        <p style={s}>PredictionCard is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>

        <h2 style={h2}>7. Your Rights</h2>
        <p style={s}>Depending on your location, you may have the right to access, correct, or delete personal data we hold about you. Since we store almost no personal data, the most effective way to clear your data is to clear your browser's localStorage and cookies. For any other requests, contact us at the address below.</p>

        <h2 style={h2}>8. Changes to This Policy</h2>
        <p style={s}>We may update this Privacy Policy from time to time. We will post any changes on this page with an updated date. Continued use of the Service after changes are posted constitutes acceptance of the updated policy.</p>

        <h2 style={h2}>9. Contact Us</h2>
        <p style={s}>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:support@perdictioncard.com" style={{ color: "#22c55e" }}>support@perdictioncard.com</a></p>

        <div style={{ marginTop: "48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <a href="/" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px" }}>← Back to PredictionCard</a>
          <span style={{ color: "#374151", margin: "0 12px" }}>·</span>
          <a href="/terms-and-conditions" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px" }}>Terms of Service →</a>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&family=Poppins:wght@400;600;700&display=swap');`}</style>
    </div>
  );
}
