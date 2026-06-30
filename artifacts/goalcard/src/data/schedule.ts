export interface ScheduleMatch {
  id: string;
  date: string;
  time: string;
  timeET: string;
  group: string | null;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  venue: string;
  city: string;
  stage: string;
  status: "upcoming" | "live" | "completed";
  isFinal?: boolean;
}

const schedule: ScheduleMatch[] = [

  // ══════════════════════════════════════════════════════
  //  GROUP STAGE  (all 72 matches, times in US Eastern)
  // ══════════════════════════════════════════════════════

  // ── JUNE 11 · GROUP A ────────────────────────────────
  { id: "M001", date: "2026-06-11", time: "15:00", timeET: "3:00 PM ET",  group: "A", team1: "Mexico",     team2: "South Africa", team1Flag: "🇲🇽", team2Flag: "🇿🇦", venue: "Estadio Azteca",          city: "Mexico City, Mexico",      stage: "Group Stage", status: "upcoming" },
  { id: "M002", date: "2026-06-11", time: "22:00", timeET: "10:00 PM ET", group: "A", team1: "South Korea", team2: "Czechia",      team1Flag: "🇰🇷", team2Flag: "🇨🇿", venue: "Estadio Akron",           city: "Guadalajara, Mexico",      stage: "Group Stage", status: "upcoming" },

  // ── JUNE 12 · GROUPS B & D ───────────────────────────
  { id: "M003", date: "2026-06-12", time: "15:00", timeET: "3:00 PM ET",  group: "B", team1: "Canada",        team2: "Bosnia & Herzegovina", team1Flag: "🇨🇦", team2Flag: "🇧🇦", venue: "BMO Field",    city: "Toronto, Canada",          stage: "Group Stage", status: "upcoming" },
  { id: "M004", date: "2026-06-12", time: "21:00", timeET: "9:00 PM ET",  group: "D", team1: "United States", team2: "Paraguay",             team1Flag: "🇺🇸", team2Flag: "🇵🇾", venue: "SoFi Stadium", city: "Inglewood, CA",            stage: "Group Stage", status: "upcoming" },

  // ── JUNE 13 · GROUPS B & C ───────────────────────────
  { id: "M005", date: "2026-06-13", time: "15:00", timeET: "3:00 PM ET",  group: "B", team1: "Qatar",  team2: "Switzerland", team1Flag: "🇶🇦", team2Flag: "🇨🇭", venue: "Levi's Stadium",   city: "Santa Clara, CA",          stage: "Group Stage", status: "upcoming" },
  { id: "M006", date: "2026-06-13", time: "18:00", timeET: "6:00 PM ET",  group: "C", team1: "Brazil", team2: "Morocco",      team1Flag: "🇧🇷", team2Flag: "🇲🇦", venue: "MetLife Stadium",  city: "East Rutherford, NJ",      stage: "Group Stage", status: "upcoming" },
  { id: "M007", date: "2026-06-13", time: "21:00", timeET: "9:00 PM ET",  group: "C", team1: "Haiti",  team2: "Scotland",     team1Flag: "🇭🇹", team2Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", venue: "Gillette Stadium", city: "Foxborough, MA",           stage: "Group Stage", status: "upcoming" },

  // ── JUNE 14 · GROUPS D / E / F ───────────────────────
  { id: "M008", date: "2026-06-14", time: "00:00", timeET: "12:00 AM ET", group: "D", team1: "Australia",   team2: "Turkey",    team1Flag: "🇦🇺", team2Flag: "🇹🇷", venue: "BC Place",                city: "Vancouver, Canada",        stage: "Group Stage", status: "upcoming" },
  { id: "M009", date: "2026-06-14", time: "13:00", timeET: "1:00 PM ET",  group: "E", team1: "Germany",     team2: "Curacao",   team1Flag: "🇩🇪", team2Flag: "🇨🇼", venue: "NRG Stadium",             city: "Houston, TX",              stage: "Group Stage", status: "upcoming" },
  { id: "M010", date: "2026-06-14", time: "16:00", timeET: "4:00 PM ET",  group: "F", team1: "Netherlands", team2: "Japan",     team1Flag: "🇳🇱", team2Flag: "🇯🇵", venue: "AT&T Stadium",            city: "Arlington, TX",            stage: "Group Stage", status: "upcoming" },
  { id: "M011", date: "2026-06-14", time: "19:00", timeET: "7:00 PM ET",  group: "E", team1: "Ivory Coast", team2: "Ecuador",   team1Flag: "🇨🇮", team2Flag: "🇪🇨", venue: "Lincoln Financial Field", city: "Philadelphia, PA",         stage: "Group Stage", status: "upcoming" },
  { id: "M012", date: "2026-06-14", time: "22:00", timeET: "10:00 PM ET", group: "F", team1: "Sweden",      team2: "Tunisia",   team1Flag: "🇸🇪", team2Flag: "🇹🇳", venue: "Estadio BBVA",            city: "Monterrey, Mexico",        stage: "Group Stage", status: "upcoming" },

  // ── JUNE 15 · GROUPS G & H ───────────────────────────
  { id: "M013", date: "2026-06-15", time: "12:00", timeET: "12:00 PM ET", group: "H", team1: "Spain",        team2: "Cape Verde",  team1Flag: "🇪🇸", team2Flag: "🇨🇻", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",              stage: "Group Stage", status: "upcoming" },
  { id: "M014", date: "2026-06-15", time: "15:00", timeET: "3:00 PM ET",  group: "G", team1: "Belgium",      team2: "Egypt",       team1Flag: "🇧🇪", team2Flag: "🇪🇬", venue: "Lumen Field",           city: "Seattle, WA",              stage: "Group Stage", status: "upcoming" },
  { id: "M015", date: "2026-06-15", time: "18:00", timeET: "6:00 PM ET",  group: "H", team1: "Saudi Arabia", team2: "Uruguay",     team1Flag: "🇸🇦", team2Flag: "🇺🇾", venue: "Hard Rock Stadium",     city: "Miami Gardens, FL",        stage: "Group Stage", status: "upcoming" },
  { id: "M016", date: "2026-06-15", time: "21:00", timeET: "9:00 PM ET",  group: "G", team1: "Iran",         team2: "New Zealand", team1Flag: "🇮🇷", team2Flag: "🇳🇿", venue: "SoFi Stadium",          city: "Inglewood, CA",            stage: "Group Stage", status: "upcoming" },

  // ── JUNE 16 · GROUPS I & J ───────────────────────────
  { id: "M017", date: "2026-06-16", time: "15:00", timeET: "3:00 PM ET",  group: "I", team1: "France",    team2: "Senegal", team1Flag: "🇫🇷", team2Flag: "🇸🇳", venue: "MetLife Stadium",            city: "East Rutherford, NJ",      stage: "Group Stage", status: "upcoming" },
  { id: "M018", date: "2026-06-16", time: "18:00", timeET: "6:00 PM ET",  group: "I", team1: "Iraq",      team2: "Norway",  team1Flag: "🇮🇶", team2Flag: "🇳🇴", venue: "Gillette Stadium",            city: "Foxborough, MA",           stage: "Group Stage", status: "upcoming" },
  { id: "M019", date: "2026-06-16", time: "21:00", timeET: "9:00 PM ET",  group: "J", team1: "Argentina", team2: "Algeria", team1Flag: "🇦🇷", team2Flag: "🇩🇿", venue: "Arrowhead Stadium",           city: "Kansas City, MO",          stage: "Group Stage", status: "upcoming" },

  // ── JUNE 17 · GROUPS J / K / L ───────────────────────
  { id: "M020", date: "2026-06-17", time: "00:00", timeET: "12:00 AM ET", group: "J", team1: "Austria",     team2: "Jordan",    team1Flag: "🇦🇹", team2Flag: "🇯🇴", venue: "Levi's Stadium",          city: "Santa Clara, CA",          stage: "Group Stage", status: "upcoming" },
  { id: "M021", date: "2026-06-17", time: "13:00", timeET: "1:00 PM ET",  group: "K", team1: "Portugal",    team2: "DR Congo",  team1Flag: "🇵🇹", team2Flag: "🇨🇩", venue: "NRG Stadium",             city: "Houston, TX",              stage: "Group Stage", status: "upcoming" },
  { id: "M022", date: "2026-06-17", time: "16:00", timeET: "4:00 PM ET",  group: "L", team1: "England",     team2: "Croatia",   team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2Flag: "🇭🇷", venue: "AT&T Stadium",            city: "Arlington, TX",            stage: "Group Stage", status: "upcoming" },
  { id: "M023", date: "2026-06-17", time: "19:00", timeET: "7:00 PM ET",  group: "L", team1: "Ghana",       team2: "Panama",    team1Flag: "🇬🇭", team2Flag: "🇵🇦", venue: "BMO Field",               city: "Toronto, Canada",          stage: "Group Stage", status: "upcoming" },
  { id: "M024", date: "2026-06-17", time: "22:00", timeET: "10:00 PM ET", group: "K", team1: "Uzbekistan",  team2: "Colombia",  team1Flag: "🇺🇿", team2Flag: "🇨🇴", venue: "Estadio Azteca",          city: "Mexico City, Mexico",      stage: "Group Stage", status: "upcoming" },

  // ── JUNE 18 · GROUPS A & B ───────────────────────────
  { id: "M025", date: "2026-06-18", time: "12:00", timeET: "12:00 PM ET", group: "A", team1: "Czechia",              team2: "South Africa",       team1Flag: "🇨🇿", team2Flag: "🇿🇦", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",          stage: "Group Stage", status: "upcoming" },
  { id: "M026", date: "2026-06-18", time: "15:00", timeET: "3:00 PM ET",  group: "B", team1: "Switzerland",          team2: "Bosnia & Herzegovina", team1Flag: "🇨🇭", team2Flag: "🇧🇦", venue: "SoFi Stadium",          city: "Inglewood, CA",        stage: "Group Stage", status: "upcoming" },
  { id: "M027", date: "2026-06-18", time: "18:00", timeET: "6:00 PM ET",  group: "B", team1: "Canada",               team2: "Qatar",              team1Flag: "🇨🇦", team2Flag: "🇶🇦", venue: "BC Place",              city: "Vancouver, Canada",    stage: "Group Stage", status: "upcoming" },
  { id: "M028", date: "2026-06-18", time: "21:00", timeET: "9:00 PM ET",  group: "A", team1: "Mexico",               team2: "South Korea",        team1Flag: "🇲🇽", team2Flag: "🇰🇷", venue: "Estadio Akron",         city: "Guadalajara, Mexico",  stage: "Group Stage", status: "upcoming" },

  // ── JUNE 19 · GROUPS C & D ───────────────────────────
  { id: "M029", date: "2026-06-19", time: "15:00", timeET: "3:00 PM ET",  group: "D", team1: "United States", team2: "Australia", team1Flag: "🇺🇸", team2Flag: "🇦🇺", venue: "Lumen Field",            city: "Seattle, WA",       stage: "Group Stage", status: "upcoming" },
  { id: "M030", date: "2026-06-19", time: "18:00", timeET: "6:00 PM ET",  group: "C", team1: "Scotland",      team2: "Morocco",   team1Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", team2Flag: "🇲🇦", venue: "Gillette Stadium",       city: "Foxborough, MA",    stage: "Group Stage", status: "upcoming" },
  { id: "M031", date: "2026-06-19", time: "20:30", timeET: "8:30 PM ET",  group: "C", team1: "Brazil",        team2: "Haiti",     team1Flag: "🇧🇷", team2Flag: "🇭🇹", venue: "Lincoln Financial Field",city: "Philadelphia, PA",  stage: "Group Stage", status: "upcoming" },
  { id: "M032", date: "2026-06-19", time: "23:00", timeET: "11:00 PM ET", group: "D", team1: "Turkey",        team2: "Paraguay",  team1Flag: "🇹🇷", team2Flag: "🇵🇾", venue: "Levi's Stadium",         city: "Santa Clara, CA",   stage: "Group Stage", status: "upcoming" },

  // ── JUNE 20 · GROUPS E & F ───────────────────────────
  { id: "M033", date: "2026-06-20", time: "13:00", timeET: "1:00 PM ET",  group: "F", team1: "Netherlands", team2: "Sweden",       team1Flag: "🇳🇱", team2Flag: "🇸🇪", venue: "NRG Stadium",             city: "Houston, TX",       stage: "Group Stage", status: "upcoming" },
  { id: "M034", date: "2026-06-20", time: "16:00", timeET: "4:00 PM ET",  group: "E", team1: "Germany",     team2: "Ivory Coast",  team1Flag: "🇩🇪", team2Flag: "🇨🇮", venue: "BMO Field",               city: "Toronto, Canada",   stage: "Group Stage", status: "upcoming" },
  { id: "M035", date: "2026-06-20", time: "20:00", timeET: "8:00 PM ET",  group: "E", team1: "Ecuador",     team2: "Curacao",      team1Flag: "🇪🇨", team2Flag: "🇨🇼", venue: "Arrowhead Stadium",       city: "Kansas City, MO",   stage: "Group Stage", status: "upcoming" },

  // ── JUNE 21 · GROUPS F / G / H ───────────────────────
  { id: "M036", date: "2026-06-21", time: "00:00", timeET: "12:00 AM ET", group: "F", team1: "Tunisia",      team2: "Japan",       team1Flag: "🇹🇳", team2Flag: "🇯🇵", venue: "Estadio BBVA",          city: "Monterrey, Mexico",    stage: "Group Stage", status: "upcoming" },
  { id: "M037", date: "2026-06-21", time: "12:00", timeET: "12:00 PM ET", group: "H", team1: "Spain",        team2: "Saudi Arabia",team1Flag: "🇪🇸", team2Flag: "🇸🇦", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",          stage: "Group Stage", status: "upcoming" },
  { id: "M038", date: "2026-06-21", time: "15:00", timeET: "3:00 PM ET",  group: "G", team1: "Belgium",      team2: "Iran",        team1Flag: "🇧🇪", team2Flag: "🇮🇷", venue: "SoFi Stadium",          city: "Inglewood, CA",        stage: "Group Stage", status: "upcoming" },
  { id: "M039", date: "2026-06-21", time: "18:00", timeET: "6:00 PM ET",  group: "H", team1: "Uruguay",      team2: "Cape Verde",  team1Flag: "🇺🇾", team2Flag: "🇨🇻", venue: "Hard Rock Stadium",     city: "Miami Gardens, FL",    stage: "Group Stage", status: "upcoming" },
  { id: "M040", date: "2026-06-21", time: "21:00", timeET: "9:00 PM ET",  group: "G", team1: "New Zealand",  team2: "Egypt",       team1Flag: "🇳🇿", team2Flag: "🇪🇬", venue: "BC Place",              city: "Vancouver, Canada",    stage: "Group Stage", status: "upcoming" },

  // ── JUNE 22 · GROUPS I & J ───────────────────────────
  { id: "M041", date: "2026-06-22", time: "13:00", timeET: "1:00 PM ET",  group: "J", team1: "Argentina", team2: "Austria",  team1Flag: "🇦🇷", team2Flag: "🇦🇹", venue: "AT&T Stadium",            city: "Arlington, TX",        stage: "Group Stage", status: "upcoming" },
  { id: "M042", date: "2026-06-22", time: "17:00", timeET: "5:00 PM ET",  group: "I", team1: "France",    team2: "Iraq",     team1Flag: "🇫🇷", team2Flag: "🇮🇶", venue: "Lincoln Financial Field", city: "Philadelphia, PA",     stage: "Group Stage", status: "upcoming" },
  { id: "M043", date: "2026-06-22", time: "20:00", timeET: "8:00 PM ET",  group: "I", team1: "Norway",    team2: "Senegal",  team1Flag: "🇳🇴", team2Flag: "🇸🇳", venue: "MetLife Stadium",         city: "East Rutherford, NJ",  stage: "Group Stage", status: "upcoming" },

  // ── JUNE 23 · GROUPS J / K / L ───────────────────────
  { id: "M044", date: "2026-06-23", time: "00:00", timeET: "12:00 AM ET", group: "J", team1: "Jordan",     team2: "Algeria",   team1Flag: "🇯🇴", team2Flag: "🇩🇿", venue: "Levi's Stadium",  city: "Santa Clara, CA",   stage: "Group Stage", status: "upcoming" },
  { id: "M045", date: "2026-06-23", time: "13:00", timeET: "1:00 PM ET",  group: "K", team1: "Portugal",   team2: "Uzbekistan",team1Flag: "🇵🇹", team2Flag: "🇺🇿", venue: "NRG Stadium",     city: "Houston, TX",       stage: "Group Stage", status: "upcoming" },
  { id: "M046", date: "2026-06-23", time: "16:00", timeET: "4:00 PM ET",  group: "L", team1: "England",    team2: "Ghana",     team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2Flag: "🇬🇭", venue: "Gillette Stadium",city: "Foxborough, MA",    stage: "Group Stage", status: "upcoming" },
  { id: "M047", date: "2026-06-23", time: "19:00", timeET: "7:00 PM ET",  group: "L", team1: "Panama",     team2: "Croatia",   team1Flag: "🇵🇦", team2Flag: "🇭🇷", venue: "BMO Field",       city: "Toronto, Canada",   stage: "Group Stage", status: "upcoming" },
  { id: "M048", date: "2026-06-23", time: "22:00", timeET: "10:00 PM ET", group: "K", team1: "Colombia",   team2: "DR Congo",  team1Flag: "🇨🇴", team2Flag: "🇨🇩", venue: "Estadio Akron",   city: "Guadalajara, Mexico",stage: "Group Stage", status: "upcoming" },

  // ── JUNE 24 · GROUPS A / B / C (FINAL MATCHDAY) ─────
  { id: "M049", date: "2026-06-24", time: "15:00", timeET: "3:00 PM ET",  group: "B", team1: "Bosnia & Herzegovina", team2: "Qatar",        team1Flag: "🇧🇦", team2Flag: "🇶🇦", venue: "Lumen Field",           city: "Seattle, WA",       stage: "Group Stage", status: "upcoming" },
  { id: "M050", date: "2026-06-24", time: "15:00", timeET: "3:00 PM ET",  group: "B", team1: "Switzerland",          team2: "Canada",       team1Flag: "🇨🇭", team2Flag: "🇨🇦", venue: "BC Place",              city: "Vancouver, Canada", stage: "Group Stage", status: "upcoming" },
  { id: "M051", date: "2026-06-24", time: "18:00", timeET: "6:00 PM ET",  group: "C", team1: "Morocco",              team2: "Haiti",        team1Flag: "🇲🇦", team2Flag: "🇭🇹", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",       stage: "Group Stage", status: "upcoming" },
  { id: "M052", date: "2026-06-24", time: "18:00", timeET: "6:00 PM ET",  group: "C", team1: "Scotland",             team2: "Brazil",       team1Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", team2Flag: "🇧🇷", venue: "Hard Rock Stadium",     city: "Miami Gardens, FL", stage: "Group Stage", status: "upcoming" },
  { id: "M053", date: "2026-06-24", time: "21:00", timeET: "9:00 PM ET",  group: "A", team1: "Czechia",              team2: "Mexico",       team1Flag: "🇨🇿", team2Flag: "🇲🇽", venue: "Estadio Azteca",        city: "Mexico City, Mexico",stage: "Group Stage", status: "upcoming" },
  { id: "M054", date: "2026-06-24", time: "21:00", timeET: "9:00 PM ET",  group: "A", team1: "South Africa",         team2: "South Korea",  team1Flag: "🇿🇦", team2Flag: "🇰🇷", venue: "Estadio BBVA",          city: "Monterrey, Mexico", stage: "Group Stage", status: "upcoming" },

  // ── JUNE 25 · GROUPS D / E / F (FINAL MATCHDAY) ─────
  { id: "M055", date: "2026-06-25", time: "16:00", timeET: "4:00 PM ET",  group: "E", team1: "Curacao",      team2: "Ivory Coast",  team1Flag: "🇨🇼", team2Flag: "🇨🇮", venue: "Lincoln Financial Field", city: "Philadelphia, PA",    stage: "Group Stage", status: "upcoming" },
  { id: "M056", date: "2026-06-25", time: "16:00", timeET: "4:00 PM ET",  group: "E", team1: "Ecuador",      team2: "Germany",      team1Flag: "🇪🇨", team2Flag: "🇩🇪", venue: "MetLife Stadium",         city: "East Rutherford, NJ", stage: "Group Stage", status: "upcoming" },
  { id: "M057", date: "2026-06-25", time: "19:00", timeET: "7:00 PM ET",  group: "F", team1: "Japan",        team2: "Sweden",       team1Flag: "🇯🇵", team2Flag: "🇸🇪", venue: "AT&T Stadium",            city: "Arlington, TX",       stage: "Group Stage", status: "upcoming" },
  { id: "M058", date: "2026-06-25", time: "19:00", timeET: "7:00 PM ET",  group: "F", team1: "Tunisia",      team2: "Netherlands",  team1Flag: "🇹🇳", team2Flag: "🇳🇱", venue: "Arrowhead Stadium",       city: "Kansas City, MO",     stage: "Group Stage", status: "upcoming" },
  { id: "M059", date: "2026-06-25", time: "22:00", timeET: "10:00 PM ET", group: "D", team1: "Paraguay",     team2: "Australia",    team1Flag: "🇵🇾", team2Flag: "🇦🇺", venue: "Levi's Stadium",          city: "Santa Clara, CA",     stage: "Group Stage", status: "upcoming" },
  { id: "M060", date: "2026-06-25", time: "22:00", timeET: "10:00 PM ET", group: "D", team1: "Turkey",       team2: "United States",team1Flag: "🇹🇷", team2Flag: "🇺🇸", venue: "SoFi Stadium",            city: "Inglewood, CA",       stage: "Group Stage", status: "upcoming" },

  // ── JUNE 26 · GROUPS H & I (FINAL MATCHDAY) ─────────
  { id: "M061", date: "2026-06-26", time: "15:00", timeET: "3:00 PM ET",  group: "I", team1: "Norway",      team2: "France",       team1Flag: "🇳🇴", team2Flag: "🇫🇷", venue: "Gillette Stadium", city: "Foxborough, MA",    stage: "Group Stage", status: "upcoming" },
  { id: "M062", date: "2026-06-26", time: "15:00", timeET: "3:00 PM ET",  group: "I", team1: "Senegal",     team2: "Iraq",         team1Flag: "🇸🇳", team2Flag: "🇮🇶", venue: "BMO Field",        city: "Toronto, Canada",   stage: "Group Stage", status: "upcoming" },
  { id: "M063", date: "2026-06-26", time: "20:00", timeET: "8:00 PM ET",  group: "H", team1: "Cape Verde",  team2: "Saudi Arabia", team1Flag: "🇨🇻", team2Flag: "🇸🇦", venue: "NRG Stadium",      city: "Houston, TX",       stage: "Group Stage", status: "upcoming" },
  { id: "M064", date: "2026-06-26", time: "20:00", timeET: "8:00 PM ET",  group: "H", team1: "Uruguay",     team2: "Spain",        team1Flag: "🇺🇾", team2Flag: "🇪🇸", venue: "Estadio Akron",    city: "Guadalajara, Mexico",stage: "Group Stage", status: "upcoming" },

  // ── JUNE 27 · GROUPS G / J / K / L (FINAL MATCHDAY) ─
  { id: "M065", date: "2026-06-27", time: "00:00", timeET: "12:00 AM ET", group: "G", team1: "Egypt",     team2: "Iran",       team1Flag: "🇪🇬", team2Flag: "🇮🇷", venue: "Lumen Field",            city: "Seattle, WA",         stage: "Group Stage", status: "upcoming" },
  { id: "M066", date: "2026-06-27", time: "00:00", timeET: "12:00 AM ET", group: "G", team1: "New Zealand",team2: "Belgium",    team1Flag: "🇳🇿", team2Flag: "🇧🇪", venue: "BC Place",               city: "Vancouver, Canada",   stage: "Group Stage", status: "upcoming" },
  { id: "M067", date: "2026-06-27", time: "17:00", timeET: "5:00 PM ET",  group: "L", team1: "Croatia",   team2: "Ghana",      team1Flag: "🇭🇷", team2Flag: "🇬🇭", venue: "Lincoln Financial Field",city: "Philadelphia, PA",    stage: "Group Stage", status: "upcoming" },
  { id: "M068", date: "2026-06-27", time: "17:00", timeET: "5:00 PM ET",  group: "L", team1: "Panama",    team2: "England",    team1Flag: "🇵🇦", team2Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Group Stage", status: "upcoming" },
  { id: "M069", date: "2026-06-27", time: "19:30", timeET: "7:30 PM ET",  group: "K", team1: "Colombia",  team2: "Portugal",   team1Flag: "🇨🇴", team2Flag: "🇵🇹", venue: "Hard Rock Stadium",      city: "Miami Gardens, FL",   stage: "Group Stage", status: "upcoming" },
  { id: "M070", date: "2026-06-27", time: "19:30", timeET: "7:30 PM ET",  group: "K", team1: "DR Congo",  team2: "Uzbekistan", team1Flag: "🇨🇩", team2Flag: "🇺🇿", venue: "Mercedes-Benz Stadium",  city: "Atlanta, GA",         stage: "Group Stage", status: "upcoming" },
  { id: "M071", date: "2026-06-27", time: "22:00", timeET: "10:00 PM ET", group: "J", team1: "Algeria",   team2: "Austria",    team1Flag: "🇩🇿", team2Flag: "🇦🇹", venue: "Arrowhead Stadium",      city: "Kansas City, MO",     stage: "Group Stage", status: "upcoming" },
  { id: "M072", date: "2026-06-27", time: "22:00", timeET: "10:00 PM ET", group: "J", team1: "Jordan",    team2: "Argentina",  team1Flag: "🇯🇴", team2Flag: "🇦🇷", venue: "AT&T Stadium",           city: "Arlington, TX",        stage: "Group Stage", status: "upcoming" },

   // ══════════════════════════════════════════════════════
  //  ROUND OF 32  (June 28 – July 2, 16 matches)
  // ══════════════════════════════════════════════════════

  // ── JUNE 28 (SATURDAY) ──────────────────────────────
  { id: "M073", date: "2026-06-28", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "SoFi Stadium",            city: "Inglewood, CA",       stage: "Round of 32", status: "upcoming" },
  { id: "M074", date: "2026-06-28", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Round of 32", status: "upcoming" },
  { id: "M075", date: "2026-06-28", time: "21:00", timeET: "9:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium",           city: "Arlington, TX",       stage: "Round of 32", status: "upcoming" },

  // ── JUNE 29 (SUNDAY) ───────────────────────────────
  { id: "M076", date: "2026-06-29", time: "13:00", timeET: "1:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "NRG Stadium",             city: "Houston, TX",         stage: "Round of 32", status: "upcoming" },
  { id: "M077", date: "2026-06-29", time: "16:00", timeET: "4:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Gillette Stadium",       city: "Foxborough, MA",      stage: "Round of 32", status: "upcoming" },
  { id: "M078", date: "2026-06-29", time: "19:00", timeET: "7:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Lincoln Financial Field",city: "Philadelphia, PA",    stage: "Round of 32", status: "upcoming" },
  { id: "M079", date: "2026-06-29", time: "22:00", timeET: "10:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Mercedes-Benz Stadium",  city: "Atlanta, GA",        stage: "Round of 32", status: "upcoming" },

  // ── JUNE 30 (MONDAY) ───────────────────────────────
  { id: "M080", date: "2026-06-30", time: "13:00", timeET: "1:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Lumen Field",            city: "Seattle, WA",         stage: "Round of 32", status: "upcoming" },
  { id: "M081", date: "2026-06-30", time: "16:00", timeET: "4:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Levi's Stadium",         city: "Santa Clara, CA",     stage: "Round of 32", status: "upcoming" },
  { id: "M082", date: "2026-06-30", time: "19:00", timeET: "7:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Arrowhead Stadium",      city: "Kansas City, MO",     stage: "Round of 32", status: "upcoming" },
  { id: "M083", date: "2026-06-30", time: "22:00", timeET: "10:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Estadio Azteca",        city: "Mexico City, Mexico", stage: "Round of 32", status: "upcoming" },

  // ── JULY 1 (TUESDAY) ───────────────────────────────
  { id: "M084", date: "2026-07-01", time: "13:00", timeET: "1:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Estadio Akron",         city: "Guadalajara, Mexico", stage: "Round of 32", status: "upcoming" },
  { id: "M085", date: "2026-07-01", time: "16:00", timeET: "4:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Estadio BBVA",          city: "Monterrey, Mexico",   stage: "Round of 32", status: "upcoming" },
  { id: "M086", date: "2026-07-01", time: "19:00", timeET: "7:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "BMO Field",              city: "Toronto, Canada",     stage: "Round of 32", status: "upcoming" },
  { id: "M087", date: "2026-07-01", time: "22:00", timeET: "10:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "BC Place",              city: "Vancouver, Canada",   stage: "Round of 32", status: "upcoming" },

  // ── JULY 2 (WEDNESDAY) ─────────────────────────────
  { id: "M088", date: "2026-07-02", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Hard Rock Stadium",     city: "Miami Gardens, FL",   stage: "Round of 32", status: "upcoming" },

  // ══════════════════════════════════════════════════════
  //  ROUND OF 16  (July 4 – 5, 8 matches)
  // ══════════════════════════════════════════════════════

  // ── JULY 4 (SATURDAY) ──────────────────────────────
  { id: "M089", date: "2026-07-04", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "SoFi Stadium",            city: "Inglewood, CA",       stage: "Round of 16", status: "upcoming" },
  { id: "M090", date: "2026-07-04", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Round of 16", status: "upcoming" },
  { id: "M091", date: "2026-07-04", time: "21:00", timeET: "9:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium",           city: "Arlington, TX",       stage: "Round of 16", status: "upcoming" },

  // ── JULY 5 (SUNDAY) ───────────────────────────────
  { id: "M092", date: "2026-07-05", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "NRG Stadium",             city: "Houston, TX",         stage: "Round of 16", status: "upcoming" },
  { id: "M093", date: "2026-07-05", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Gillette Stadium",       city: "Foxborough, MA",      stage: "Round of 16", status: "upcoming" },
  { id: "M094", date: "2026-07-05", time: "21:00", timeET: "9:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Lincoln Financial Field",city: "Philadelphia, PA",    stage: "Round of 16", status: "upcoming" },
  { id: "M095", date: "2026-07-05", time: "22:00", timeET: "10:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Mercedes-Benz Stadium",  city: "Atlanta, GA",        stage: "Round of 16", status: "upcoming" },
  { id: "M096", date: "2026-07-05", time: "23:00", timeET: "11:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Lumen Field",            city: "Seattle, WA",         stage: "Round of 16", status: "upcoming" },

  // ══════════════════════════════════════════════════════
  //  QUARTER FINALS  (July 9 – 10, 4 matches)
  // ══════════════════════════════════════════════════════
  { id: "M097", date: "2026-07-09", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Quarter Finals", status: "upcoming" },
  { id: "M098", date: "2026-07-09", time: "21:00", timeET: "9:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium",           city: "Arlington, TX",       stage: "Quarter Finals", status: "upcoming" },
  { id: "M099", date: "2026-07-10", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "NRG Stadium",             city: "Houston, TX",         stage: "Quarter Finals", status: "upcoming" },
  { id: "M100", date: "2026-07-10", time: "21:00", timeET: "9:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "Gillette Stadium",       city: "Foxborough, MA",      stage: "Quarter Finals", status: "upcoming" },

  // ══════════════════════════════════════════════════════
  //  SEMI FINALS  (July 14 – 15, 2 matches)
  // ══════════════════════════════════════════════════════
  { id: "M101", date: "2026-07-14", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium",           city: "Arlington, TX",       stage: "Semi Finals", status: "upcoming" },
  { id: "M102", date: "2026-07-15", time: "18:00", timeET: "6:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Semi Finals", status: "upcoming" },

  // ══════════════════════════════════════════════════════
  //  THIRD PLACE  (July 18, 1 match)
  // ══════════════════════════════════════════════════════
  { id: "M103", date: "2026-07-18", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🥉", team2Flag: "🥉", venue: "Hard Rock Stadium",     city: "Miami Gardens, FL",   stage: "Third Place", status: "upcoming" },

  // ══════════════════════════════════════════════════════
  //  THE FINAL  (July 19, 1 match)
  // ══════════════════════════════════════════════════════
  { id: "M104", date: "2026-07-19", time: "15:00", timeET: "3:00 PM ET",  group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium",        city: "East Rutherford, NJ", stage: "Final", status: "upcoming", isFinal: true },
];

export default schedule;

export const getTodaysMatches = (): ScheduleMatch[] => {
  const today = new Date().toISOString().split("T")[0];
  return schedule.filter((m) => m.date === today);
};

export const getNextMatch = (): ScheduleMatch | undefined => {
  const now = new Date();
  return schedule
    .filter((m) => new Date(m.date + "T" + m.time + ":00") > now)
    .sort((a, b) =>
      new Date(a.date + "T" + a.time).getTime() -
      new Date(b.date + "T" + b.time).getTime()
    )[0];
};