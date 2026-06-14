// Re-exports schedule data in the legacy Match shape used by FormPage & PreviewPage.
// Source of truth is schedule.ts (ESPN-verified).
import schedule from "@/data/schedule";

export interface Match {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  group: string;
}

const matches: Match[] = schedule
  .filter((m) => m.group !== null)
  .map((m, i) => ({
    id: i + 1,
    team1: m.team1,
    team2: m.team2,
    date: m.date,
    time: m.timeET,
    group: m.group as string,
  }));

export default matches;

export const getTodaysMatches = (): Match[] => {
  const today = new Date().toISOString().split("T")[0];
  return matches.filter((m) => m.date === today);
};

export const getMatchById = (id: number): Match | undefined =>
  matches.find((m) => m.id === id);
