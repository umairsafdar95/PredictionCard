/* ─────────────────────────────────────────────────────────────────
<<<<<<< HEAD
   espn.ts — fetches FIFA World Cup 2026 knockout matches
   Calls ESPN directly — no CORS proxy needed (ESPN allows all origins)
=======
   espn.ts — fetches all FIFA World Cup 2026 knockout matches
   Covers Round of 32 through the Final (June 27 – July 19)
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
───────────────────────────────────────────────────────────────── */

const ESPN_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
<<<<<<< HEAD
=======

/* CORS proxies — tried in order until one succeeds */
const PROXIES = [
  (url: string) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) =>
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) =>
    `https://api.codetabs.com/v1/proxy?quest=${url}`,
];
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709

export interface EspnKnockoutMatch {
  date: string;
  time: string;
  timeET: string;
  stage: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  status: "upcoming" | "live" | "completed";
  venue: string;
  city: string;
  isFinal: boolean;
}

<<<<<<< HEAD
/* ── Flags ── */
=======
/* ── Flag emoji ─────────────────────────────────────────────── */
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
const FLAGS: Record<string, string> = {
  "us":"🇺🇸","mx":"🇲🇽","ca":"🇨🇦","br":"🇧🇷","ar":"🇦🇷","fr":"🇫🇷",
  "es":"🇪🇸","de":"🇩🇪","pt":"🇵🇹","nl":"🇳🇱","be":"🇧🇪","uy":"🇺🇾",
  "co":"🇨🇴","jp":"🇯🇵","kr":"🇰🇷","sa":"🇸🇦","ir":"🇮🇷","au":"🇦🇺",
  "tr":"🇹🇷","ma":"🇲🇦","eg":"🇪🇬","sn":"🇸🇳","gh":"🇬🇭","tn":"🇹🇳",
  "ch":"🇨🇭","se":"🇸🇪","nz":"🇳🇿","ec":"🇪🇨","pe":"🇵🇪","cl":"🇨🇱",
  "hr":"🇭🇷","dk":"🇩🇰","pl":"🇵🇱","rs":"🇷🇸","ua":"🇺🇦","at":"🇦🇹",
  "cz":"🇨🇿","ng":"🇳🇬","cm":"🇨🇲","iq":"🇮🇶","jo":"🇯🇴","dz":"🇩🇿",
  "cv":"🇨🇻","ht":"🇭🇹","py":"🇵🇾","ba":"🇧🇦","qa":"🇶🇦","no":"🇳🇴",
  "uz":"🇺🇿","cd":"🇨🇩","pa":"🇵🇦","ci":"🇨🇮","cw":"🇨🇼","za":"🇿🇦",
  "gb-eng":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","gb-sct":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "gb-wls":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","gb-nir":"🏴󠁧󠁢󠁮󠁩󠁲󠁿",
};

function toFlagEmoji(code: string): string {
  if (!code) return "🏆";
  const c = code.toLowerCase();
  if (FLAGS[c]) return FLAGS[c];
  if (c.length === 2) {
    return c.toUpperCase().split("").map(ch =>
      String.fromCodePoint(0x1F1E6 + ch.charCodeAt(0) - 65)
    ).join("");
  }
  return "🏆";
}

<<<<<<< HEAD
/* ── Abbreviation → ISO ── */
=======
/* ── ESPN abbreviation → ISO code ── */
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
const ABBREV: Record<string, string> = {
  USA:"us",MEX:"mx",CAN:"ca",BRA:"br",ARG:"ar",FRA:"fr",ESP:"es",
  ENG:"gb-eng",GER:"de",POR:"pt",NED:"nl",BEL:"be",URU:"uy",COL:"co",
  JPN:"jp",KOR:"kr",SAU:"sa",IRN:"ir",AUS:"au",TUR:"tr",MAR:"ma",
  EGY:"eg",SEN:"sn",GHA:"gh",TUN:"tn",SUI:"ch",SWE:"se",NZL:"nz",
  ECU:"ec",PER:"pe",CHI:"cl",CRO:"hr",DEN:"dk",POL:"pl",SRB:"rs",
  UKR:"ua",AUT:"at",CZE:"cz",NGA:"ng",CMR:"cm",IRQ:"iq",JOR:"jo",
  ALG:"dz",CPV:"cv",HAI:"ht",PAR:"py",BIH:"ba",QAT:"qa",NOR:"no",
  UZB:"uz",COD:"cd",PAN:"pa",CIV:"ci",CUR:"cw",RSA:"za",SCO:"gb-sct",
};

function toIsoCode(abbrev: string): string {
  return ABBREV[abbrev?.toUpperCase()] || abbrev?.toLowerCase() || "";
}

<<<<<<< HEAD
/* ── Name fixes — ESPN name → your schedule name ── */
const NAME_FIX: Record<string, string> = {
  "USA":                    "United States",
  "Korea Republic":         "South Korea",
  "Côte d'Ivoire":          "Ivory Coast",
  "Cote d'Ivoire":          "Ivory Coast",
  "Congo DR":               "DR Congo",
  "Czech Republic":         "Czechia",
  "Bosnia-Herzegovina":     "Bosnia & Herzegovina",
  "Bosnia and Herzegovina": "Bosnia & Herzegovina",
  "Curaçao":                "Curacao",
  "Türkiye":                "Turkey",
};

=======
/* ── Name normalization ── */
const NAME_FIX: Record<string, string> = {
  "USA":                     "United States",
  "US":                      "United States",
  "Korea Republic":          "South Korea",
  "Côte d'Ivoire":           "Ivory Coast",
  "Cote d'Ivoire":           "Ivory Coast",
  "Congo DR":                "DR Congo",
  "Czech Republic":          "Czechia",
  "Bosnia-Herzegovina":      "Bosnia & Herzegovina",
  "Bosnia and Herzegovina":  "Bosnia & Herzegovina",
  "Curaçao":                 "Curacao",
  "Türkiye":                 "Turkey",
};

/* Detects ESPN placeholder names that mean a team is not yet decided */
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
const TBD_PATTERN = /^(tbd|winner|loser|runner.?up|1st|2nd|match\s*\d)/i;

function fixName(name: string): string {
  if (!name || TBD_PATTERN.test(name.trim())) return "TBD";
  return NAME_FIX[name] ?? name;
}

<<<<<<< HEAD
/* ── Stage detection ── */
const VALID_STAGES = new Set([
  "Round of 32","Round of 16",
  "Quarter Finals","Semi Finals",
  "Third Place","Final",
=======
/* ── Stage normalization ── */
const VALID_STAGES = new Set([
  "Round of 32", "Round of 16",
  "Quarter Finals", "Semi Finals",
  "Third Place", "Final",
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
]);

function normalizeStage(text: string): string {
  if (!text) return "";
  const l = text.toLowerCase();
<<<<<<< HEAD
  if (l.includes("third") || l.includes("3rd"))
    return "Third Place";
  if (l.includes("final") && !l.includes("semi") &&
      !l.includes("quarter") && !l.includes("32") &&
      !l.includes("16"))
    return "Final";
  if (l.includes("semi"))    return "Semi Finals";
  if (l.includes("quarter")) return "Quarter Finals";
  if (l.includes("16"))      return "Round of 16";
  if (l.includes("32"))      return "Round of 32";
  return "";
}

function mapStatus(raw: string): "upcoming"|"live"|"completed" {
  const r = raw.toUpperCase();
  if (["IN_PROGRESS","HALFTIME","SECOND_HALF","EXTRA_TIME","PENALTY"]
      .some(s => r.includes(s))) return "live";
  if (["FULL_TIME","FINAL","STATUS_FINAL","POSTPONED","CANCELLED"]
=======
  if (l.includes("third") || l.includes("3rd place")) return "Third Place";
  if (l.includes("final") &&
      !l.includes("semi") &&
      !l.includes("quarter") &&
      !l.includes("32") &&
      !l.includes("16")) return "Final";
  if (l.includes("semi")) return "Semi Finals";
  if (l.includes("quarter")) return "Quarter Finals";
  if (l.includes("round of 16") || l.includes("last 16") || l.includes("r16"))
    return "Round of 16";
  if (l.includes("round of 32") || l.includes("last 32") || l.includes("r32"))
    return "Round of 32";
  return "";
}

function mapStatus(raw: string): "upcoming" | "live" | "completed" {
  const r = raw.toUpperCase();
  if (["IN_PROGRESS","HALFTIME","SECOND_HALF","EXTRA_TIME","PENALTY"]
      .some(s => r.includes(s))) return "live";
  if (["FULL_TIME","FINAL","STATUS_FINAL","POSTPONED","CANCELLED","ABANDONED"]
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
      .some(s => r.includes(s))) return "completed";
  return "upcoming";
}

/* ── Time helpers — always use ET timezone ── */
function toETDate(iso: string): string {
  // Converts UTC ISO string to ET date YYYY-MM-DD
  // Fixes the midnight UTC = previous-day ET issue
  try {
    return new Date(iso).toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
  } catch {
    return iso.split("T")[0] ?? "";
  }
}

function toET(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric", minute: "2-digit", hour12: true,
    }) + " ET";
  } catch { return ""; }
}

function toET24h(iso: string): string {
  try {
    const s = new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
    return s === "24:00" ? "00:00" : s;
  } catch { return ""; }
}

<<<<<<< HEAD
/* ── Date range: June 27 through July 19 ── */
function knockoutDates(): string[] {
  const out: string[] = [];
  const cur = new Date("2026-06-27T00:00:00Z");
  const end = new Date("2026-07-20T00:00:00Z");
  while (cur < end) {
    out.push(cur.toISOString().slice(0,10).replace(/-/g,""));
    cur.setUTCDate(cur.getUTCDate() + 1);
=======
/* ── Generate every date in the knockout window ── */
function knockoutDateStrings(): string[] {
  const out: string[] = [];
  // Round of 32 starts June 28, Final is July 19
  const start = new Date("2026-06-27T00:00:00Z");
  const stop  = new Date("2026-07-20T00:00:00Z");
  const cur   = new Date(start);
  while (cur < stop) {
    out.push(cur.toISOString().slice(0, 10).replace(/-/g, ""));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/* ── CORS proxy fetch ── */
async function fetchWithProxy(url: string): Promise<Response> {
  for (let i = 0; i < PROXIES.length; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8_000);
      const res = await fetch(PROXIES[i](url), { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) return res;
      console.warn(`Proxy ${i + 1} returned ${res.status}`);
    } catch (err) {
      console.warn(`Proxy ${i + 1} failed:`, err instanceof Error ? err.message : err);
    }
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
  }
  return out;
}

<<<<<<< HEAD
/* ── Parse events from one scoreboard response ── */
function parseKnockoutEvents(data: unknown): EspnKnockoutMatch[] {
  const events = (
    (data as Record<string,unknown>)?.events as unknown[]
  ) ?? [];
=======
/* ── Parse ESPN events — extract knockout matches only ── */
function parseKnockoutEvents(data: unknown): EspnKnockoutMatch[] {
  const events = ((data as Record<string, unknown>)?.events as unknown[]) ?? [];
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
  const out: EspnKnockoutMatch[] = [];

  for (const ev of events) {
    try {
<<<<<<< HEAD
      const e    = ev as Record<string,unknown>;
      const comp = (
        (e.competitions as unknown[])?.[0] ?? {}
      ) as Record<string,unknown>;

      /*
        STAGE DETECTION
        ESPN's notes[] array is always empty for World Cup 2026.
        The correct field is comp.altGameNote:
          "FIFA World Cup, Round of 32"
          "FIFA World Cup, Quarterfinals"
          "FIFA World Cup, Semifinals"
          "FIFA World Cup, Final"
        We split on comma and take the second part.
        Fallback: event.season.slug = "round-of-32"
      */
      const altNote    = (comp.altGameNote as string) ?? "";
      const seasonSlug = (
        (e.season as Record<string,unknown>)?.slug as string
      ) ?? "";

      let stageText = "";
      if (altNote.includes(",")) {
        stageText = altNote.split(",")[1].trim();
      } else if (altNote) {
        stageText = altNote;
      } else {
        stageText = seasonSlug.replace(/-/g, " ");
      }

      const stage = normalizeStage(stageText);
=======
      const e    = ev as Record<string, unknown>;
      const comp = ((e.competitions as unknown[])?.[0] ?? {}) as Record<string, unknown>;

      /*
        Stage detection — ESPN stores the round info in:
          comp.notes[0].headline  e.g. "Round of 32" / "Quarterfinal"
        Your liveData.ts already uses this field for group detection.
        We MUST read it here too — reading event.name gives team names,
        not the round name, so normalizeStage(event.name) always returns "".
      */
      const notes        = (comp.notes as unknown[]) ?? [];
      const noteObj      = (notes[0] ?? {}) as Record<string, unknown>;
      const noteHeadline = (noteObj.headline as string) ?? (noteObj.text as string) ?? "";

      const stage = normalizeStage(noteHeadline);

      // Only include confirmed knockout stages — skip group stage and unknowns
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
      if (!VALID_STAGES.has(stage)) continue;

      const competitors = (comp.competitors as unknown[]) ?? [];
      const home = (
<<<<<<< HEAD
        competitors.find(
          c => (c as Record<string,unknown>).homeAway === "home"
        ) ?? competitors[0]
      ) as Record<string,unknown>;
      const away = (
        competitors.find(
          c => (c as Record<string,unknown>).homeAway === "away"
        ) ?? competitors[1]
      ) as Record<string,unknown>;
      if (!home || !away) continue;

      const homeTeam   = (home.team ?? {}) as Record<string,unknown>;
      const awayTeam   = (away.team ?? {}) as Record<string,unknown>;
      const statusType = (
        (comp.status as Record<string,unknown>)?.type ?? {}
      ) as Record<string,unknown>;
      const statusName = (statusType.name as string) ?? "";
      const matchISO   = (comp.date as string) ?? (e.date as string) ?? "";
      const venueObj   = (comp.venue ?? {}) as Record<string,unknown>;
      const addrObj    = (venueObj.address ?? {}) as Record<string,unknown>;

      out.push({
        // Use ET date — fixes midnight UTC being wrong day issue
        date:      toETDate(matchISO),
        time:      toET24h(matchISO),
        timeET:    toET(matchISO),
        stage,
        team1:     fixName((homeTeam.displayName as string) ?? ""),
        team2:     fixName((awayTeam.displayName as string) ?? ""),
        team1Flag: toFlagEmoji(
          toIsoCode((homeTeam.abbreviation as string) ?? "")
        ),
        team2Flag: toFlagEmoji(
          toIsoCode((awayTeam.abbreviation as string) ?? "")
        ),
        status:    mapStatus(statusName),
        venue:     (venueObj.fullName as string) ?? "",
        city: [addrObj.city, addrObj.state]
               .filter(Boolean).join(", "),
        isFinal:   stage === "Final",
      });
    } catch { /* skip malformed */ }
=======
        competitors.find((c) => (c as Record<string, unknown>).homeAway === "home")
        ?? competitors[0]
      ) as Record<string, unknown>;
      const away = (
        competitors.find((c) => (c as Record<string, unknown>).homeAway === "away")
        ?? competitors[1]
      ) as Record<string, unknown>;
      if (!home || !away) continue;

      const homeTeam   = (home.team ?? {}) as Record<string, unknown>;
      const awayTeam   = (away.team ?? {}) as Record<string, unknown>;
      const statusType = ((comp.status as Record<string, unknown>)?.type ?? {}) as Record<string, unknown>;
      const statusName = (statusType.name as string) ?? "";
      const matchDate  = (comp.date as string) ?? (e.date as string) ?? "";

      out.push({
        date:       matchDate.split("T")[0] ?? "",
        time:       toET24h(matchDate),
        timeET:     toET(matchDate),
        stage,
        team1:      fixName((homeTeam.displayName as string) ?? ""),
        team2:      fixName((awayTeam.displayName as string) ?? ""),
        team1Flag:  toFlagEmoji(toIsoCode((homeTeam.abbreviation as string) ?? "")),
        team2Flag:  toFlagEmoji(toIsoCode((awayTeam.abbreviation as string) ?? "")),
        status:     mapStatus(statusName),
        venue:      (comp.venue as Record<string, unknown>)?.fullName as string ?? "",
        city: [
          ((comp.venue as Record<string, unknown>)?.address as Record<string, unknown>)?.city,
          ((comp.venue as Record<string, unknown>)?.address as Record<string, unknown>)?.state,
        ].filter(Boolean).join(", "),
        isFinal: stage === "Final",
      });
    } catch {
      // skip malformed events silently
    }
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
  }
  return out;
}

/* ── Main export ── */
export async function fetchEspnKnockoutMatches(): Promise<EspnKnockoutMatch[]> {
<<<<<<< HEAD
  const dates = knockoutDates();

  /*
    Call ESPN DIRECTLY — no CORS proxy needed.
    ESPN sets access-control-allow-origin: * on their scoreboard API.
    The CORS proxy approach was causing failures because third-party
    proxy services (allorigins.win, corsproxy.io) are unreliable.
    liveData.ts already calls ESPN directly successfully — same approach here.
  */
  const results = await Promise.allSettled(
    dates.map(d =>
      fetch(`${ESPN_BASE}?lang=en&region=us&dates=${d}&limit=20`, {
        signal: AbortSignal.timeout(8_000),
      }).then(r => r.json())
=======
  const dates = knockoutDateStrings(); // June 27 – July 19

  /*
    Fetch all dates in parallel.
    Using Promise.allSettled so one failed date never aborts the rest.
    23 small requests — fast in practice, each is under 5 KB.
  */
  const results = await Promise.allSettled(
    dates.map((d) =>
      fetchWithProxy(`${ESPN_BASE}?lang=en&region=us&dates=${d}&limit=20`)
        .then((r) => r.json())
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
    )
  );

  const all: EspnKnockoutMatch[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const match of parseKnockoutEvents(result.value)) {
<<<<<<< HEAD
=======
      // Deduplicate by date + both team names
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
      const key = `${match.date}|${match.team1}|${match.team2}`;
      if (!seen.has(key)) {
        seen.add(key);
        all.push(match);
      }
    }
  }

  console.log(
<<<<<<< HEAD
    `📡 ESPN: ${all.length} knockout matches fetched`,
    all.filter(m => m.team1 !== "TBD")
       .map(m => `${m.team1} vs ${m.team2} (${m.stage} ${m.date})`)
=======
    `📡 ESPN knockout fetch: ${all.length} matches found`,
    all.filter(m => m.team1 !== "TBD").map(m => `${m.team1} vs ${m.team2} (${m.stage})`)
>>>>>>> 327480180b47caba480e7ea0bd845756f9e8a709
  );

  return all;
}