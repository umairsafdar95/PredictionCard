import { useState, useEffect } from "react";
import schedule, { ScheduleMatch, getNextMatch } from "@/data/schedule";
import { Language } from "@/types";
import { useLiveMatches, useStandings, findLiveScore, GroupStanding, StandingEntry } from "@/lib/liveData";
import { fetchEspnKnockoutMatches, type EspnKnockoutMatch } from "@/services/espn";

interface Props {
  onPredict: (match: ScheduleMatch) => void;
  language: Language;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ── Merge ESPN live data over local schedule ── */
function mergeKnockoutData(
  local: ScheduleMatch[],
  espn: EspnKnockoutMatch[]
): ScheduleMatch[] {
  if (espn.length === 0) return local;
  const used = new Set<number>();
  const result: ScheduleMatch[] = [];

  for (const m of local) {
    if (m.group !== null) { result.push(m); continue; }

    let idx = espn.findIndex((e, i) =>
      !used.has(i) && e.stage === m.stage && e.date === m.date && e.time === m.time
    );
    if (idx === -1) idx = espn.findIndex((e, i) =>
      !used.has(i) && e.stage === m.stage && e.date === m.date && e.venue === m.venue
    );
    if (idx === -1) idx = espn.findIndex((e, i) =>
      !used.has(i) && e.stage === m.stage && e.date === m.date
    );

    if (idx !== -1) {
      used.add(idx);
      const e = espn[idx];
      result.push({
        ...m,
        team1: e.team1, team2: e.team2,
        team1Flag: e.team1Flag, team2Flag: e.team2Flag,
        status: e.status,
        ...(e.isFinal ? { isFinal: true } : {}),
      });
    } else {
      result.push(m);
    }
  }

  // Add any ESPN matches not in local schedule
  for (let i = 0; i < espn.length; i++) {
    if (used.has(i)) continue;
    const e = espn[i];
    result.push({
      id: `espn-${e.date}-${e.time}`,
      date: e.date, time: e.time, timeET: e.timeET,
      group: null,
      team1: e.team1, team2: e.team2,
      team1Flag: e.team1Flag, team2Flag: e.team2Flag,
      venue: e.venue, city: e.city,
      stage: e.stage, status: e.status,
      isFinal: e.isFinal,
    });
  }

  return result;
}

const SCHEDULE_TEXT: Record<Language, {
  all: string; groupStage: string; roundOf32: string; roundOf16: string;
  quarterFinals: string; semiFinals: string; thirdPlace: string; final: string;
  today: string; tomorrow: string; thisWeek: string;
  nextMatchIn: string; days: string; hrs: string; min: string; sec: string;
  liveNow: string; predictMatch: string; predictFinal: string;
  completed: string; noMatches: string; searchPlaceholder: string;
  worldCupFinal: string; group: string; liveTag: string; todayTag: string;
  liveData: string; awaitingFixtures: string;
}> = {
  en: {
    all: "All", groupStage: "Group Stage", roundOf32: "Round of 32", roundOf16: "Round of 16",
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
    liveData: "🟢 Live data from ESPN", awaitingFixtures: "⏳ Awaiting knockout fixtures",
  },
  ar: {
    all: "الكل", groupStage: "دور المجموعات", roundOf32: "دور الـ32", roundOf16: "دور الـ16",
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
    liveData: "🟢 بيانات مباشرة من ESPN", awaitingFixtures: "⏳ بانتظار مباريات الإقصائي",
  },
  fr: {
    all: "Tout", groupStage: "Phase de groupes", roundOf32: "Huitièmes de finale", roundOf16: "Seizièmes de finale",
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
    liveData: "🟢 Données en direct ESPN", awaitingFixtures: "⏳ En attente des matchs éliminatoires",
  },
  pt: {
    all: "Todos", groupStage: "Fase de Grupos", roundOf32: "Oitavas de Final", roundOf16: "Décimas de Final",
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
    liveData: "🟢 Dados ao vivo da ESPN", awaitingFixtures: "⏳ Aguardando jogos eliminatórios",
  },
  es: {
    all: "Todos", groupStage: "Fase de Grupos", roundOf32: "Octavos de Final", roundOf16: "Dieciseisavos de Final",
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
    liveData: "🟢 Datos en vivo de ESPN", awaitingFixtures: "⏳ Esperando partidos eliminatorios",
  },
  de: {
    all: "Alle", groupStage: "Gruppenphase", roundOf32: "Achtelfinale", roundOf16: "Sechzehntelfinale",
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
    liveData: "🟢 Live-Daten von ESPN", awaitingFixtures: "⏳ Warte auf KO-Spiele",
  },
  tr: {
    all: "Tümü", groupStage: "Grup Aşaması", roundOf32: "Son 32", roundOf16: "Son 16",
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
    liveData: "🟢 ESPN canlı veri", awaitingFixtures: "⏳ Eleme maçları bekleniyor",
  },
};

const getStatus = (m: ScheduleMatch): "live" | "today" | "upcoming" | "completed" => {
  if (m.status === "completed") return "completed";
  if (m.status === "live") return "live";
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const start = new Date(m.date + "T" + m.time + ":00");
  const end = new Date(start.getTime() + 2 * 3600_000);
  if (now >= start && now <= end) return "live";
  if (m.date === todayStr) return "today";
  if (m.date < todayStr && now > end) return "completed";
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

const numCell: React.CSSProperties = {
  fontSize: "12px", color: "rgba(255,255,255,0.55)",
  fontFamily: "'Oswald', sans-serif", textAlign: "center",
};

function StandingsView({ groups, loading, error, language }: { groups: GroupStanding[]; loading: boolean; error: boolean; language: Language }) {
  const t = SCHEDULE_TEXT[language];
  const isRTL = language === "ar";
  if (loading) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "60px 0", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>📊</div>Loading standings…
    </div>
  );
  if (error || groups.length === 0) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.30)", padding: "60px 0", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>📊</div>
      <div>Standings will appear once group matches begin.</div>
    </div>
  );
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px", direction: isRTL ? "rtl" : "ltr" }}>
      {groups.map((grp) => (
        <div key={grp.group} style={{ marginBottom: "28px" }}>
          <div style={{
            fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.55)",
            letterSpacing: "1px", textTransform: "uppercase" as const,
            fontFamily: "'Oswald', sans-serif", marginBottom: "8px",
            borderLeft: isRTL ? "none" : "3px solid #22c55e",
            borderRight: isRTL ? "3px solid #22c55e" : "none",
            paddingLeft: isRTL ? 0 : "10px", paddingRight: isRTL ? "10px" : 0,
          }}>{t.group} {grp.group}</div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 30px 28px 28px 28px 32px 32px 36px 44px", gap: 0, padding: "7px 12px", background: "rgba(255,255,255,0.04)", fontSize: "9px", color: "rgba(255,255,255,0.30)", fontFamily: "'Oswald', sans-serif", letterSpacing: "1.5px" }}>
              {["#","TEAM","GP","W","D","L","GF","GA","GD","PTS"].map((h,i) => (
                <span key={h} style={{ textAlign: i >= 2 ? "center" : "left" as const }}>{h}</span>
              ))}
            </div>
            {grp.entries.map((e: StandingEntry, i: number) => {
              const advances = i < 2;
              return (
                <div key={e.team} style={{ display: "grid", gridTemplateColumns: "24px 1fr 30px 28px 28px 28px 32px 32px 36px 44px", gap: 0, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", background: advances ? "rgba(34,197,94,0.04)" : "transparent", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: advances ? "#22c55e" : "rgba(255,255,255,0.35)", fontFamily: "'Oswald', sans-serif" }}>{e.pos}</span>
                  <div style={{ overflow: "hidden" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", fontFamily: "'Oswald', sans-serif" }}>{e.teamAbbr}</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "'Poppins', sans-serif", marginLeft: "5px" }}>{e.team.length > 14 ? e.team.slice(0, 12) + "…" : e.team}</span>
                  </div>
                  <span style={numCell}>{e.gp}</span>
                  <span style={numCell}>{e.w}</span>
                  <span style={numCell}>{e.d}</span>
                  <span style={numCell}>{e.l}</span>
                  <span style={numCell}>{e.gf}</span>
                  <span style={numCell}>{e.ga}</span>
                  <span style={{ ...numCell, color: e.gd > 0 ? "#22c55e" : e.gd < 0 ? "#e94560" : "rgba(255,255,255,0.4)" }}>{e.gd > 0 ? "+" : ""}{e.gd}</span>
                  <span style={{ ...numCell, textAlign: "right", fontWeight: 900, color: "#fff", fontSize: "15px" }}>{e.pts}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(34,197,94,0.45)", marginTop: "5px", paddingLeft: isRTL ? 0 : "4px", paddingRight: isRTL ? "4px" : 0 }}>⬆ Top 2 advance to Round of 32</div>
        </div>
      ))}
    </div>
  );
}

export default function SchedulePage({ onPredict, language }: Props) {
  const t = SCHEDULE_TEXT[language];
  const isRTL = language === "ar";

  const STAGES = [t.all, t.groupStage, t.roundOf32, t.roundOf16, t.quarterFinals, t.semiFinals, t.thirdPlace, t.final];
  const STAGE_VALUES = ["All", "Group Stage", "Round of 32", "Round of 16", "Quarter Finals", "Semi Finals", "Third Place", "Final"];
  const DATE_FILTERS = [t.all, t.today, t.tomorrow, t.thisWeek];
  const DATE_VALUES = ["All", "Today", "Tomorrow", "This Week"];

  const [nextMatch, setNextMatch] = useState<ScheduleMatch | undefined>(getNextMatch);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; live?: boolean } | null>(null);
  const [stageFilter, setStageFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"schedule" | "standings">("schedule");

  /* ── ESPN knockout data ── */
  const [matchList, setMatchList] = useState<ScheduleMatch[]>(schedule);
  const [espnLoaded, setEspnLoaded] = useState(false);

  const { matches: liveMatches } = useLiveMatches();
  const { groups: standingGroups, loading: standingsLoading, error: standingsError } = useStandings();

  /* ── Fetch ESPN data on mount + every 5 min ── */
  useEffect(() => {
    let cancelled = false;

    const loadEspn = async () => {
      try {
        const espnMatches = await fetchEspnKnockoutMatches();
        if (cancelled) return;
        if (espnMatches.length > 0) {
          const merged = mergeKnockoutData(schedule, espnMatches);
          setMatchList(merged);
          const now = new Date();
          const next = merged
            .filter((m) => m.status !== "completed" && new Date(m.date + "T" + m.time + ":00") > now)
            .sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime())[0];
          if (next) setNextMatch(next);
        }
        setEspnLoaded(true);
      } catch {
        if (!cancelled) setEspnLoaded(true);
      }
    };

    loadEspn();
    const interval = setInterval(loadEspn, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  /* ── Countdown ── */
  useEffect(() => {
    if (!nextMatch) return;
    const tick = () => {
      const start = new Date(nextMatch.date + "T" + nextMatch.time + ":00");
      const diff = start.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, live: true });
        const now = new Date();
        const next = matchList
          .filter((m) => m.status !== "completed" && new Date(m.date + "T" + m.time + ":00") > now)
          .sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime())[0];
        setNextMatch(next);
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
  }, [nextMatch?.id, matchList.length]);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86_400_000).toISOString().split("T")[0];

  const filtered = matchList.filter((m) => {
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

  const hasLiveKnockout = matchList.some(
    (m) => m.group === null && !m.team1.includes("TBD") && !m.team1.includes("Runner") && !m.team1.includes("Winner")
  );

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

          <div style={{ display: "flex", gap: "6px" }}>
            <button type="button" onClick={() => setViewMode("schedule")} style={filterPill(viewMode === "schedule")}>📅 Schedule</button>
            <button type="button" onClick={() => setViewMode("standings")} style={filterPill(viewMode === "standings")}>📊 Standings</button>
          </div>

          {viewMode === "schedule" && (
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
            {STAGES.map((label, i) => (
              <button key={STAGE_VALUES[i]} type="button"
                onClick={() => setStageFilter(STAGE_VALUES[i])}
                style={filterPill(stageFilter === STAGE_VALUES[i])}
              >{label}</button>
            ))}
          </div>
          )}

          {viewMode === "schedule" && (
          <div style={{ display: "flex", gap: "6px" }}>
            {DATE_FILTERS.map((label, i) => (
              <button key={DATE_VALUES[i]} type="button"
                onClick={() => setDateFilter(DATE_VALUES[i])}
                style={filterPill(dateFilter === DATE_VALUES[i])}
              >{label}</button>
            ))}
          </div>
          )}

          {viewMode === "schedule" && (
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
          )}

          {espnLoaded && (
            <div style={{ fontSize: "10px", color: "rgba(34,197,94,0.5)", fontFamily: "'Poppins', sans-serif", textAlign: "center", marginTop: "2px" }}>
              {hasLiveKnockout ? t.liveData : t.awaitingFixtures}
            </div>
          )}
        </div>
      </div>

      {/* ── STANDINGS VIEW ── */}
      {viewMode === "standings" && (
        <StandingsView groups={standingGroups} loading={standingsLoading} error={standingsError} language={language} />
      )}

      {/* ── MATCH LIST ── */}
      {viewMode === "schedule" && (
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
                    const ls = findLiveScore(liveMatches, m.team1, m.team2);
                    const isCompleted = status === "completed" || ls?.status === "finished";
                    const isLive = status === "live" || ls?.status === "live";
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
                        {(() => {
                          const hasScore = ls && ls.score1 !== null && ls.score2 !== null;
                          return (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                              <div style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ fontSize: "26px", lineHeight: 1, marginBottom: "4px" }}>{m.team1Flag}</div>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700, color: isFinal ? "#d4af37" : "#ffffff", letterSpacing: "1px" }}>{m.team1}</div>
                              </div>
                              {hasScore ? (
                                <div style={{ padding: "0 10px", textAlign: "center", minWidth: "72px" }}>
                                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "24px", fontWeight: 900, color: ls.status === "live" ? "#e94560" : "#ffffff", letterSpacing: "2px", lineHeight: 1 }}>
                                    {ls.score1} – {ls.score2}
                                  </div>
                                  <div style={{ fontSize: "10px", marginTop: "4px", color: ls.status === "live" ? "#e94560" : "rgba(255,255,255,0.35)", fontFamily: "'Oswald', sans-serif", letterSpacing: "1px", fontWeight: 700 }}>
                                    {ls.status === "live" ? (ls.minute ?? "LIVE") : "FT"}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 900, color: "rgba(255,255,255,0.25)", padding: "0 16px", letterSpacing: "2px" }}>VS</div>
                              )}
                              <div style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ fontSize: "26px", lineHeight: 1, marginBottom: "4px" }}>{m.team2Flag}</div>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700, color: isFinal ? "#d4af37" : "#ffffff", letterSpacing: "1px" }}>{m.team2}</div>
                              </div>
                            </div>
                          );
                        })()}

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
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}