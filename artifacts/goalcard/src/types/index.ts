export type Theme = "dark" | "colors" | "modern";
export type Language = "en" | "ar" | "fr" | "pt" | "es" | "de" | "tr";

export interface FormState {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  name: string;
  theme: Theme;
  language: Language;
}

export interface LanguageLabels {
  title: string;
  vs: string;
  predictedBy: string;
}

export const languageLabels: Record<Language, LanguageLabels> = {
  en: { title: "Match Prediction", vs: "VS", predictedBy: "Predicted by" },
  ar: { title: "توقعي للنتيجة", vs: "مقابل", predictedBy: "توقع بواسطة" },
  fr: { title: "Ma Prédiction", vs: "contre", predictedBy: "Prédit par" },
  pt: { title: "Minha Previsão", vs: "contra", predictedBy: "Previsto por" },
  es: { title: "Mi Predicción", vs: "contra", predictedBy: "Predicho por" },
  de: { title: "Meine Vorhersage", vs: "gegen", predictedBy: "Vorhergesagt von" },
  tr: { title: "Tahminim", vs: "karşı", predictedBy: "Tahmin eden" },
};
