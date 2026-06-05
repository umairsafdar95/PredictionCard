import { useEffect, useState } from "react";
import { FormState } from "@/types";
import FormPage from "@/pages/FormPage";
import PreviewPage from "@/pages/PreviewPage";
import ShareSuccessPage from "@/pages/ShareSuccessPage";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";

type View = "form" | "preview" | "shared";

const COUNTER_KEY = "goalcard_session_count";
const TOTAL_KEY = "goalcard_total_count";

const DEFAULT_FORM: FormState = {
  team1: "United States",
  team2: "Mexico",
  score1: 1,
  score2: 0,
  name: "",
  theme: "dark",
  language: "en",
};

function getCardCount(): number {
  const stored = localStorage.getItem(TOTAL_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementCardCount() {
  const current = getCardCount();
  localStorage.setItem(TOTAL_KEY, String(current + 1));
}

export default function App() {
  const [view, setView] = useState<View>("form");
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM);
  const [challengerName, setChallengerName] = useState<string | null>(null);
  const [cardCount, setCardCount] = useState<number>(getCardCount());

  // Parse query params on mount for challenge links and match prefill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get("challenge");
    const team1 = params.get("team1");
    const team2 = params.get("team2");

    if (challenge) {
      setChallengerName(challenge);
    }
    if (team1 || team2) {
      setFormState((prev) => ({
        ...prev,
        ...(team1 ? { team1 } : {}),
        ...(team2 ? { team2 } : {}),
      }));
    }
    // Clear query string without reload
    if (params.toString()) {
      const url = window.location.pathname;
      window.history.replaceState({}, "", url);
    }
  }, []);

  const getDefaultTitle = (lang = formState.language) => {
    if (lang === "ar") return "مولد بطاقة توقع كأس العالم 2026 | PredictionCard.com";
    if (lang === "pt") return "Gerador de Cartão de Previsão Copa 2026 | PredictionCard.com";
    if (lang === "es") return "Generador de Tarjeta de Predicción Mundial 2026 | PredictionCard.com";
    if (lang === "fr") return "Générateur Carte Prédiction Coupe du Monde 2026 | PredictionCard.com";
    return "World Cup 2026 Prediction Card Generator — Free | PredictionCard.com";
  };

  const handleGenerate = () => {
    setView("preview");
    const { team1, score1, score2, team2 } = formState;
    document.title = `${team1} vs ${team2} Prediction Card | PredictionCard.com`;
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
    document.title = "PredictionCard — Free World Cup 2026 Prediction Card Generator";
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
