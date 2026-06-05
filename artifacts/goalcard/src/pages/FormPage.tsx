import { useState } from "react";
import { FormState, Theme, Language } from "@/types";
import teams, { getTeam } from "@/data/teams";
import { getTodaysMatches, type Match } from "@/data/matches";
import SchedulePage from "@/components/SchedulePage";
import { type ScheduleMatch } from "@/data/schedule";

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

const UI_TEXT: Record<Language, {
  subtitle: string; step1: string; step1sub: string; step2: string; step2sub: string;
  step3: string; step3sub: string; step4: string; step4sub: string; step5: string;
  step5sub: string; generate: string; howItWorks: string; about: string; faq: string;
  team1: string; team2: string; namePlaceholder: string;
}> = {
  en: {
    subtitle: "Predict the score · Download your card · Challenge friends",
    step1: "Which match?", step1sub: "Pick the two teams",
    step2: "What's your predicted score?", step2sub: "Set the final score",
    step3: "Your name on the card", step3sub: 'Shown as "Predicted by [Name]"',
    step4: "Card style", step4sub: "Choose your design theme",
    step5: "Card language", step5sub: "Text on the card",
    generate: "Generate My Card",
    howItWorks: "How to Make Your World Cup 2026 Prediction Card",
    about: "The Best Free World Cup Prediction Card Maker",
    faq: "Frequently Asked Questions",
    team1: "Team 1", team2: "Team 2", namePlaceholder: "e.g. Ahmed, Sarah, Carlos...",
  },
  ar: {
    subtitle: "توقع النتيجة · نزّل بطاقتك · تحدّ أصدقاءك",
    step1: "أي مباراة؟", step1sub: "اختر الفريقين",
    step2: "ما هو توقعك للنتيجة؟", step2sub: "حدد عدد الأهداف",
    step3: "اسمك على البطاقة", step3sub: "سيظهر كـ «توقع بواسطة [الاسم]»",
    step4: "تصميم البطاقة", step4sub: "اختر الأسلوب",
    step5: "لغة البطاقة", step5sub: "النص الذي يظهر على البطاقة",
    generate: "إنشاء بطاقة توقعي",
    howItWorks: "كيف تصنع بطاقة توقعاتك لكأس العالم 2026",
    about: "أفضل مولد بطاقات توقعات مجاني لكأس العالم",
    faq: "الأسئلة المتكررة",
    team1: "الفريق 1", team2: "الفريق 2", namePlaceholder: "مثال: أحمد، سارة، كارلوس...",
  },
  fr: {
    subtitle: "Prédis le score · Télécharge ta carte · Défie tes amis",
    step1: "Quel match ?", step1sub: "Choisis les deux équipes",
    step2: "Quel est ton score prédit ?", step2sub: "Fixe le score final",
    step3: "Ton prénom sur la carte", step3sub: "Affiché comme « Prédit par [Prénom] »",
    step4: "Style de la carte", step4sub: "Choisis ton design",
    step5: "Langue de la carte", step5sub: "Texte sur la carte",
    generate: "Générer ma carte de prédiction",
    howItWorks: "Comment créer ta carte de prédiction Coupe du Monde 2026",
    about: "Le meilleur générateur gratuit de cartes de prédiction",
    faq: "Questions fréquentes",
    team1: "Équipe 1", team2: "Équipe 2", namePlaceholder: "ex. Ahmed, Sarah, Carlos...",
  },
  pt: {
    subtitle: "Preveja o placar · Baixe seu card · Desafie amigos",
    step1: "Qual partida?", step1sub: "Escolha os dois times",
    step2: "Qual é o seu placar previsto?", step2sub: "Defina o placar final",
    step3: "Seu nome no card", step3sub: "Aparecerá como «Previsto por [Nome]»",
    step4: "Estilo do card", step4sub: "Escolha seu design",
    step5: "Idioma do card", step5sub: "Texto no card",
    generate: "Gerar meu card de previsão",
    howItWorks: "Como criar seu card de previsão da Copa do Mundo 2026",
    about: "O melhor gerador gratuito de cards de previsão",
    faq: "Perguntas frequentes",
    team1: "Time 1", team2: "Time 2", namePlaceholder: "ex. Ahmed, Sarah, Carlos...",
  },
  es: {
    subtitle: "Predice el marcador · Descarga tu tarjeta · Reta a amigos",
    step1: "¿Qué partido?", step1sub: "Elige los dos equipos",
    step2: "¿Cuál es tu marcador predicho?", step2sub: "Establece el marcador final",
    step3: "Tu nombre en la tarjeta", step3sub: "Aparecerá como «Predicho por [Nombre]»",
    step4: "Estilo de la tarjeta", step4sub: "Elige tu diseño",
    step5: "Idioma de la tarjeta", step5sub: "Texto en la tarjeta",
    generate: "Generar mi tarjeta de predicción",
    howItWorks: "Cómo hacer tu tarjeta de predicción del Mundial 2026",
    about: "El mejor generador gratuito de tarjetas de predicción",
    faq: "Preguntas frecuentes",
    team1: "Equipo 1", team2: "Equipo 2", namePlaceholder: "ej. Ahmed, Sarah, Carlos...",
  },
  de: {
    subtitle: "Tippe das Ergebnis · Lade deine Karte herunter · Fordere Freunde heraus",
    step1: "Welches Spiel?", step1sub: "Wähle die zwei Teams",
    step2: "Wie lautet dein Tipp?", step2sub: "Setze das Endergebnis",
    step3: "Dein Name auf der Karte", step3sub: "Erscheint als \u201eVorhergesagt von [Name]\u201c",
    step4: "Karten-Design", step4sub: "Wähle deinen Stil",
    step5: "Kartensprache", step5sub: "Text auf der Karte",
    generate: "Meine Tipp-Karte erstellen",
    howItWorks: "So erstellst du deine WM 2026 Tipp-Karte",
    about: "Der beste kostenlose WM-Tipp-Karten-Generator",
    faq: "Häufig gestellte Fragen",
    team1: "Team 1", team2: "Team 2", namePlaceholder: "z.B. Ahmed, Sarah, Carlos...",
  },
  tr: {
    subtitle: "Skoru tahmin et · Kartını indir · Arkadaşlarına meydan oku",
    step1: "Hangi maç?", step1sub: "İki takımı seç",
    step2: "Tahmin ettiğin skor nedir?", step2sub: "Final skorunu belirle",
    step3: "Karttaki adın", step3sub: "«[Ad] tarafından tahmin edildi» olarak görünür",
    step4: "Kart tasarımı", step4sub: "Stilini seç",
    step5: "Kart dili", step5sub: "Karttaki metin",
    generate: "Tahmin kartımı oluştur",
    howItWorks: "2026 Dünya Kupası Tahmin Kartın Nasıl Yapılır",
    about: "En iyi ücretsiz Dünya Kupası tahmin kartı oluşturucu",
    faq: "Sıkça Sorulan Sorular",
    team1: "Takım 1", team2: "Takım 2", namePlaceholder: "örn. Ahmed, Sarah, Carlos...",
  },
};

function ScorePicker({
  value,
  onChange,
  hasError,
  flag,
  shortName,
  teamName,
}: {
  value: number;
  onChange: (v: number) => void;
  hasError: boolean;
  flag: string;
  shortName: string;
  teamName: string;
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
        aria-label={`Increase score for ${teamName}`}
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
        aria-label={`Decrease score for ${teamName}`}
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
  const ui = UI_TEXT[language];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"predict" | "schedule">("predict");
  const [loadedMatch, setLoadedMatch] = useState<{ team1: string; team2: string; team1Flag: string; team2Flag: string } | null>(null);
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
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>

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
          }}>{ui.subtitle}</div>

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

      {/* ── TAB BAR ── */}
      <div style={{
        background: "#0d0d1f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex" }}>
          {(["predict", "schedule"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "14px 0",
                  background: "none", border: "none",
                  borderBottom: active ? "3px solid #22c55e" : "3px solid transparent",
                  color: active ? "#22c55e" : "rgba(255,255,255,0.50)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.3px",
                }}
              >
                {tab === "predict" ? "⚽ Make Prediction" : "📅 Schedule"}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "schedule" ? (
        <SchedulePage onPredict={(m: ScheduleMatch) => {
          set("team1", m.team1);
          set("team2", m.team2);
          setLoadedMatch({ team1: m.team1, team2: m.team2, team1Flag: m.team1Flag, team2Flag: m.team2Flag });
          setActiveTab("predict");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      ) : (
        <>

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

      <main role="main" style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 16px 64px" }}>

        {/* Loaded match banner */}
        {loadedMatch && (
          <div style={{
            background: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "14px",
            padding: "13px 18px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "20px" }}>⚽</span>
            <div style={{ flex: 1, fontSize: "13px", color: "#86efac", fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
              Match loaded: {loadedMatch.team1Flag} {loadedMatch.team1} vs {loadedMatch.team2Flag} {loadedMatch.team2} — enter your prediction!
            </div>
            <button
              type="button"
              onClick={() => setLoadedMatch(null)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.40)", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
            >✕</button>
          </div>
        )}

        {/* ── STEP 1: Match ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("1")}>1</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step1}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step1sub}</div>
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
                    aria-label={`Predict ${m.team1} vs ${m.team2}`}
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
                <div style={{ textAlign: "center", marginBottom: "6px" }}>
                  <img src={`https://flagcdn.com/w80/${t1.code}.png`} alt={t1.name} style={{ height: "32px", width: "auto", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.15)" }} />
                </div>
              )}
              <select
                id="team1"
                value={team1}
                onChange={(e) => set("team1", e.target.value)}
                style={selectStyle(!!errors.team1)}
                title="Select Team 1 for your World Cup prediction"
                aria-label="Select Team 1"
              >
                <option value="">{ui.team1}</option>
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
                <div style={{ textAlign: "center", marginBottom: "6px" }}>
                  <img src={`https://flagcdn.com/w80/${t2.code}.png`} alt={t2.name} style={{ height: "32px", width: "auto", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.15)" }} />
                </div>
              )}
              <select
                id="team2"
                value={team2}
                onChange={(e) => set("team2", e.target.value)}
                style={selectStyle(!!errors.team2)}
                title="Select Team 2 for your World Cup prediction"
                aria-label="Select Team 2"
              >
                <option value="">{ui.team2}</option>
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
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step2}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step2sub}</div>
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
              teamName={team1 || "Team 1"}
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
              teamName={team2 || "Team 2"}
            />
          </div>
        </div>

        {/* ── STEP 3: Name ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("3")}>3</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step3}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step3sub}</div>
            </div>
          </div>
          <input
            id="name"
            type="text"
            value={name}
            maxLength={20}
            placeholder={ui.namePlaceholder}
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
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step4}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step4sub}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {THEMES.map((t) => {
              const selected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Select ${t.label} card theme`}
                  aria-pressed={selected}
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
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step5}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step5sub}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {LANGUAGES.map((l) => {
              const sel = language === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-label={`Set card language to ${l.label}`}
                  aria-pressed={sel}
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
          aria-label="Generate World Cup prediction card"
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
          ⚽ &nbsp;{ui.generate}
        </button>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>
          Free · Instant · Shareable on WhatsApp & Instagram
        </div>

        {/* ── HOW IT WORKS ── */}
        <section
          aria-label="How to create your World Cup 2026 prediction card"
          style={{ marginTop: "64px", borderTop: "1px solid #e5e7eb", paddingTop: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "24px", letterSpacing: "1px",
          }}>{ui.howItWorks}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              {
                n: "1",
                title: "Choose Your Match",
                text: "Select any FIFA World Cup 2026 match from all 32 qualified teams — USA vs Mexico, Brazil vs Argentina, France vs Morocco, and every other fixture.",
              },
              {
                n: "2",
                title: "Enter Your Score Prediction",
                text: "What's your predicted final score? Tap + and − to set the goals for each team. Your World Cup score prediction appears live on the card.",
              },
              {
                n: "3",
                title: "Pick Your Card Design",
                text: "Choose from 5 prediction card themes: Night Match, National Colors, FIFA Gold, Retro Classic, or Neon Lights. Each design looks stunning on any screen.",
              },
              {
                n: "4",
                title: "Download and Share",
                text: "Download your prediction card as a high-quality 1080×1080 PNG. Share it on WhatsApp, Instagram Stories, or Twitter and challenge your friends to make their own predictions.",
              },
            ].map((step) => (
              <div key={step.n} style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px 18px",
                border: "1px solid #e5e7eb",
              }}>
                <h3 style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700,
                  color: "#15803d", marginBottom: "8px", letterSpacing: "0.5px",
                }}>{step.n}. {step.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section
          aria-label="About PredictionCard"
          style={{ marginTop: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "16px", letterSpacing: "1px",
          }}>{ui.about}</h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "14px" }}>
              PredictionCard.com is the fastest way to create and share your FIFA World Cup 2026 score predictions. Unlike basic text predictions, our football prediction cards are beautifully designed images that stand out in WhatsApp groups and Instagram feeds.
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "14px" }}>
              With all 32 World Cup 2026 teams available, you can generate a new prediction card for every single game of the tournament. Each card is personalized with your name, predicted score, team colors, and national flags.
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
              Our World Cup card maker works in 7 languages including Arabic (RTL), Portuguese, Spanish, and French — perfect for football fans worldwide. No signup, no app download, and completely free.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          aria-label="Frequently Asked Questions about PredictionCard"
          style={{ marginTop: "48px" }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "20px", letterSpacing: "1px",
          }}>{ui.faq}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                q: "Is the World Cup 2026 prediction card generator free?",
                a: "Yes. Creating your World Cup 2026 prediction card is 100% free. No account, no email, no credit card needed. Generate as many cards as you want for every match.",
              },
              {
                q: "Which teams are available in the prediction card generator?",
                a: "All 32 qualified FIFA World Cup 2026 teams are available, including USA, Mexico, Canada (host nations), plus Brazil, Argentina, France, Spain, England, Morocco, Saudi Arabia, Japan, South Korea, and all other qualified nations.",
              },
              {
                q: "Can I share my prediction card on WhatsApp?",
                a: "Absolutely. Your prediction card downloads as a 1080×1080 PNG image which you can share instantly on WhatsApp, Instagram, Twitter, or any social platform. The Share button lets you send directly from your phone.",
              },
              {
                q: "Does the prediction card work in Arabic?",
                a: "Yes. Select Arabic from the language menu and your prediction card will display in Arabic with proper right-to-left text. We support English, Arabic, Portuguese, Spanish, French, Turkish, and German.",
              },
              {
                q: "What size is the prediction card image?",
                a: "Prediction cards download as 1080×1080 pixel PNG images — perfect for Instagram square posts and WhatsApp sharing. The high resolution ensures your card looks crisp on any screen.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #e5e7eb" }}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3
                  itemProp="name"
                  style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}
                >{faq.q}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p
                    itemProp="text"
                    style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}
                  >{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{ marginTop: "60px", borderTop: "1px solid #e5e7eb", paddingTop: "32px", paddingBottom: "16px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700, color: "#15803d", marginBottom: "6px" }}>
              ⚽ PredictionCard
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px" }}>
              Free FIFA World Cup 2026 Prediction Card Generator
            </p>
          </div>
          <nav aria-label="Language links" style={{ textAlign: "center", marginBottom: "16px", fontSize: "13px" }}>
            <a href="/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>English</a> ·
            <a href="/ar/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>العربية</a> ·
            <a href="/pt/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Português</a> ·
            <a href="/es/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Español</a> ·
            <a href="/fr/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Français</a>
          </nav>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#d1d5db", margin: 0 }}>
            © 2026 predictioncard.com · Made for football fans worldwide · Not affiliated with FIFA
          </p>
        </footer>
      </main>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #fff; color: #0f172a; }
        select:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        button:active { transform: scale(0.98) !important; }
      `}</style>
        </>
      )}
    </div>
  );
}
