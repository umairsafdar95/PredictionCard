/* ─────────────────────────────────────────────────────────────────
   espn.ts — fetches FIFA World Cup 2026 knockout matches
   Calls ESPN directly — no CORS proxy needed (ESPN allows all origins)
───────────────────────────────────────────────────────────────── */

const ESPN_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

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

/* ── Flags ── */
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

/* ── Abbreviation → ISO ── */
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

const TBD_PATTERN = /^(tbd|winner|loser|runner.?up|1st|2nd|match\s*\d)/i;

function fixName(name: string): string {
  if (!name || TBD_PATTERN.test(name.trim())) return "TBD";
  return NAME_FIX[name] ?? name;
}

/* ── Stage detection ── */
const VALID_STAGES = new Set([
  "Round of 32","Round of 16",
  "Quarter Finals","Semi Finals",
  "Third Place","Final",
]);

function normalizeStage(text: string): string {
  if (!text) return "";
  const l = text.toLowerCase();
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

/* ── Date range: June 27 through July 19 ── */
function knockoutDates(): string[] {
  const out: string[] = [];
  const cur = new Date("2026-06-27T00:00:00Z");
  const end = new Date("2026-07-20T00:00:00Z");
  while (cur < end) {
    out.push(cur.toISOString().slice(0,10).replace(/-/g,""));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/* ── Parse events from one scoreboard response ── */
function parseKnockoutEvents(data: unknown): EspnKnockoutMatch[] {
  const events = (
    (data as Record<string,unknown>)?.events as unknown[]
  ) ?? [];
  const out: EspnKnockoutMatch[] = [];

  for (const ev of events) {
    try {
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
      if (!VALID_STAGES.has(stage)) continue;

      const competitors = (comp.competitors as unknown[]) ?? [];
      const home = (
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
  }
  return out;
}

/* ── Main export ── */
export async function fetchEspnKnockoutMatches(): Promise<EspnKnockoutMatch[]> {
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
    )
  );

  const all: EspnKnockoutMatch[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const match of parseKnockoutEvents(result.value)) {
      const key = `${match.date}|${match.team1}|${match.team2}`;
      if (!seen.has(key)) {
        seen.add(key);
        all.push(match);
      }
    }
  }

  console.log(
    `📡 ESPN: ${all.length} knockout matches fetched`,
    all.filter(m => m.team1 !== "TBD")
       .map(m => `${m.team1} vs ${m.team2} (${m.stage} ${m.date})`)
  );

  return all;
}