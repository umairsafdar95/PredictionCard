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
  // ============ GROUP STAGE ============

  // JUNE 11 - THURSDAY
  { id: "M001", date: "2026-06-11", time: "15:00", timeET: "3:00 PM ET", group: "A", team1: "Mexico", team2: "South Africa", team1Flag: "🇲🇽", team2Flag: "🇿🇦", venue: "Estadio Azteca", city: "Mexico City, Mexico", stage: "Group Stage", status: "upcoming" },
  { id: "M002", date: "2026-06-11", time: "22:00", timeET: "10:00 PM ET", group: "A", team1: "South Korea", team2: "Czechia", team1Flag: "🇰🇷", team2Flag: "🇨🇿", venue: "Estadio Akron", city: "Guadalajara, Mexico", stage: "Group Stage", status: "upcoming" },

  // JUNE 12 - FRIDAY
  { id: "M003", date: "2026-06-12", time: "15:00", timeET: "3:00 PM ET", group: "B", team1: "Canada", team2: "Bosnia & Herzegovina", team1Flag: "🇨🇦", team2Flag: "🇧🇦", venue: "BMO Field", city: "Toronto, Canada", stage: "Group Stage", status: "upcoming" },
  { id: "M004", date: "2026-06-12", time: "21:00", timeET: "9:00 PM ET", group: "D", team1: "United States", team2: "Paraguay", team1Flag: "🇺🇸", team2Flag: "🇵🇾", venue: "SoFi Stadium", city: "Inglewood, CA", stage: "Group Stage", status: "upcoming" },

  // JUNE 13 - SATURDAY
  { id: "M005", date: "2026-06-13", time: "15:00", timeET: "3:00 PM ET", group: "B", team1: "Qatar", team2: "Switzerland", team1Flag: "🇶🇦", team2Flag: "🇨🇭", venue: "Levi's Stadium", city: "Santa Clara, CA", stage: "Group Stage", status: "upcoming" },
  { id: "M006", date: "2026-06-13", time: "18:00", timeET: "6:00 PM ET", group: "C", team1: "Brazil", team2: "Morocco", team1Flag: "🇧🇷", team2Flag: "🇲🇦", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Group Stage", status: "upcoming" },
  { id: "M007", date: "2026-06-13", time: "21:00", timeET: "9:00 PM ET", group: "C", team1: "Haiti", team2: "Scotland", team1Flag: "🇭🇹", team2Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", venue: "Gillette Stadium", city: "Foxborough, MA", stage: "Group Stage", status: "upcoming" },
  { id: "M008", date: "2026-06-13", time: "18:00", timeET: "6:00 PM ET", group: "D", team1: "Australia", team2: "Turkey", team1Flag: "🇦🇺", team2Flag: "🇹🇷", venue: "AT&T Stadium", city: "Dallas, TX", stage: "Group Stage", status: "upcoming" },

  // JUNE 14 - SUNDAY
  { id: "M009", date: "2026-06-14", time: "13:00", timeET: "1:00 PM ET", group: "E", team1: "Germany", team2: "Ecuador", team1Flag: "🇩🇪", team2Flag: "🇪🇨", venue: "Lincoln Financial Field", city: "Philadelphia, PA", stage: "Group Stage", status: "upcoming" },
  { id: "M010", date: "2026-06-14", time: "16:00", timeET: "4:00 PM ET", group: "F", team1: "Netherlands", team2: "Japan", team1Flag: "🇳🇱", team2Flag: "🇯🇵", venue: "Hard Rock Stadium", city: "Miami, FL", stage: "Group Stage", status: "upcoming" },
  { id: "M011", date: "2026-06-14", time: "19:00", timeET: "7:00 PM ET", group: "E", team1: "Ivory Coast", team2: "Curacao", team1Flag: "🇨🇮", team2Flag: "🇨🇼", venue: "Arrowhead Stadium", city: "Kansas City, MO", stage: "Group Stage", status: "upcoming" },
  { id: "M012", date: "2026-06-14", time: "22:00", timeET: "10:00 PM ET", group: "F", team1: "Tunisia", team2: "Ukraine", team1Flag: "🇹🇳", team2Flag: "🇺🇦", venue: "BC Place", city: "Vancouver, Canada", stage: "Group Stage", status: "upcoming" },

  // JUNE 15 - MONDAY
  { id: "M013", date: "2026-06-15", time: "12:00", timeET: "12:00 PM ET", group: "H", team1: "Spain", team2: "Cape Verde", team1Flag: "🇪🇸", team2Flag: "🇨🇻", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", stage: "Group Stage", status: "upcoming" },
  { id: "M014", date: "2026-06-15", time: "18:00", timeET: "6:00 PM ET", group: "G", team1: "Belgium", team2: "Egypt", team1Flag: "🇧🇪", team2Flag: "🇪🇬", venue: "Lumen Field", city: "Seattle, WA", stage: "Group Stage", status: "upcoming" },
  { id: "M015", date: "2026-06-15", time: "18:00", timeET: "6:00 PM ET", group: "H", team1: "Saudi Arabia", team2: "Uruguay", team1Flag: "🇸🇦", team2Flag: "🇺🇾", venue: "Hard Rock Stadium", city: "Miami, FL", stage: "Group Stage", status: "upcoming" },
  { id: "M016", date: "2026-06-15", time: "21:00", timeET: "9:00 PM ET", group: "G", team1: "Iran", team2: "New Zealand", team1Flag: "🇮🇷", team2Flag: "🇳🇿", venue: "Estadio Azteca", city: "Mexico City, Mexico", stage: "Group Stage", status: "upcoming" },

  // JUNE 16 - TUESDAY
  { id: "M017", date: "2026-06-16", time: "13:00", timeET: "1:00 PM ET", group: "I", team1: "France", team2: "Senegal", team1Flag: "🇫🇷", team2Flag: "🇸🇳", venue: "NRG Stadium", city: "Houston, TX", stage: "Group Stage", status: "upcoming" },
  { id: "M018", date: "2026-06-16", time: "16:00", timeET: "4:00 PM ET", group: "I", team1: "Norway", team2: "Iraq", team1Flag: "🇳🇴", team2Flag: "🇮🇶", venue: "Gillette Stadium", city: "Foxborough, MA", stage: "Group Stage", status: "upcoming" },
  { id: "M019", date: "2026-06-16", time: "21:00", timeET: "9:00 PM ET", group: "J", team1: "Argentina", team2: "Algeria", team1Flag: "🇦🇷", team2Flag: "🇩🇿", venue: "Arrowhead Stadium", city: "Kansas City, MO", stage: "Group Stage", status: "upcoming" },
  { id: "M020", date: "2026-06-16", time: "23:00", timeET: "11:00 PM ET", group: "J", team1: "Austria", team2: "Jordan", team1Flag: "🇦🇹", team2Flag: "🇯🇴", venue: "Levi's Stadium", city: "San Francisco, CA", stage: "Group Stage", status: "upcoming" },

  // JUNE 17 - WEDNESDAY
  { id: "M021", date: "2026-06-17", time: "13:00", timeET: "1:00 PM ET", group: "K", team1: "Portugal", team2: "DR Congo", team1Flag: "🇵🇹", team2Flag: "🇨🇩", venue: "NRG Stadium", city: "Houston, TX", stage: "Group Stage", status: "upcoming" },
  { id: "M022", date: "2026-06-17", time: "16:00", timeET: "4:00 PM ET", group: "L", team1: "England", team2: "Slovenia", team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2Flag: "🇸🇮", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Group Stage", status: "upcoming" },
  { id: "M023", date: "2026-06-17", time: "21:00", timeET: "9:00 PM ET", group: "L", team1: "Nigeria", team2: "Serbia", team1Flag: "🇳🇬", team2Flag: "🇷🇸", venue: "SoFi Stadium", city: "Inglewood, CA", stage: "Group Stage", status: "upcoming" },
  { id: "M024", date: "2026-06-17", time: "22:00", timeET: "10:00 PM ET", group: "K", team1: "Uzbekistan", team2: "Colombia", team1Flag: "🇺🇿", team2Flag: "🇨🇴", venue: "Estadio Azteca", city: "Mexico City, Mexico", stage: "Group Stage", status: "upcoming" },

  // JUNE 18 - THURSDAY
  { id: "M025", date: "2026-06-18", time: "12:00", timeET: "12:00 PM ET", group: "A", team1: "Czechia", team2: "South Africa", team1Flag: "🇨🇿", team2Flag: "🇿🇦", venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", stage: "Group Stage", status: "upcoming" },
  { id: "M026", date: "2026-06-18", time: "21:00", timeET: "9:00 PM ET", group: "A", team1: "Mexico", team2: "South Korea", team1Flag: "🇲🇽", team2Flag: "🇰🇷", venue: "Estadio Akron", city: "Guadalajara, Mexico", stage: "Group Stage", status: "upcoming" },

  // JUNE 19 - FRIDAY
  { id: "M027", date: "2026-06-19", time: "15:00", timeET: "3:00 PM ET", group: "D", team1: "United States", team2: "Australia", team1Flag: "🇺🇸", team2Flag: "🇦🇺", venue: "Lumen Field", city: "Seattle, WA", stage: "Group Stage", status: "upcoming" },
  { id: "M028", date: "2026-06-19", time: "18:00", timeET: "6:00 PM ET", group: "B", team1: "Canada", team2: "Qatar", team1Flag: "🇨🇦", team2Flag: "🇶🇦", venue: "BC Place", city: "Vancouver, Canada", stage: "Group Stage", status: "upcoming" },

  // JUNE 20 - SATURDAY
  { id: "M029", date: "2026-06-20", time: "18:00", timeET: "6:00 PM ET", group: "C", team1: "Brazil", team2: "Haiti", team1Flag: "🇧🇷", team2Flag: "🇭🇹", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Group Stage", status: "upcoming" },
  { id: "M030", date: "2026-06-20", time: "21:00", timeET: "9:00 PM ET", group: "C", team1: "Morocco", team2: "Scotland", team1Flag: "🇲🇦", team2Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", venue: "Gillette Stadium", city: "Foxborough, MA", stage: "Group Stage", status: "upcoming" },

  // JUNE 22 - MONDAY
  { id: "M031", date: "2026-06-22", time: "13:00", timeET: "1:00 PM ET", group: "J", team1: "Argentina", team2: "Austria", team1Flag: "🇦🇷", team2Flag: "🇦🇹", venue: "AT&T Stadium", city: "Dallas, TX", stage: "Group Stage", status: "upcoming" },

  // JUNE 23 - TUESDAY
  { id: "M032", date: "2026-06-23", time: "13:00", timeET: "1:00 PM ET", group: "K", team1: "Portugal", team2: "Uzbekistan", team1Flag: "🇵🇹", team2Flag: "🇺🇿", venue: "NRG Stadium", city: "Houston, TX", stage: "Group Stage", status: "upcoming" },

  // JUNE 25 - THURSDAY
  { id: "M033", date: "2026-06-25", time: "22:00", timeET: "10:00 PM ET", group: "D", team1: "United States", team2: "Turkey", team1Flag: "🇺🇸", team2Flag: "🇹🇷", venue: "SoFi Stadium", city: "Inglewood, CA", stage: "Group Stage", status: "upcoming" },

  // JUNE 26 - FRIDAY
  { id: "M034", date: "2026-06-26", time: "15:00", timeET: "3:00 PM ET", group: "I", team1: "Norway", team2: "France", team1Flag: "🇳🇴", team2Flag: "🇫🇷", venue: "Gillette Stadium", city: "Foxborough, MA", stage: "Group Stage", status: "upcoming" },
  { id: "M035", date: "2026-06-26", time: "15:00", timeET: "3:00 PM ET", group: "I", team1: "Senegal", team2: "Iraq", team1Flag: "🇸🇳", team2Flag: "🇮🇶", venue: "BMO Field", city: "Toronto, Canada", stage: "Group Stage", status: "upcoming" },
  { id: "M036", date: "2026-06-26", time: "20:00", timeET: "8:00 PM ET", group: "H", team1: "Cape Verde", team2: "Saudi Arabia", team1Flag: "🇨🇻", team2Flag: "🇸🇦", venue: "NRG Stadium", city: "Houston, TX", stage: "Group Stage", status: "upcoming" },
  { id: "M037", date: "2026-06-26", time: "20:00", timeET: "8:00 PM ET", group: "H", team1: "Uruguay", team2: "Spain", team1Flag: "🇺🇾", team2Flag: "🇪🇸", venue: "Estadio Akron", city: "Guadalajara, Mexico", stage: "Group Stage", status: "upcoming" },
  { id: "M038", date: "2026-06-26", time: "23:00", timeET: "11:00 PM ET", group: "G", team1: "Egypt", team2: "Iran", team1Flag: "🇪🇬", team2Flag: "🇮🇷", venue: "Lumen Field", city: "Seattle, WA", stage: "Group Stage", status: "upcoming" },
  { id: "M039", date: "2026-06-26", time: "23:00", timeET: "11:00 PM ET", group: "G", team1: "New Zealand", team2: "Belgium", team1Flag: "🇳🇿", team2Flag: "🇧🇪", venue: "BC Place", city: "Vancouver, Canada", stage: "Group Stage", status: "upcoming" },

  // JUNE 27 - SATURDAY
  { id: "M040", date: "2026-06-27", time: "22:00", timeET: "10:00 PM ET", group: "J", team1: "Algeria", team2: "Austria", team1Flag: "🇩🇿", team2Flag: "🇦🇹", venue: "Arrowhead Stadium", city: "Kansas City, MO", stage: "Group Stage", status: "upcoming" },
  { id: "M041", date: "2026-06-27", time: "22:00", timeET: "10:00 PM ET", group: "J", team1: "Jordan", team2: "Argentina", team1Flag: "🇯🇴", team2Flag: "🇦🇷", venue: "AT&T Stadium", city: "Dallas, TX", stage: "Group Stage", status: "upcoming" },

  // ============ ROUND OF 32 ============
  { id: "M073", date: "2026-06-28", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "Winner Group A", team2: "Runner-up Group B", team1Flag: "🏆", team2Flag: "🥈", venue: "SoFi Stadium", city: "Los Angeles, CA", stage: "Round of 32", status: "upcoming" },
  { id: "M074", date: "2026-06-28", time: "19:00", timeET: "7:00 PM ET", group: null, team1: "Winner Group B", team2: "Runner-up Group A", team1Flag: "🏆", team2Flag: "🥈", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Round of 32", status: "upcoming" },

  // ============ QUARTER FINALS ============
  { id: "M097", date: "2026-07-09", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Quarter Finals", status: "upcoming" },
  { id: "M098", date: "2026-07-10", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium", city: "Dallas, TX", stage: "Quarter Finals", status: "upcoming" },

  // ============ SEMI FINALS ============
  { id: "M101", date: "2026-07-14", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "AT&T Stadium", city: "Dallas, TX", stage: "Semi Finals", status: "upcoming" },
  { id: "M102", date: "2026-07-15", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Semi Finals", status: "upcoming" },

  // ============ THIRD PLACE ============
  { id: "M103", date: "2026-07-18", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🥉", team2Flag: "🥉", venue: "Hard Rock Stadium", city: "Miami, FL", stage: "Third Place", status: "upcoming" },

  // ============ THE FINAL ============
  { id: "M104", date: "2026-07-19", time: "15:00", timeET: "3:00 PM ET", group: null, team1: "TBD", team2: "TBD", team1Flag: "🏆", team2Flag: "🏆", venue: "MetLife Stadium", city: "East Rutherford, NJ", stage: "Final", status: "upcoming", isFinal: true },
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
