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
}

export interface StandingEntry {
  pos: number;
  team: string; teamAbbr: string;
  gp: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}
export interface GroupStanding { group: string; entries: StandingEntry[] }

// ─── ESPN direct browser calls (CORS: access-control-allow-origin: *) ─────────
const ESPN_SITE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const ESPN_V2   = "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world";

// ESPN uses different spellings from our schedule — map to schedule names
const ESPN_NAME_MAP: Record<string, string> = {
  "Bosnia-Herzegovina":    "Bosnia & Herzegovina",
  "Türkiye":               "Turkey",
  "Curaçao":               "Curacao",
  "Congo DR":              "DR Congo",
};
function canonicalName(espnName: string): string {
  return ESPN_NAME_MAP[espnName] ?? espnName;
}

function yyyymmdd(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function parseMatches(raw: unknown): LiveMatch[] {
  const events: unknown[] = (raw as Record<string, unknown>)?.events as unknown[] ?? [];
  const out: LiveMatch[] = [];
  for (const ev of events) {
    try {
      const e = ev as Record<string, unknown>;
      const comp = ((e.competitions as unknown[])?.[0] ?? {}) as Record<string, unknown>;
      const statusType = ((comp.status as Record<string, unknown>)?.type ?? {}) as Record<string, unknown>;
      const statusName = (statusType.name as string) ?? "";

      let status: LiveMatch["status"] = "scheduled";
      if (statusType.completed || statusName === "STATUS_FINAL") status = "finished";
      else if (statusName === "STATUS_IN_PROGRESS" || statusName === "STATUS_HALFTIME") status = "live";

      const competitors = (comp.competitors as unknown[]) ?? [];
      const home = (competitors.find((c) => (c as Record<string, unknown>).homeAway === "home") ?? competitors[0]) as Record<string, unknown>;
      const away = (competitors.find((c) => (c as Record<string, unknown>).homeAway === "away") ?? competitors[1]) as Record<string, unknown>;
      if (!home || !away) continue;

      const homeTeam = (home.team ?? {}) as Record<string, unknown>;
      const awayTeam = (away.team ?? {}) as Record<string, unknown>;

      const notes = (comp.notes as unknown[]) ?? [];
      const noteHeadline = ((notes[0] as Record<string, unknown>)?.headline as string) ?? "";
      const groupMatch = noteHeadline.match(/Group ([A-L])/i);

      out.push({
        id:         (e.id as string) ?? String(Math.random()),
        date:       ((e.date as string) ?? "").split("T")[0],
        team1:      canonicalName((homeTeam.displayName as string) ?? ""),
        team2:      canonicalName((awayTeam.displayName as string) ?? ""),
        team1Abbr:  (homeTeam.abbreviation as string) ?? "",
        team2Abbr:  (awayTeam.abbreviation as string) ?? "",
        score1:     status !== "scheduled" ? (parseInt((home.score as string) ?? "0") || 0) : null,
        score2:     status !== "scheduled" ? (parseInt((away.score as string) ?? "0") || 0) : null,
        status,
        minute:     status === "live" ? ((comp.status as Record<string, unknown>)?.displayClock as string) ?? undefined : undefined,
        group:      groupMatch ? groupMatch[1].toUpperCase() : undefined,
      });
    } catch { /* skip malformed events */ }
  }
  return out;
}

function parseStandings(raw: unknown): GroupStanding[] {
  const children = ((raw as Record<string, unknown>)?.children as unknown[]) ?? [];
  const out: GroupStanding[] = [];
  for (const grp of children) {
    try {
      const g = grp as Record<string, unknown>;
      const rawName = (g.abbreviation as string) ?? (g.name as string) ?? "?";
      const groupName = rawName.replace(/^Group\s+/i, "").trim();
      const entries = (((g.standings as Record<string, unknown>)?.entries) as unknown[]) ?? [];
      const parsed: StandingEntry[] = entries.map((e, i) => {
        const entry = e as Record<string, unknown>;
        const stats = (entry.stats as unknown[]) ?? [];
        const stat = (name: string): number =>
          ((stats.find((s) => (s as Record<string, unknown>).name === name) as Record<string, unknown>)?.value as number) ?? 0;
        const team = (entry.team ?? {}) as Record<string, unknown>;
        return {
          pos:      i + 1,
          team:     (team.displayName as string) ?? "",
          teamAbbr: (team.abbreviation as string) ?? "",
          gp:  stat("gamesPlayed"),
          w:   stat("wins"),
          d:   stat("ties"),
          l:   stat("losses"),
          gf:  stat("pointsFor"),
          ga:  stat("pointsAgainst"),
          gd:  stat("pointDifferential"),
          pts: stat("points"),
        };
      });
      if (parsed.length > 0) out.push({ group: groupName, entries: parsed });
    } catch { /* skip */ }
  }
  return out.sort((a, b) => a.group.localeCompare(b.group));
}

// ─── Browser-side cache ───────────────────────────────────────────────────────
let liveCache:      { data: LiveMatch[];    ts: number } | null = null;
let standingsCache: { data: GroupStanding[]; ts: number } | null = null;
const LIVE_TTL      = 60_000;       // 1 minute
const STANDINGS_TTL = 5 * 60_000;   // 5 minutes

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useLiveMatches() {
  const [matches, setMatches]   = useState<LiveMatch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (liveCache && Date.now() - liveCache.ts < LIVE_TTL) {
        if (!cancelled) { setMatches(liveCache.data); setLoading(false); }
        return;
      }
      try {
        // Fetch 3 days back through 2 days ahead in parallel
        const days = [-3, -2, -1, 0, 1, 2];
        const results = await Promise.allSettled(
          days.map((d) =>
            fetch(`${ESPN_SITE}/scoreboard?dates=${yyyymmdd(d)}&limit=20`, {
              signal: AbortSignal.timeout(8_000),
            }).then((r) => r.json()),
          ),
        );
        const all: LiveMatch[] = [];
        const seen = new Set<string>();
        for (const r of results) {
          if (r.status === "fulfilled") {
            for (const m of parseMatches(r.value)) {
              if (!seen.has(m.id)) { seen.add(m.id); all.push(m); }
            }
          }
        }
        liveCache = { data: all, ts: Date.now() };
        if (!cancelled) { setMatches(all); setLoading(false); }
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
  const [groups, setGroups]   = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (standingsCache && Date.now() - standingsCache.ts < STANDINGS_TTL) {
        if (!cancelled) { setGroups(standingsCache.data); setLoading(false); }
        return;
      }
      try {
        const res  = await fetch(`${ESPN_V2}/standings`, { signal: AbortSignal.timeout(8_000) });
        if (!res.ok) throw new Error("not ok");
        const data = parseStandings(await res.json());
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
    (m) => (n(m.team1) === a && n(m.team2) === b) || (n(m.team1) === b && n(m.team2) === a),
  );
}
