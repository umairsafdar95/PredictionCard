import { useState } from "react";
import { FormState, Theme, Language } from "@/types";
import teams, { getTeam } from "@/data/teams";
import { getTodaysMatches, type Match } from "@/data/matches";

interface FormPageProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onGenerate: () => void;
  challengerName: string | null;
  cardCount: number;
}

const THEMES: { id: Theme; label: string; icon: string; desc: string }[] = [
  { id: "dark", label: "Dark Stadium", icon: "🌑", desc: "Bold dark gradient" },
  { id: "colors", label: "National Colors", icon: "🎨", desc: "Team flag colors" },
  { id: "modern", label: "Clean Modern", icon: "⬜", desc: "Minimal white style" },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ar", label: "العربية (Arabic)" },
  { id: "fr", label: "Français" },
  { id: "pt", label: "Português" },
  { id: "es", label: "Español" },
  { id: "de", label: "Deutsch" },
  { id: "tr", label: "Türkçe" },
];

function ScorePicker({ value, onChange, hasError, label }: { value: number; onChange: (v: number) => void; hasError: boolean; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "110px", textAlign: "center" }}>{label}</div>
      <button
        type="button"
        onClick={() => onChange(Math.min(9, value + 1))}
        style={{
          width: "44px", height: "44px",
          background: "#1a1a3e",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
        }}
      >+</button>
      <input
        type="number"
        min={0}
        max={9}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          if (!isNaN(v) && v >= 0 && v <= 9) onChange(v);
        }}
        style={{
          width: "80px", height: "80px",
          background: "#111128",
          border: hasError ? "2px solid #e94560" : "2px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          color: "#fff",
          fontSize: "42px",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          textAlign: "center",
          outline: "none",
        }}
      />
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: "44px", height: "44px",
          background: "#1a1a3e",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
        }}
      >−</button>
    </div>
  );
}

export default function FormPage({ formState, setFormState, onGenerate, challengerName, cardCount }: FormPageProps) {
  const { team1, team2, score1, score2, name, theme, language } = formState;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const todayMatches = getTodaysMatches().slice(0, 3);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      // Immediate inline same-team check
      if (field === "team1" || field === "team2") {
        const t1 = field === "team1" ? (value as string) : prev.team1;
        const t2 = field === "team2" ? (value as string) : prev.team2;
        if (t1 && t2 && t1 === t2) {
          setErrors((e) => ({ ...e, team2: "Teams must be different" }));
        } else {
          setErrors((e) => {
            const copy = { ...e };
            delete copy.team2;
            return copy;
          });
        }
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!team1) errs.team1 = "Please select Team 1";
    if (!team2) errs.team2 = "Please select Team 2";
    if (team1 && team2 && team1 === team2) errs.team2 = "Teams must be different";
    if (!name.trim()) errs.name = "Please enter your name";
    if (name.length > 20) errs.name = "Name must be 20 characters or less";
    if (score1 < 0 || score1 > 9) errs.score1 = "Score must be 0–9";
    if (score2 < 0 || score2 > 9) errs.score2 = "Score must be 0–9";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onGenerate();
  };

  const prefillMatch = (m: Match) => {
    setFormState((prev) => ({ ...prev, team1: m.team1, team2: m.team2 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "#111128",
    border: hasError ? "2px solid #e94560" : "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "14px 12px",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    outline: "none",
  });

  const sectionLabel: React.CSSProperties = {
    fontSize: "12px",
    color: "#e94560",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "6px",
    fontWeight: 600,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "19px",
    fontWeight: 600,
    marginBottom: "18px",
    color: "#fff",
  };

  const errorMsg: React.CSSProperties = {
    color: "#e94560",
    fontSize: "12px",
    marginTop: "5px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #111128 0%, #0a0a1a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "40px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: "2px", marginBottom: "6px" }}>
          ⚽ <span style={{ color: "#e94560" }}>Goal</span>Card
        </div>
        <div style={{ fontSize: "16px", color: "#ccc", marginBottom: "4px" }}>Predict the score. Share your card.</div>
        <div style={{ fontSize: "13px", color: "#555" }}>FIFA World Cup 2026 • Free Prediction Cards</div>
        <div style={{
          display: "inline-block",
          marginTop: "14px",
          background: "rgba(233,69,96,0.08)",
          border: "1px solid rgba(233,69,96,0.25)",
          borderRadius: "20px",
          padding: "6px 18px",
          fontSize: "13px",
          color: "#e94560",
        }}>
          🃏 {(cardCount + 47293).toLocaleString()} cards generated today
        </div>
      </header>

      {/* Challenge banner */}
      {challengerName && (
        <div style={{
          background: "linear-gradient(135deg, #e94560 0%, #c43050 100%)",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: 600,
        }}>
          🏆 <strong>{challengerName}</strong> challenged you to predict this match!
        </div>
      )}

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "36px 20px 60px" }}>

        {/* STEP 1: Match */}
        <div style={{ marginBottom: "36px" }}>
          <div style={sectionLabel}>STEP 1</div>
          <div style={sectionTitle}>Which match are you predicting?</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <select id="team1" value={team1} onChange={(e) => set("team1", e.target.value)} style={selectStyle(!!errors.team1)}>
                <option value="">Select Team 1</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team1 && <div style={errorMsg}>{errors.team1}</div>}
            </div>

            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#e94560",
              background: "rgba(233,69,96,0.1)",
              border: "1px solid rgba(233,69,96,0.3)",
              borderRadius: "8px",
              padding: "14px 12px",
              flexShrink: 0,
              marginTop: "0px",
            }}>VS</div>

            <div style={{ flex: 1 }}>
              <select id="team2" value={team2} onChange={(e) => set("team2", e.target.value)} style={selectStyle(!!errors.team2)}>
                <option value="">Select Team 2</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team2 && <div style={errorMsg}>{errors.team2}</div>}
            </div>
          </div>
        </div>

        {/* STEP 2: Score */}
        <div style={{ marginBottom: "36px" }}>
          <div style={sectionLabel}>STEP 2</div>
          <div style={sectionTitle}>What's the final score?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
            <ScorePicker
              value={score1}
              onChange={(v) => set("score1", v)}
              hasError={!!errors.score1}
              label={team1 ? `${getTeam(team1)?.flag ?? ""} ${getTeam(team1)?.shortName ?? team1}` : "Team 1"}
            />
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "44px", color: "#333", fontWeight: 300, paddingBottom: "28px" }}>:</div>
            <ScorePicker
              value={score2}
              onChange={(v) => set("score2", v)}
              hasError={!!errors.score2}
              label={team2 ? `${getTeam(team2)?.flag ?? ""} ${getTeam(team2)?.shortName ?? team2}` : "Team 2"}
            />
          </div>
        </div>

        {/* STEP 3: Name */}
        <div style={{ marginBottom: "36px" }}>
          <div style={sectionLabel}>STEP 3</div>
          <div style={sectionTitle}>Your name on the card</div>
          <input
            id="name"
            type="text"
            value={name}
            maxLength={20}
            placeholder="e.g. Ahmed, Sarah, Carlos..."
            onChange={(e) => set("name", e.target.value)}
            style={{
              width: "100%",
              background: "#111128",
              border: errors.name ? "2px solid #e94560" : "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              padding: "14px 16px",
              color: "#fff",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {errors.name ? <div style={errorMsg}>{errors.name}</div> : <span />}
            <div style={{ fontSize: "12px", color: name.length >= 18 ? "#e94560" : "#444" }}>{name.length}/20</div>
          </div>
        </div>

        {/* STEP 4: Theme */}
        <div style={{ marginBottom: "36px" }}>
          <div style={sectionLabel}>STEP 4</div>
          <div style={sectionTitle}>Choose your card style</div>
          <div style={{ display: "flex", gap: "12px" }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set("theme", t.id)}
                style={{
                  flex: 1,
                  padding: "20px 10px",
                  background: theme === t.id ? "rgba(233,69,96,0.12)" : "#111128",
                  border: theme === t.id ? "2px solid #e94560" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: "26px", marginBottom: "8px" }}>{t.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px", color: theme === t.id ? "#e94560" : "#ddd" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#666" }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 5: Language */}
        <div style={{ marginBottom: "44px" }}>
          <div style={sectionLabel}>STEP 5</div>
          <div style={sectionTitle}>Card language</div>
          <select
            value={language}
            onChange={(e) => set("language", e.target.value as Language)}
            style={selectStyle()}
          >
            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "20px",
            background: "#e94560",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "20px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 4px 24px rgba(233,69,96,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(233,69,96,0.6)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(233,69,96,0.4)"; }}
        >
          ⚽ Generate My Card
        </button>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#bbb", marginBottom: "14px" }}>🗓️ Today's Matches</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayMatches.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => prefillMatch(m)}
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
                    transition: "border-color 0.15s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(233,69,96,0.4)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {getTeam(m.team1)?.flag} {m.team1} vs {getTeam(m.team2)?.flag} {m.team2}
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>{m.time} · Group {m.group}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "56px", textAlign: "center", color: "#333", fontSize: "13px" }}>
          <div style={{ marginBottom: "6px" }}>Made with ❤️ for football fans worldwide</div>
          <div>⚽ goalcard.app — Free Forever</div>
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #111128; color: #fff; }
      `}</style>
    </div>
  );
}
