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

const THEMES: {
  id: Theme;
  label: string;
  desc: string;
  bg: string;
  accent: string;
  preview: string;
}[] = [
  {
    id: "dark",
    label: "Night Match",
    desc: "Dark stadium, green glow",
    bg: "linear-gradient(135deg, #050d14 0%, #0a1a0d 100%)",
    accent: "#22c55e",
    preview: "🌙",
  },
  {
    id: "colors",
    label: "National Colors",
    desc: "Team flag split design",
    bg: "linear-gradient(90deg, #002868 50%, #006847 50%)",
    accent: "#ffffff",
    preview: "🎌",
  },
  {
    id: "modern",
    label: "FIFA Gold",
    desc: "Deep navy & gold luxury",
    bg: "linear-gradient(135deg, #071330 0%, #0d1e4a 100%)",
    accent: "#d4af37",
    preview: "🏆",
  },
  {
    id: "retro",
    label: "Retro Classic",
    desc: "Vintage poster, bold red",
    bg: "linear-gradient(135deg, #f5ede0 0%, #edddc8 100%)",
    accent: "#c0392b",
    preview: "🕰️",
  },
  {
    id: "neon",
    label: "Neon Lights",
    desc: "Jet black, electric cyan",
    bg: "radial-gradient(ellipse at 50% 0%, #07101a 0%, #010508 100%)",
    accent: "#00e8ff",
    preview: "⚡",
  },
];

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "ar", label: "العربية", flag: "🇸🇦" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
];

function ScorePicker({
  value,
  onChange,
  hasError,
  flag,
  shortName,
}: {
  value: number;
  onChange: (v: number) => void;
  hasError: boolean;
  flag: string;
  shortName: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "14px", color: "#4b5563", fontWeight: 600,
      }}>
        <span style={{ fontSize: "22px" }}>{flag}</span>
        <span>{shortName}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(9, value + 1))}
        style={{
          width: "48px", height: "48px",
          background: "linear-gradient(135deg, #15803d, #16a34a)",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          boxShadow: "0 3px 10px rgba(22,163,74,0.35)",
        }}
      >+</button>
      <div style={{
        width: "88px", height: "88px",
        background: "#fff",
        border: hasError ? "2px solid #dc2626" : "2.5px solid #16a34a",
        borderRadius: "14px",
        color: "#0f172a",
        fontSize: "52px",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 900,
        textAlign: "center",
        lineHeight: "88px",
        boxShadow: "0 4px 16px rgba(22,163,74,0.15)",
      }}>{value}</div>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: "48px", height: "48px",
          background: "#f1f5f9",
          border: "1.5px solid #e2e8f0",
          borderRadius: "10px",
          color: "#64748b",
          fontSize: "24px",
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

  const t1 = getTeam(team1);
  const t2 = getTeam(team2);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "team1" || field === "team2") {
      const a = field === "team1" ? (value as string) : formState.team1;
      const b = field === "team2" ? (value as string) : formState.team2;
      if (a && b && a === b) {
        setErrors((e) => ({ ...e, team2: "Teams must be different" }));
      } else {
        setErrors((e) => { const copy = { ...e }; delete copy.team2; return copy; });
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
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onGenerate();
  };

  const prefillMatch = (m: Match) => {
    setFormState((prev) => ({ ...prev, team1: m.team1, team2: m.team2 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px 24px",
    marginBottom: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  const stepBadge = (n: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px", height: "26px",
    background: "linear-gradient(135deg, #15803d, #22c55e)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 800,
    marginRight: "10px",
    flexShrink: 0,
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0",
  });

  const errorMsg: React.CSSProperties = { color: "#dc2626", fontSize: "12px", marginTop: "5px", fontWeight: 500 };

  const selectStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "#f8fafc",
    border: hasError ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 14px",
    color: "#0f172a",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    outline: "none",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
    appearance: "auto",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>

      {/* ══ HERO HEADER ══ */}
      <header style={{
        background: "linear-gradient(160deg, #061220 0%, #0a1f14 55%, #061220 100%)",
        padding: "0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative: pitch arc lines */}
        <div style={{
          position: "absolute", bottom: "-320px", left: "50%",
          transform: "translateX(-50%)",
          width: "1000px", height: "1000px",
          border: "1px solid rgba(34,197,94,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-180px", left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "600px",
          border: "1px solid rgba(34,197,94,0.06)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        {/* Decorative: green spotlight */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.15) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Top gold accent bar */}
        <div style={{
          width: "100%", height: "3px",
          background: "linear-gradient(90deg, transparent, #d4af37 30%, #f5e17a 50%, #d4af37 70%, transparent)",
        }} />

        <div style={{ padding: "36px 20px 40px", position: "relative" }}>
          {/* Tournament badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.35)",
            borderRadius: "20px",
            padding: "5px 16px",
            marginBottom: "20px",
            fontSize: "11px",
            color: "#d4af37",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>
            🏆 FIFA WORLD CUP 2026
          </div>

          {/* Logo */}
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "52px",
            fontWeight: 900,
            letterSpacing: "2px",
            marginBottom: "10px",
            color: "#fff",
            lineHeight: 1,
          }}>
            ⚽ <span style={{
              background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Prediction</span>Card
          </div>

          <div style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.65)",
            marginBottom: "28px",
            letterSpacing: "0.5px",
          }}>Predict the score · Download your card · Challenge friends</div>

          {/* Stats row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            {[
              { icon: "🃏", val: (cardCount + 47293).toLocaleString(), label: "cards made" },
              { icon: "🌍", val: "32", label: "nations" },
              { icon: "🎨", val: "5", label: "card styles" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "10px 18px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ fontSize: "16px" }}>{s.icon}</span>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff" }}>{s.val}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom green bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #15803d, #22c55e, #86efac, #22c55e, #15803d)" }} />
      </header>

      {/* Challenge banner */}
      {challengerName && (
        <div style={{
          background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: 600,
          color: "#fff",
          borderBottom: "3px solid #f59e0b",
        }}>
          🏆 <strong>{challengerName}</strong> challenged you to predict this match!
        </div>
      )}

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 16px 64px" }}>

        {/* ── STEP 1: Match ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("1")}>1</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Which match?</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>Pick the two teams</div>
            </div>
          </div>

          {/* Today's quick-pick matches */}
          {todayMatches.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 700 }}>Today's matches — tap to prefill</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {todayMatches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => prefillMatch(m)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: "10px", padding: "11px 14px",
                      cursor: "pointer", color: "#0f172a",
                      fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 500,
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <span>{getTeam(m.team1)?.flag} {m.team1} <span style={{ color: "#9ca3af" }}>vs</span> {getTeam(m.team2)?.flag} {m.team2}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af", background: "#e5e7eb", borderRadius: "6px", padding: "2px 8px", whiteSpace: "nowrap" }}>{m.time}</span>
                  </button>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1", margin: "14px 0 8px", letterSpacing: "2px" }}>── OR PICK MANUALLY ──</div>
            </div>
          )}

          {/* Team selectors */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px", alignItems: "start" }}>
            <div>
              {t1 && (
                <div style={{ textAlign: "center", fontSize: "28px", marginBottom: "6px" }}>{t1.flag}</div>
              )}
              <select id="team1" value={team1} onChange={(e) => set("team1", e.target.value)} style={selectStyle(!!errors.team1)}>
                <option value="">Team 1</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team1 && <div style={errorMsg}>{errors.team1}</div>}
            </div>

            <div style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 900,
              fontSize: "13px", color: "#fff",
              background: "linear-gradient(135deg, #15803d, #16a34a)",
              borderRadius: "10px", padding: "14px 10px",
              marginTop: t1 ? "38px" : "0",
              letterSpacing: "2px",
              boxShadow: "0 3px 10px rgba(22,163,74,0.30)",
            }}>VS</div>

            <div>
              {t2 && (
                <div style={{ textAlign: "center", fontSize: "28px", marginBottom: "6px" }}>{t2.flag}</div>
              )}
              <select id="team2" value={team2} onChange={(e) => set("team2", e.target.value)} style={selectStyle(!!errors.team2)}>
                <option value="">Team 2</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team2 && <div style={errorMsg}>{errors.team2}</div>}
            </div>
          </div>
        </div>

        {/* ── STEP 2: Score ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span style={stepBadge("2")}>2</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>What's your predicted score?</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>Set the final score</div>
            </div>
          </div>

          {/* Scoreboard */}
          <div style={{
            background: "linear-gradient(135deg, #0a1628 0%, #0f2040 100%)",
            borderRadius: "16px",
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}>
            <ScorePicker
              value={score1}
              onChange={(v) => set("score1", v)}
              hasError={!!errors.score1}
              flag={t1?.flag ?? "🏳"}
              shortName={t1?.shortName ?? (team1 || "Team 1")}
            />
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "56px", color: "rgba(255,255,255,0.2)",
              fontWeight: 300, lineHeight: 1, paddingBottom: "50px",
            }}>:</div>
            <ScorePicker
              value={score2}
              onChange={(v) => set("score2", v)}
              hasError={!!errors.score2}
              flag={t2?.flag ?? "🏳"}
              shortName={t2?.shortName ?? (team2 || "Team 2")}
            />
          </div>
        </div>

        {/* ── STEP 3: Name ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("3")}>3</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Your name on the card</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>Shown as "Predicted by [Name]"</div>
            </div>
          </div>
          <input
            id="name"
            type="text"
            value={name}
            maxLength={20}
            placeholder="e.g. Ahmed, Sarah, Carlos..."
            onChange={(e) => set("name", e.target.value)}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: errors.name ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              color: "#0f172a",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {errors.name ? <div style={errorMsg}>{errors.name}</div> : <span />}
            <div style={{ fontSize: "12px", color: name.length >= 18 ? "#dc2626" : "#9ca3af" }}>{name.length}/20</div>
          </div>
        </div>

        {/* ── STEP 4: Theme ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("4")}>4</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Card style</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>Choose your design theme</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {THEMES.map((t) => {
              const selected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set("theme", t.id)}
                  style={{
                    flex: 1,
                    padding: "0",
                    background: "none",
                    border: selected ? `2.5px solid ${t.accent === "#ffffff" ? "#22c55e" : t.accent}` : "2px solid #e2e8f0",
                    borderRadius: "14px",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: selected ? `0 0 0 3px ${t.accent === "#ffffff" ? "rgba(34,197,94,0.2)" : t.accent + "33"}` : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Color preview bar */}
                  <div style={{
                    height: "64px",
                    background: t.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Accent dot */}
                    <div style={{
                      position: "absolute", top: "8px", right: "8px",
                      width: "8px", height: "8px",
                      borderRadius: "50%",
                      background: t.accent,
                      boxShadow: `0 0 6px ${t.accent}`,
                    }} />
                    {t.preview}
                  </div>
                  {/* Label */}
                  <div style={{
                    padding: "10px 8px 12px",
                    background: selected ? "#f0fdf4" : "#fafafa",
                  }}>
                    <div style={{
                      fontSize: "12px", fontWeight: 700,
                      color: selected ? "#15803d" : "#374151",
                      marginBottom: "2px",
                      fontFamily: "'Oswald', sans-serif",
                      letterSpacing: "0.5px",
                    }}>{t.label}</div>
                    <div style={{ fontSize: "10px", color: "#9ca3af" }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STEP 5: Language ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("5")}>5</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Card language</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>Text on the card</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {LANGUAGES.map((l) => {
              const sel = language === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => set("language", l.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 14px",
                    background: sel ? "#f0fdf4" : "#f8fafc",
                    border: sel ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    fontWeight: sel ? 700 : 500,
                    color: sel ? "#15803d" : "#374151",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{l.flag}</span>
                  <span>{l.label}</span>
                  {sel && <span style={{ marginLeft: "auto", fontSize: "14px" }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GENERATE BUTTON ── */}
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "22px",
            background: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #16a34a 100%)",
            border: "none",
            borderRadius: "16px",
            color: "#fff",
            fontSize: "20px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 800,
            letterSpacing: "3px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 8px 32px rgba(22,163,74,0.45), 0 2px 0 rgba(255,255,255,0.1) inset",
            transition: "transform 0.15s, box-shadow 0.15s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,163,74,0.55), 0 2px 0 rgba(255,255,255,0.1) inset";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.45), 0 2px 0 rgba(255,255,255,0.1) inset";
          }}
        >
          ⚽ &nbsp;Generate My Card
        </button>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>
          Free · Instant · Shareable on WhatsApp & Instagram
        </div>

        {/* Footer */}
        <div style={{ marginTop: "60px", textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: "28px" }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700, color: "#15803d", marginBottom: "6px" }}>
            ⚽ PredictionCard
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>predictioncard.com · Made for football fans worldwide · Free Forever</div>
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #fff; color: #0f172a; }
        select:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        button:active { transform: scale(0.98) !important; }
      `}</style>
    </div>
  );
}
