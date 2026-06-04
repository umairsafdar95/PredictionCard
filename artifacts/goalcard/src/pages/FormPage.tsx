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
  { id: "dark", label: "Night Match", icon: "🌙", desc: "Cinematic green glow" },
  { id: "colors", label: "National Colors", icon: "🎌", desc: "Team colors, split design" },
  { id: "modern", label: "FIFA Gold", icon: "🏆", desc: "Deep navy & gold trophy" },
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
      <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "110px", textAlign: "center", fontWeight: 500 }}>{label}</div>
      <button
        type="button"
        onClick={() => onChange(Math.min(9, value + 1))}
        style={{
          width: "44px", height: "44px",
          background: "#dcfce7",
          border: "1px solid #86efac",
          borderRadius: "8px",
          color: "#16a34a",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
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
          background: "#fff",
          border: hasError ? "2px solid #dc2626" : "2px solid #16a34a",
          borderRadius: "12px",
          color: "#0f172a",
          fontSize: "42px",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          textAlign: "center",
          outline: "none",
          boxShadow: "0 2px 8px rgba(22,163,74,0.12)",
        }}
      />
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: "44px", height: "44px",
          background: "#dcfce7",
          border: "1px solid #86efac",
          borderRadius: "8px",
          color: "#16a34a",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
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
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "team1" || field === "team2") {
      const t1 = field === "team1" ? (value as string) : formState.team1;
      const t2 = field === "team2" ? (value as string) : formState.team2;
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
    background: "#fff",
    border: hasError ? "2px solid #dc2626" : "1.5px solid #d1d5db",
    borderRadius: "10px",
    padding: "14px 12px",
    color: "#0f172a",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  });

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    color: "#16a34a",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    marginBottom: "6px",
    fontWeight: 700,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "19px",
    fontWeight: 700,
    marginBottom: "18px",
    color: "#0f172a",
  };

  const errorMsg: React.CSSProperties = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "5px",
    fontWeight: 500,
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px 24px",
    marginBottom: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)",
        padding: "32px 20px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "42px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px", color: "#fff" }}>
            ⚽ <span style={{ color: "#fde68a" }}>Prediction</span>Card
          </div>
          <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", marginBottom: "4px", fontWeight: 500 }}>Predict the score. Share your card.</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>predictioncard.com • FIFA World Cup 2026</div>
          <div style={{
            display: "inline-block",
            marginTop: "16px",
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "20px",
            padding: "7px 20px",
            fontSize: "13px",
            color: "#fff",
            fontWeight: 600,
            backdropFilter: "blur(4px)",
          }}>
            🃏 {(cardCount + 47293).toLocaleString()} cards generated today
          </div>
        </div>
      </header>

      {/* Challenge banner */}
      {challengerName && (
        <div style={{
          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: 600,
          color: "#fff",
        }}>
          🏆 <strong>{challengerName}</strong> challenged you to predict this match!
        </div>
      )}

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* STEP 1: Match */}
        <div style={card}>
          <div style={sectionLabel}>STEP 1</div>
          <div style={sectionTitle}>Which match are you predicting?</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
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
              fontSize: "15px",
              color: "#fff",
              background: "#16a34a",
              borderRadius: "8px",
              padding: "14px 11px",
              flexShrink: 0,
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
        <div style={card}>
          <div style={sectionLabel}>STEP 2</div>
          <div style={sectionTitle}>What's the final score?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
            <ScorePicker
              value={score1}
              onChange={(v) => set("score1", v)}
              hasError={!!errors.score1}
              label={team1 ? `${getTeam(team1)?.flag ?? ""} ${getTeam(team1)?.shortName ?? team1}` : "Team 1"}
            />
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "44px", color: "#d1d5db", fontWeight: 300, paddingBottom: "28px" }}>:</div>
            <ScorePicker
              value={score2}
              onChange={(v) => set("score2", v)}
              hasError={!!errors.score2}
              label={team2 ? `${getTeam(team2)?.flag ?? ""} ${getTeam(team2)?.shortName ?? team2}` : "Team 2"}
            />
          </div>
        </div>

        {/* STEP 3: Name */}
        <div style={card}>
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
              background: "#fff",
              border: errors.name ? "2px solid #dc2626" : "1.5px solid #d1d5db",
              borderRadius: "10px",
              padding: "14px 16px",
              color: "#0f172a",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {errors.name ? <div style={errorMsg}>{errors.name}</div> : <span />}
            <div style={{ fontSize: "12px", color: name.length >= 18 ? "#dc2626" : "#9ca3af" }}>{name.length}/20</div>
          </div>
        </div>

        {/* STEP 4: Theme */}
        <div style={card}>
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
                  background: theme === t.id ? "#f0fdf4" : "#fafafa",
                  border: theme === t.id ? "2px solid #16a34a" : "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "#0f172a",
                  textAlign: "center",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.15s",
                  boxShadow: theme === t.id ? "0 0 0 3px rgba(22,163,74,0.12)" : "none",
                }}
              >
                <div style={{ fontSize: "26px", marginBottom: "8px" }}>{t.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "3px", color: theme === t.id ? "#16a34a" : "#374151" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 5: Language */}
        <div style={card}>
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
            background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "20px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 6px 28px rgba(22,163,74,0.40)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(22,163,74,0.55)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,163,74,0.40)"; }}
        >
          ⚽ Generate My Card
        </button>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#374151", marginBottom: "14px" }}>🗓️ Today's Matches — Click to prefill</div>
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
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    {getTeam(m.team1)?.flag} {m.team1} vs {getTeam(m.team2)?.flag} {m.team2}
                  </span>
                  <span style={{ fontSize: "12px", color: "#9ca3af", background: "#f3f4f6", borderRadius: "6px", padding: "3px 8px" }}>{m.time} · Group {m.group}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "56px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
          <div style={{ marginBottom: "6px" }}>Made with ❤️ for football fans worldwide</div>
          <div>⚽ predictioncard.com — Free Forever</div>
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #fff; color: #0f172a; }
        select:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
        input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
      `}</style>
    </div>
  );
}
