import { useEffect, useState } from "react";

export interface LiveMatch {
  id: string;
  date: string;
  team1: string; team2: string;
  team1Abbr: string; team2Abbr: string;
  score1: number | null; score2: number | null;
  status: "scheduled" | "live" | "finished";
  minute?: string;
  group?: string;
  venue?: string;
  city?: string;
}

export interface StandingEntry {
  pos: number;
  team: string; teamAbbr: string;
  gp: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}
export interface GroupStanding { group: string; entries: StandingEntry[] }

// Client-side cache (survives re-renders, cleared on page refresh)
let liveCache: { data: LiveMatch[]; ts: number } | null = null;
let standingsCache: { data: GroupStanding[]; ts: number } | null = null;
const CACHE_MS = 60_000;

const API = "";   // empty → relative path, handled by vite proxy in dev

export function useLiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (liveCache && Date.now() - liveCache.ts < CACHE_MS) {
        if (!cancelled) { setMatches(liveCache.data); setLoading(false); }
        return;
      }
      try {
        const res = await fetch(`${API}/api/wc/live`, { signal: AbortSignal.timeout(6_000) });
        if (!res.ok) throw new Error("not ok");
        const json = await res.json();
        const data: LiveMatch[] = json.matches ?? [];
        liveCache = { data, ts: Date.now() };
        if (!cancelled) { setMatches(data); setLoading(false); }
      } catch {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return { matches, loading, error };
}

export function useStandings() {
  const [groups, setGroups] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (standingsCache && Date.now() - standingsCache.ts < CACHE_MS) {
        if (!cancelled) { setGroups(standingsCache.data); setLoading(false); }
        return;
      }
      try {
        const res = await fetch(`${API}/api/wc/standings`, { signal: AbortSignal.timeout(6_000) });
        if (!res.ok) throw new Error("not ok");
        const json = await res.json();
        const data: GroupStanding[] = json.groups ?? [];
        standingsCache = { data, ts: Date.now() };
        if (!cancelled) { setGroups(data); setLoading(false); }
      } catch {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return { groups, loading, error };
}

// Find a live match by team names (case-insensitive, order-insensitive)
export function findLiveScore(matches: LiveMatch[], team1: string, team2: string): LiveMatch | undefined {
  const n = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");
  const a = n(team1); const b = n(team2);
  return matches.find(
    (m) => (n(m.team1) === a && n(m.team2) === b) || (n(m.team1) === b && n(m.team2) === a)
  );
}

// Get flag emoji for a team abbreviation (basic lookup)
const ABBR_FLAG: Record<string, string> = {
  ARG:"🇦🇷", BRA:"🇧🇷", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", FRA:"🇫🇷", GER:"🇩🇪", ESP:"🇪🇸",
  POR:"🇵🇹", NED:"🇳🇱", BEL:"🇧🇪", URU:"🇺🇾", MEX:"🇲🇽", USA:"🇺🇸",
  JPN:"🇯🇵", KOR:"🇰🇷", AUS:"🇦🇺", SEN:"🇸🇳", MOR:"🇲🇦", TUN:"🇹🇳",
  NGA:"🇳🇬", GHA:"🇬🇭", CMR:"🇨🇲", ECU:"🇪🇨", CHI:"🇨🇱", COL:"🇨🇴",
  CAN:"🇨🇦", TUR:"🇹🇷", UKR:"🇺🇦", SRB:"🇷🇸", POL:"🇵🇱", SWI:"🇨🇭",
  CZE:"🇨🇿", SVN:"🇸🇮", SVK:"🇸🇰", DEN:"🇩🇰", NOR:"🇳🇴", SWE:"🇸🇪",
  SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", IRL:"🇮🇪", GRE:"🇬🇷", AUT:"🇦🇹", HUN:"🇭🇺", CRO:"🇭🇷",
  IRQ:"🇮🇶", IRN:"🇮🇷", KSA:"🇸🇦", QAT:"🇶🇦", UAE:"🇦🇪", JOR:"🇯🇴",
  UZB:"🇺🇿", IDN:"🇮🇩", THA:"🇹🇭", NZL:"🇳🇿", RSA:"🇿🇦", CMV:"🇨🇻",
  CPV:"🇨🇻", PAN:"🇵🇦", HND:"🇭🇳", PRY:"🇵🇾", BOL:"🇧🇴", PER:"🇵🇪",
  ALG:"🇩🇿", CIV:"🇨🇮", DRC:"🇨🇩", CMG:"🇨🇬", HAI:"🇭🇹",
};
export function getAbbrFlag(abbr: string): string {
  return ABBR_FLAG[abbr.toUpperCase()] ?? "🏳";
}
