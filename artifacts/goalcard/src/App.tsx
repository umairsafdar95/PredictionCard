import { useEffect, useState } from "react";
import { FormState } from "@/types";
import FormPage from "@/pages/FormPage";
import PreviewPage from "@/pages/PreviewPage";
import ShareSuccessPage from "@/pages/ShareSuccessPage";
import PricingPage from "@/pages/PricingPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";

type View = "form" | "preview" | "shared";

const COUNTER_KEY = "goalcard_session_count";
const TOTAL_KEY = "goalcard_total_count";

function getLangFromPath(): import("@/types").Language {
  const m = window.location.pathname.match(/^\/(ar|pt|es|fr|de|tr)(\/|$)/);
  return (m ? m[1] : "en") as import("@/types").Language;
}

const DEFAULT_FORM: FormState = {
  team1: "United States",
  team2: "Mexico",
  score1: 1,
  score2: 0,
  name: "",
  theme: "dark",
  language: getLangFromPath(),
};

function getCardCount(): number {
  const stored = localStorage.getItem(TOTAL_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementCardCount() {
  const current = getCardCount();
  localStorage.setItem(TOTAL_KEY, String(current + 1));
}

/* ── Main app (has hooks — must not have early returns before hooks) ── */
function MainApp() {
  const [view, setView] = useState<View>("form");
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM);
  const [challengerName, setChallengerName] = useState<string | null>(null);
  const [cardCount, setCardCount] = useState<number>(getCardCount());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get("challenge");
    const team1 = params.get("team1");
    const team2 = params.get("team2");

    if (challenge) setChallengerName(challenge);
    if (team1 || team2) {
      setFormState((prev) => ({
        ...prev,
        ...(team1 ? { team1 } : {}),
        ...(team2 ? { team2 } : {}),
      }));
    }
    if (params.toString()) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const getDefaultTitle = (lang = formState.language) => {
    if (lang === "ar") return "مولد بطاقة توقع كأس العالم 2026 | PerdictionCard.com";
    if (lang === "pt") return "Gerador de Cartão de Previsão Copa 2026 | PerdictionCard.com";
    if (lang === "es") return "Generador de Tarjeta de Predicción Mundial 2026 | PerdictionCard.com";
    if (lang === "fr") return "Générateur Carte Prédiction Coupe du Monde 2026 | PerdictionCard.com";
    return "World Cup 2026 Prediction Card Generator — Free | PerdictionCard.com";
  };

  const handleGenerate = () => {
    setView("preview");
    const { team1, score1, score2, team2 } = formState;
    document.title = `${team1} vs ${team2} Prediction Card | PerdictionCard.com`;
    window.scrollTo({ top: 0 });
  };

  const handleIncrementCounter = () => {
    incrementCardCount();
    setCardCount((prev) => prev + 1);
  };

  const handleBack = () => {
    setView("form");
    document.title = getDefaultTitle();
    window.scrollTo({ top: 0 });
  };

  const handleNewCard = () => {
    setView("form");
    document.title = getDefaultTitle();
    window.scrollTo({ top: 0 });
  };

  const handleShared = () => {
    setView("shared");
    window.scrollTo({ top: 0 });
  };

  const handleMakeAnother = () => {
    setView("form");
    document.title = "PerdictionCard — Free World Cup 2026 Prediction Card Generator";
    window.scrollTo({ top: 0 });
  };

  if (view === "preview") {
    return (
      <PreviewPage
        formState={formState}
        onBack={handleBack}
        onNewCard={handleNewCard}
        onShared={handleShared}
        onIncrementCounter={handleIncrementCounter}
      />
    );
  }

  if (view === "shared") {
    return <ShareSuccessPage onMakeAnother={handleMakeAnother} />;
  }

  return (
    <FormPage
      formState={formState}
      setFormState={setFormState}
      onGenerate={handleGenerate}
      challengerName={challengerName}
      cardCount={cardCount}
    />
  );
}

/* ── Router — no hooks, safe to early-return ── */
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "");
  if (path === "/pricing") return <PricingPage />;
  if (path === "/terms-and-conditions") return <TermsPage />;
  if (path === "/privacy") return <PrivacyPage />;
  return <MainApp />;
}
