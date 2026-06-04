export interface Match {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  group: string;
}

const matches: Match[] = [
  { id: 1, team1: "Mexico", team2: "South Africa", date: "2026-06-11", time: "3:00 PM ET", group: "A" },
  { id: 2, team1: "South Korea", team2: "Czechia", date: "2026-06-11", time: "9:00 PM ET", group: "A" },
  { id: 3, team1: "Canada", team2: "Bosnia & Herzegovina", date: "2026-06-12", time: "3:00 PM ET", group: "B" },
  { id: 4, team1: "United States", team2: "Paraguay", date: "2026-06-12", time: "6:00 PM ET", group: "D" },
  { id: 5, team1: "Belgium", team2: "Egypt", date: "2026-06-12", time: "9:00 PM ET", group: "B" },
  { id: 6, team1: "Argentina", team2: "Chile", date: "2026-06-13", time: "3:00 PM ET", group: "C" },
  { id: 7, team1: "France", team2: "Algeria", date: "2026-06-13", time: "6:00 PM ET", group: "E" },
  { id: 8, team1: "Germany", team2: "Turkey", date: "2026-06-13", time: "9:00 PM ET", group: "F" },
  { id: 9, team1: "Brazil", team2: "Uruguay", date: "2026-06-14", time: "3:00 PM ET", group: "G" },
  { id: 10, team1: "Spain", team2: "Morocco", date: "2026-06-14", time: "6:00 PM ET", group: "H" },
  { id: 11, team1: "England", team2: "Serbia", date: "2026-06-14", time: "9:00 PM ET", group: "I" },
  { id: 12, team1: "Portugal", team2: "Tunisia", date: "2026-06-15", time: "3:00 PM ET", group: "J" },
  { id: 13, team1: "Netherlands", team2: "Senegal", date: "2026-06-15", time: "6:00 PM ET", group: "K" },
  { id: 14, team1: "Japan", team2: "Indonesia", date: "2026-06-15", time: "9:00 PM ET", group: "L" },
  { id: 15, team1: "Colombia", team2: "Switzerland", date: "2026-06-16", time: "3:00 PM ET", group: "A" },
  { id: 16, team1: "Denmark", team2: "Jordan", date: "2026-06-16", time: "6:00 PM ET", group: "B" },
  { id: 17, team1: "Nigeria", team2: "Qatar", date: "2026-06-16", time: "9:00 PM ET", group: "C" },
  { id: 18, team1: "Austria", team2: "Slovenia", date: "2026-06-17", time: "3:00 PM ET", group: "D" },
  { id: 19, team1: "Ukraine", team2: "Poland", date: "2026-06-17", time: "6:00 PM ET", group: "E" },
  { id: 20, team1: "Ivory Coast", team2: "Jamaica", date: "2026-06-17", time: "9:00 PM ET", group: "F" },
  { id: 21, team1: "Saudi Arabia", team2: "Cabo Verde", date: "2026-06-18", time: "3:00 PM ET", group: "G" },
  { id: 22, team1: "Australia", team2: "New Zealand", date: "2026-06-18", time: "6:00 PM ET", group: "H" },
  { id: 23, team1: "Iraq", team2: "Uzbekistan", date: "2026-06-18", time: "9:00 PM ET", group: "I" },
  { id: 24, team1: "Honduras", team2: "Panama", date: "2026-06-19", time: "3:00 PM ET", group: "J" },
  { id: 25, team1: "United States", team2: "Canada", date: "2026-06-19", time: "6:00 PM ET", group: "D" },
  { id: 26, team1: "Argentina", team2: "Brazil", date: "2026-06-20", time: "6:00 PM ET", group: "G" },
  { id: 27, team1: "France", team2: "England", date: "2026-06-20", time: "9:00 PM ET", group: "E" },
  { id: 28, team1: "Germany", team2: "Spain", date: "2026-06-21", time: "9:00 PM ET", group: "F" },
  { id: 29, team1: "Portugal", team2: "Netherlands", date: "2026-06-22", time: "6:00 PM ET", group: "K" },
  { id: 30, team1: "Japan", team2: "South Korea", date: "2026-06-22", time: "9:00 PM ET", group: "A" },
];

export default matches;

export const getTodaysMatches = (): Match[] => {
  const today = new Date().toISOString().split("T")[0];
  return matches.filter((m) => m.date === today);
};

export const getMatchById = (id: number): Match | undefined =>
  matches.find((m) => m.id === id);
