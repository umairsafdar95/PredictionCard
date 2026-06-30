const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer";

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

/* ── Flag emoji from ISO code ── */
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

/* ── ESPN 3-letter abbrev → ISO 2-letter ── */
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

/* ── Fix ESPN names → our local team names ── */
const NAME_FIX: Record<string, string> = {
  "USA":"United States","US":"United States",
  "Korea Republic":"South Korea",
  "Côte d'Ivoire":"Ivory Coast","Cote d'Ivoire":"Ivory Coast",
  "Congo DR":"DR Congo",
  "Czech Republic":"Czechia",
  "Bosnia-Herzegovina":"Bosnia & Herzegovina",
  "Curaçao":"Curacao",
};

function fixName(name: string): string {
  if (!name) return "TBD";
  return NAME_FIX[name] || name;
}

/* ── Stage helpers — ORDER MATTERS: check more specific first ── */
function normalizeStage(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("third place") || l.includes("third-place")) return "Third Place";
  if (l.includes("semi")) return "Semi Finals";
  if (l.includes("quarter")) return "Quarter Finals";
  if (l.includes("round of 16") || l.includes("eight finals") || l.includes("round of sixteen")) return "Round of 16";
  if (l.includes("round of 32") || l.includes("round of thirty") || l.includes("sixteen finals")) return "Round of 32";
  if (l.includes("final") || l.includes("championship")) return "Final";
  return name;
}

function isKnockout(name: string): boolean {
  const l = name.toLowerCase();
  return [
    "round of 32","round of 16","round of thirty","round of sixteen",
    "eight finals","sixteen finals","quarter","semi",
    "third place","third-place","final","championship",
  ].some(k => l.includes(k));
}

function mapStatus(raw: string): "upcoming" | "live" | "completed" {
  if (["IN_PROGRESS","HALFTIME","SECOND_HALF","EXTRA_TIME","PENALTY_SHOOTOUT","PENALTY"]
      .some(s => raw.includes(s))) return "live";
  if (["FULL_TIME","POSTPONED","CANCELLED","ABANDONED"].some(s => raw.includes(s))) return "completed";
  return "upcoming";
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

/* ── Main fetch — fifa.world is the WORKING slug ── */
export async function fetchEspnKnockoutMatches(): Promise<EspnKnockoutMatch[]> {
  const slugs = [
    "fifa.world",            // ✅ VERIFIED WORKING
    "fifa.worldcup",         // fallback
    "fifa.worldcup.2026",    // fallback
  ];

  for (const slug of slugs) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        `${ESPN_BASE}/${slug}/scoreboard?lang=en&region=us`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) continue;
      const data = await res.json();
      if (!data.events?.length) continue;

      const out: EspnKnockoutMatch[] = [];

      for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp) continue;

        const label = event.name || comp.name || "";
        if (comp.group && !isKnockout(label)) continue;

        const home = comp.competitors?.find((c: any) => c.homeAway === "home");
        const away = comp.competitors?.find((c: any) => c.homeAway === "away");
        if (!home || !away) continue;

        const stage = normalizeStage(label);
        const isFinal = stage === "Final";

        out.push({
          date: comp.date?.split("T")[0] || "",
          time: toET24h(comp.date),
          timeET: toET(comp.date),
          stage,
          team1: fixName(home.team?.displayName),
          team2: fixName(away.team?.displayName),
          team1Flag: toFlagEmoji(toIsoCode(home.team?.abbreviation)),
          team2Flag: toFlagEmoji(toIsoCode(away.team?.abbreviation)),
          status: mapStatus(comp.status?.type?.name || ""),
          venue: comp.venue?.fullName || "",
          city: [comp.venue?.address?.city, comp.venue?.address?.state]
            .filter(Boolean).join(", "),
          isFinal,
        });
      }

      if (out.length > 0) return out;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.warn(`ESPN "${slug}" timed out`);
      } else {
        console.warn(`ESPN "${slug}" failed:`, err);
      }
    }
  }

  return [];
}