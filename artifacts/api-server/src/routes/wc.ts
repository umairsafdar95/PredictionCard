import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

// ─── In-memory cache ──────────────────────────────────────────────────────────
interface CacheEntry<T> { data: T; ts: number }
const cache: Record<string, CacheEntry<unknown>> = {};
const TTL_LIVE      = 60_000;       // 1 minute  (live scores / today's matches)
const TTL_STANDINGS = 5 * 60_000;   // 5 minutes (group tables)

async function getCached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache[key] as CacheEntry<T> | undefined;
  if (hit && now - hit.ts < ttl) return hit.data;
  const data = await fetcher();
  cache[key] = { data, ts: now };
  return data;
}

// ─── ESPN helper ─────────────────────────────────────────────────────────────
const ESPN_SITE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const ESPN_V2   = "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world";

async function espnGet(path: string, base = ESPN_SITE): Promise<unknown> {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`ESPN HTTP ${res.status} for ${path}`);
  return res.json();
}

// ─── Output types ─────────────────────────────────────────────────────────────
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

// ─── Parse ESPN scoreboard ────────────────────────────────────────────────────
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

      const venue = (comp.venue ?? {}) as Record<string, unknown>;
      const addr  = (venue.address ?? {}) as Record<string, unknown>;

      out.push({
        id:        (e.id as string) ?? String(Math.random()),
        date:      ((e.date as string) ?? "").split("T")[0],
        team1:     (homeTeam.displayName as string) ?? "",
        team2:     (awayTeam.displayName as string) ?? "",
        team1Abbr: (homeTeam.abbreviation as string) ?? "",
        team2Abbr: (awayTeam.abbreviation as string) ?? "",
        score1:    status !== "scheduled" ? (parseInt((home.score as string) ?? "0") || 0) : null,
        score2:    status !== "scheduled" ? (parseInt((away.score as string) ?? "0") || 0) : null,
        status,
        minute:    status === "live" ? ((comp.status as Record<string, unknown>)?.displayClock as string) ?? undefined : undefined,
        group:     groupMatch ? groupMatch[1].toUpperCase() : undefined,
        venue:     (venue.fullName as string) ?? undefined,
        city:      (addr.city as string) ?? undefined,
      });
    } catch (err) {
      logger.warn({ err }, "Failed to parse ESPN event");
    }
  }
  return out;
}

// ─── Parse ESPN standings ─────────────────────────────────────────────────────
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
          pos:     i + 1,
          team:    (team.displayName as string) ?? "",
          teamAbbr:(team.abbreviation as string) ?? "",
          gp:  stat("gamesPlayed"),
          w:   stat("wins"),
          d:   stat("ties"),
          l:   stat("losses"),
          gf:  stat("pointsFor")    || stat("goalsFor"),
          ga:  stat("pointsAgainst") || stat("goalsAgainst"),
          gd:  stat("pointDifferential"),
          pts: stat("points"),
        };
      });
      if (parsed.length > 0) out.push({ group: groupName, entries: parsed });
    } catch (err) {
      logger.warn({ err }, "Failed to parse ESPN group");
    }
  }
  return out.sort((a, b) => a.group.localeCompare(b.group));
}

// ─── Date helper ──────────────────────────────────────────────────────────────
function yyyymmdd(offset: number): string {
  const d = new Date(Date.now() + offset * 86_400_000);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/wc/live  — matches for yesterday, today, tomorrow, day-after-tomorrow
router.get("/wc/live", async (_req, res, next) => {
  try {
    const matches = await getCached<LiveMatch[]>("live", TTL_LIVE, async () => {
      const days = [-1, 0, 1, 2];
      const results = await Promise.allSettled(
        days.map((d) => espnGet(`/scoreboard?dates=${yyyymmdd(d)}&limit=20`))
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
      return all;
    });
    res.json({ ok: true, matches });
  } catch (err) {
    next(err);
  }
});

// GET /api/wc/standings  — group standings
router.get("/wc/standings", async (_req, res, next) => {
  try {
    const groups = await getCached<GroupStanding[]>("standings", TTL_STANDINGS, async () => {
      const raw = await espnGet("/standings", ESPN_V2);
      return parseStandings(raw);
    });
    res.json({ ok: true, groups });
  } catch (err) {
    next(err);
  }
});

export default router;
