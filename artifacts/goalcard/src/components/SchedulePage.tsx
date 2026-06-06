import { useState, useEffect } from "react";
import schedule, { ScheduleMatch, getNextMatch } from "@/data/schedule";
import { Language } from "@/types";

interface Props {
  onPredict: (match: ScheduleMatch) => void;
  language: Language;
}

const pad = (n: number) => String(n).padStart(2, "0");

const SCHEDULE_TEXT: Record<Language, {
  all: string; groupStage: string; roundOf32: string; quarterFinals: string;
  semiFinals: string; thirdPlace: string; final: string;
  today: string; tomorrow: string; thisWeek: string;
  nextMatchIn: string; days: string; hrs: string; min: string; sec: string;
  liveNow: string; predictMatch: string; predictFinal: string;
  completed: string; noMatches: string; searchPlaceholder: string;
  worldCupFinal: string; group: string; liveTag: string; todayTag: string;
}> = {
  en: {
    all: "All", groupStage: "Group Stage", roundOf32: "Round of 32",
    quarterFinals: "Quarter Finals", semiFinals: "Semi Finals",
    thirdPlace: "Third Place", final: "Final",
    today: "Today", tomorrow: "Tomorrow", thisWeek: "This Week",
    nextMatchIn: "NEXT MATCH IN", days: "DAYS", hrs: "HRS", min: "MIN", sec: "SEC",
    liveNow: "🔴 MATCH IS LIVE NOW", predictMatch: "Predict This Match",
    predictFinal: "Predict the Final Winner", completed: "Match completed",
    noMatches: "No matches found for this filter",
    searchPlaceholder: "Search team, city...",
    worldCupFinal: "🏆 WORLD CUP FINAL 🏆", group: "Group",
    liveTag: "🔴 LIVE", todayTag: "TODAY",
  },
  ar: {
    all: "الكل", groupStage: "دور المجموعات", roundOf32: "دور الـ32",
    quarterFinals: "ربع النهائي", semiFinals: "نصف النهائي",
    thirdPlace: "المركز الثالث", final: "النهائي",
    today: "اليوم", tomorrow: "غداً", thisWeek: "هذا الأسبوع",
    nextMatchIn: "المباراة القادمة خلال", days: "أيام", hrs: "ساعات", min: "دقائق", sec: "ثوانٍ",
    liveNow: "🔴 المباراة تُذاع الآن", predictMatch: "توقّع هذه المباراة",
    predictFinal: "توقّع بطل النهائي", completed: "انتهت المباراة",
    noMatches: "لا توجد مباريات لهذا الفلتر",
    searchPlaceholder: "ابحث عن فريق أو مدينة...",
    worldCupFinal: "🏆 نهائي كأس العالم 🏆", group: "المجموعة",
    liveTag: "🔴 مباشر", todayTag: "اليوم",
  },
  fr: {
    all: "Tout", groupStage: "Phase de groupes", roundOf32: "Huitièmes de finale",
    quarterFinals: "Quarts de finale", semiFinals: "Demi-finales",
    thirdPlace: "3ème place", final: "Finale",
    today: "Aujourd'hui", tomorrow: "Demain", thisWeek: "Cette semaine",
    nextMatchIn: "PROCHAIN MATCH DANS", days: "JOURS", hrs: "HRS", min: "MIN", sec: "SEC",
    liveNow: "🔴 MATCH EN DIRECT", predictMatch: "Prédire ce match",
    predictFinal: "Prédire le vainqueur de la finale", completed: "Match terminé",
    noMatches: "Aucun match trouvé pour ce filtre",
    searchPlaceholder: "Rechercher équipe, ville...",
    worldCupFinal: "🏆 FINALE DE LA COUPE DU MONDE 🏆", group: "Groupe",
    liveTag: "🔴 LIVE", todayTag: "AUJOURD'HUI",
  },
  pt: {
    all: "Todos", groupStage: "Fase de Grupos", roundOf32: "Oitavas de Final",
    quarterFinals: "Quartas de Final", semiFinals: "Semifinais",
    thirdPlace: "3º Lugar", final: "Final",
    today: "Hoje", tomorrow: "Amanhã", thisWeek: "Esta Semana",
    nextMatchIn: "PRÓXIMA PARTIDA EM", days: "DIAS", hrs: "HRS", min: "MIN", sec: "SEG",
    liveNow: "🔴 PARTIDA AO VIVO AGORA", predictMatch: "Prever Esta Partida",
    predictFinal: "Prever o Vencedor da Final", completed: "Partida encerrada",
    noMatches: "Nenhuma partida encontrada para este filtro",
    searchPlaceholder: "Buscar time, cidade...",
    worldCupFinal: "🏆 FINAL DA COPA DO MUNDO 🏆", group: "Grupo",
    liveTag: "🔴 AO VIVO", todayTag: "HOJE",
  },
  es: {
    all: "Todos", groupStage: "Fase de Grupos", roundOf32: "Octavos de Final",
    quarterFinals: "Cuartos de Final", semiFinals: "Semifinales",
    thirdPlace: "3er Lugar", final: "Final",
    today: "Hoy", tomorrow: "Mañana", thisWeek: "Esta Semana",
    nextMatchIn: "PRÓXIMO PARTIDO EN", days: "DÍAS", hrs: "HRS", min: "MIN", sec: "SEG",
    liveNow: "🔴 PARTIDO EN VIVO AHORA", predictMatch: "Predecir Este Partido",
    predictFinal: "Predecir el Ganador de la Final", completed: "Partido finalizado",
    noMatches: "No se encontraron partidos para este filtro",
    searchPlaceholder: "Buscar equipo, ciudad...",
    worldCupFinal: "🏆 FINAL DEL MUNDIAL 🏆", group: "Grupo",
    liveTag: "🔴 EN VIVO", todayTag: "HOY",
  },
  de: {
    all: "Alle", groupStage: "Gruppenphase", roundOf32: "Achtelfinale",
    quarterFinals: "Viertelfinale", semiFinals: "Halbfinale",
    thirdPlace: "Platz 3", final: "Finale",
    today: "Heute", tomorrow: "Morgen", thisWeek: "Diese Woche",
    nextMatchIn: "NÄCHSTES SPIEL IN", days: "TAGE", hrs: "STD", min: "MIN", sec: "SEK",
    liveNow: "🔴 SPIEL JETZT LIVE", predictMatch: "Dieses Spiel tippen",
    predictFinal: "Finalsieger tippen", completed: "Spiel beendet",
    noMatches: "Keine Spiele für diesen Filter gefunden",
    searchPlaceholder: "Team, Stadt suchen...",
    worldCupFinal: "🏆 WM FINALE 🏆", group: "Gruppe",
    liveTag: "🔴 LIVE", todayTag: "HEUTE",
  },
  tr: {
    all: "Tümü", groupStage: "Grup Aşaması", roundOf32: "Son 32",
    quarterFinals: "Çeyrek Final", semiFinals: "Yarı Final",
    thirdPlace: "3.'lük Maçı", final: "Final",
    today: "Bugün", tomorrow: "Yarın", thisWeek: "Bu Hafta",
    nextMatchIn: "SONRAKİ MAÇ", days: "GÜN", hrs: "SAAT", min: "DAK", sec: "SAN",
    liveNow: "🔴 MAÇ ŞU AN CANLI", predictMatch: "Bu Maçı Tahmin Et",
    predictFinal: "Final Kazananını Tahmin Et", completed: "Maç tamamlandı",
    noMatches: "Bu filtre için maç bulunamadı",
    searchPlaceholder: "Takım, şehir ara...",
    worldCupFinal: "🏆 DÜNYA KUPASI FİNALİ 🏆", group: "Grup",
    liveTag: "🔴 CANLI", todayTag: "BUGÜN",
  },
};

const getStatus = (m: ScheduleMatch): "live" | "today" | "upcoming" | "completed" => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const start = new Date(m.date + "T" + m.time + ":00");
  const end = new Date(start.getTime() + 2 * 3600_000);
  if (m.status === "completed" || (m.date < todayStr && now > end)) return "completed";
  if (now >= start && now <= end) return "live";
  if (m.date === todayStr) return "today";
  return "upcoming";
};

const formatDate = (dateStr: string, language: Language) => {
  const localeMap: Record<Language, string> = {
    en: "en-US", ar: "ar-SA", fr: "fr-FR", pt: "pt-BR", es: "es-ES", de: "de-DE", tr: "tr-TR",
  };
  return new Date(dateStr + "T12:00:00").toLocaleDateString(localeMap[language], {
    weekday: "long", month: "long", day: "numeric",
  });
};

export default function SchedulePage({ onPredict, language }: Props) {
  const t = SCHEDULE_TEXT[language];
  const isRTL = language === "ar";

  const STAGES = [t.all, t.groupStage, t.roundOf32, t.quarterFinals, t.semiFinals, t.thirdPlace, t.final];
  const STAGE_VALUES = ["All", "Group Stage", "Round of 32", "Quarter Finals", "Semi Finals", "Third Place", "Final"];
  const DATE_FILTERS = [t.all, t.today, t.tomorrow, t.thisWeek];
  const DATE_VALUES = ["All", "Today", "Tomorrow", "This Week"];

  const [nextMatch, setNextMatch] = useState<ScheduleMatch | undefined>(getNextMatch);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; live?: boolean } | null>(null);
  const [stageFilter, setStageFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!nextMatch) return;
    const tick = () => {
      const start = new Date(nextMatch.date + "T" + nextMatch.time + ":00");
      const diff = start.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, live: true });
        setNextMatch(getNextMatch());
      } else {
        setCountdown({
          days: Math.floor(diff / 86_400_000),
          hours: Math.floor((diff % 86_400_000) / 3_600_000),
          minutes: Math.floor((diff % 3_600_000) / 60_000),
          seconds: Math.floor((diff % 60_000) / 1_000),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextMatch?.id]);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86_400_000).toISOString().split("T")[0];

  const filtered = schedule.filter((m) => {
    if (stageFilter !== "All" && m.stage !== stageFilter) return false;
    if (dateFilter === "Today" && m.date !== todayStr) return false;
    if (dateFilter === "Tomorrow" && m.date !== tomorrowStr) return false;
    if (dateFilter === "This Week" && (m.date < todayStr || m.date > nextWeekStr)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !m.team1.toLowerCase().includes(q) &&
        !m.team2.toLowerCase().includes(q) &&
        !m.city.toLowerCase().includes(q) &&
        !m.venue.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const dates = [...new Set(filtered.map((m) => m.date))];

  const filterPill = (active: boolean): React.CSSProperties => ({
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    border: active ? "1.5px solid #22c55e" : "1.5px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
    color: active ? "#22c55e" : "rgba(255,255,255,0.55)",
    fontSize: "13px",
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.15s",
  });

  return (
    <div style={{ background: "#0a0a1a", minHeight: "60vh", paddingBottom: "60px", direction: isRTL ? "rtl" : "ltr" }}>

      {/* ── COUNTDOWN ── */}
      {nextMatch && countdown && (
        <div style={{
          background: "linear-gradient(135deg, #071330 0%, #0d1e4a 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.20)",
          padding: "24px 16px",
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: "16px",
              padding: "20px 24px",
            }}>
              {countdown.live ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700,
                    color: "#e94560", letterSpacing: "2px",
                    animation: "pulse 1s infinite",
                  }}>{t.liveNow}</div>
                  <div style={{ marginTop: "6px", fontSize: "14px", color: "rgba(255,255,255,0.60)" }}>
                    {nextMatch.team1Flag} {nextMatch.team1} vs {nextMatch.team2Flag} {nextMatch.team2}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{
                    fontSize: "11px", color: "rgba(212,175,55,0.70)", letterSpacing: "3px",
                    fontWeight: 700, textTransform: "uppercase", marginBottom: "10px",
                    fontFamily: "'Oswald', sans-serif",
                  }}>⏱ {t.nextMatchIn}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" as const }}>
                    {countdown.days > 0 && (
                      <>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "42px", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>{pad(countdown.days)}</div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.40)", letterSpacing: "2px" }}>{t.days}</div>
                        </div>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "32px", color: "rgba(212,175,55,0.40)", lineHeight: 1, paddingBottom: "14px" }}>:</div>
                      </>
                    )}
                    {[
                      { val: countdown.hours, label: t.hrs },
                      { val: countdown.minutes, label: t.min },
                      { val: countdown.seconds, label: t.sec },
                    ].map((item, i) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {i > 0 && <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "32px", color: "rgba(212,175,55,0.40)", lineHeight: 1, paddingBottom: "14px" }}>:</div>}
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "42px", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>{pad(item.val)}</div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.40)", letterSpacing: "2px" }}>{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "10px" }}>
                    <div>
                      <div style={{ fontSize: "15px", color: "#ffffff", fontWeight: 600, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}>
                        {nextMatch.team1Flag} {nextMatch.team1} <span style={{ color: "rgba(255,255,255,0.35)" }}>vs</span> {nextMatch.team2Flag} {nextMatch.team2}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "3px" }}>
                        {nextMatch.group ? `${t.group} ${nextMatch.group} · ` : ""}{nextMatch.city} · {nextMatch.timeET}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPredict(nextMatch)}
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #f5e17a)",
                        border: "none", borderRadius: "10px",
                        padding: "10px 18px",
                        color: "#0a0a1a", fontFamily: "'Oswald', sans-serif",
                        fontSize: "13px", fontWeight: 800, letterSpacing: "1px",
                        cursor: "pointer", whiteSpace: "nowrap" as const,
                      }}
                    >{t.predictMatch} →</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FILTERS ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* Stage filter */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
            {STAGES.map((label, i) => (
              <button key={STAGE_VALUES[i]} type="button"
                onClick={() => setStageFilter(STAGE_VALUES[i])}
                style={filterPill(stageFilter === STAGE_VALUES[i])}
              >{label}</button>
            ))}
          </div>

          {/* Date filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {DATE_FILTERS.map((label, i) => (
              <button key={DATE_VALUES[i]} type="button"
                onClick={() => setDateFilter(DATE_VALUES[i])}
                style={filterPill(dateFilter === DATE_VALUES[i])}
              >{label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: isRTL ? "auto" : "14px", right: isRTL ? "14px" : "auto", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                width: "100%", boxSizing: "border-box" as const,
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(255,255,255,0.10)",
                borderRadius: "10px",
                padding: isRTL ? "10px 40px 10px 14px" : "10px 14px 10px 40px",
                color: "#fff", fontSize: "14px",
                fontFamily: "'Poppins', sans-serif", outline: "none",
                direction: isRTL ? "rtl" : "ltr",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── MATCH LIST ── */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px 0" }}>
        {dates.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "60px 0", fontFamily: "'Poppins', sans-serif" }}>
            {t.noMatches}
          </div>
        ) : (
          dates.map((date) => {
            const dayMatches = filtered.filter((m) => m.date === date);
            return (
              <div key={date} style={{ marginBottom: "28px" }}>
                <div style={{
                  fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.55)",
                  letterSpacing: "1px", textTransform: "uppercase" as const,
                  fontFamily: "'Oswald', sans-serif",
                  marginBottom: "10px",
                  borderLeft: isRTL ? "none" : "3px solid #22c55e",
                  borderRight: isRTL ? "3px solid #22c55e" : "none",
                  paddingLeft: isRTL ? 0 : "10px",
                  paddingRight: isRTL ? "10px" : 0,
                }}>📅 {formatDate(date, language)}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {dayMatches.map((m) => {
                    const status = getStatus(m);
                    const isCompleted = status === "completed";
                    const isLive = status === "live";
                    const isToday = status === "today";
                    const isFinal = !!m.isFinal;

                    const borderLeft = !isRTL ? (isLive ? "4px solid #e94560" : isToday ? "4px solid #FFD700" : isFinal ? "4px solid #d4af37" : "4px solid transparent") : "4px solid transparent";
                    const borderRight = isRTL ? (isLive ? "4px solid #e94560" : isToday ? "4px solid #FFD700" : isFinal ? "4px solid #d4af37" : "4px solid transparent") : "4px solid transparent";

                    const cardBg = isFinal
                      ? "linear-gradient(135deg, #1a1200, #2a1e00)"
                      : isCompleted
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.04)";

                    return (
                      <div
                        key={m.id}
                        style={{
                          background: cardBg,
                          border: `1px solid ${isFinal ? "rgba(212,175,55,0.30)" : isLive ? "rgba(233,69,96,0.30)" : "rgba(255,255,255,0.08)"}`,
                          borderLeft,
                          borderRight,
                          borderRadius: "14px",
                          padding: "16px 18px",
                          opacity: isCompleted ? 0.55 : 1,
                        }}
                      >
                        {/* Top row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <div style={{
                            fontSize: "11px", fontWeight: 700, color: isFinal ? "#d4af37" : "rgba(255,255,255,0.40)",
                            letterSpacing: "1.5px", textTransform: "uppercase" as const,
                            fontFamily: "'Oswald', sans-serif",
                          }}>
                            {isFinal ? t.worldCupFinal : m.group ? `${t.group} ${m.group}` : (() => {
                              const idx = STAGE_VALUES.indexOf(m.stage);
                              return idx >= 0 ? STAGES[idx] : m.stage;
                            })()}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {isLive && (
                              <span style={{
                                fontSize: "11px", fontWeight: 700, color: "#e94560",
                                background: "rgba(233,69,96,0.15)",
                                border: "1px solid rgba(233,69,96,0.30)",
                                borderRadius: "6px", padding: "2px 8px",
                                fontFamily: "'Oswald', sans-serif", letterSpacing: "1px",
                                animation: "pulse 1s infinite",
                              }}>{t.liveTag}</span>
                            )}
                            {isToday && !isLive && (
                              <span style={{
                                fontSize: "11px", fontWeight: 700, color: "#FFD700",
                                background: "rgba(255,215,0,0.10)",
                                border: "1px solid rgba(255,215,0,0.25)",
                                borderRadius: "6px", padding: "2px 8px",
                                fontFamily: "'Oswald', sans-serif", letterSpacing: "1px",
                              }}>{t.todayTag}</span>
                            )}
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "'Poppins', sans-serif" }}>
                              {m.timeET}
                            </span>
                          </div>
                        </div>

                        {/* Teams row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "26px", lineHeight: 1, marginBottom: "4px" }}>{m.team1Flag}</div>
                            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700, color: isFinal ? "#d4af37" : "#ffffff", letterSpacing: "1px" }}>{m.team1}</div>
                          </div>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 900, color: "rgba(255,255,255,0.25)", padding: "0 16px", letterSpacing: "2px" }}>VS</div>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "26px", lineHeight: 1, marginBottom: "4px" }}>{m.team2Flag}</div>
                            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700, color: isFinal ? "#d4af37" : "#ffffff", letterSpacing: "1px" }}>{m.team2}</div>
                          </div>
                        </div>

                        {/* Venue */}
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'Poppins', sans-serif", marginBottom: "12px", textAlign: "center" }}>
                          📍 {m.venue}, {m.city}
                        </div>

                        {/* Predict button */}
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => onPredict(m)}
                            style={{
                              width: "100%", padding: "10px",
                              background: isFinal ? "linear-gradient(135deg, #d4af37, #f5e17a)" : "rgba(34,197,94,0.12)",
                              border: isFinal ? "none" : "1px solid rgba(34,197,94,0.30)",
                              borderRadius: "10px",
                              color: isFinal ? "#0a0a1a" : "#22c55e",
                              fontFamily: "'Oswald', sans-serif",
                              fontSize: "14px", fontWeight: 700,
                              letterSpacing: "1px", cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                            onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
                          >
                            🎯 {isFinal ? t.predictFinal : t.predictMatch}
                          </button>
                        )}
                        {isCompleted && (
                          <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.25)", fontFamily: "'Poppins', sans-serif" }}>
                            {t.completed}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
