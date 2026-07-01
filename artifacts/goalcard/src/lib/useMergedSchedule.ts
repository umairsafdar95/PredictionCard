import { useState, useEffect } from "react";
import schedule, { type ScheduleMatch } from "@/data/schedule";
import {
  fetchEspnKnockoutMatches,
  type EspnKnockoutMatch,
} from "@/lib/espn";

let cached: ScheduleMatch[] | null = null;
let lastFetch = 0;
const TTL = 5 * 60 * 1000; // 5 minutes

/*
  New merge strategy — much simpler than before.

  OLD: tried to match ESPN matches to local TBD placeholders
  by date + time + venue. ALL wrong in placeholders → always failed.

  NEW:
  1. Keep all group stage matches from local schedule (unchanged)
  2. If ESPN has data for a stage → use ESPN matches for that stage
     (real teams, real venues, real times from ESPN)
  3. If ESPN has no data for a stage yet (future rounds) →
     keep local TBD placeholders for those stages
  4. Sort everything by date then time
*/
function merge(
  local: ScheduleMatch[],
  espn: EspnKnockoutMatch[]
): ScheduleMatch[] {

  // Group stage always comes from local schedule — never changes
  const groupStage = local.filter(m => m.group !== null);

  if (espn.length === 0) {
    // ESPN returned nothing — keep full local schedule including TBDs
    return local;
  }

  // Which knockout stages does ESPN have data for?
  const espnStages = new Set(espn.map(e => e.stage));

  // Convert ESPN knockout matches to ScheduleMatch format
  const espnMatches: ScheduleMatch[] = espn.map((e, i) => ({
    id:        `espn-${i}-${e.date}-${e.time}`,
    date:      e.date,
    time:      e.time,
    timeET:    e.timeET,
    group:     null,
    team1:     e.team1,
    team2:     e.team2,
    team1Flag: e.team1Flag,
    team2Flag: e.team2Flag,
    venue:     e.venue,
    city:      e.city,
    stage:     e.stage,
    status:    e.status,
    isFinal:   e.isFinal,
  }));

  // For stages ESPN doesn't know about yet (future rounds),
  // keep the local TBD placeholders
  const futureTBDs = local.filter(
    m => m.group === null && !espnStages.has(m.stage)
  );

  // Combine all three parts and sort by date then time
  const combined = [...groupStage, ...espnMatches, ...futureTBDs];
  combined.sort((a, b) => {
    const da = `${a.date}T${a.time}`;
    const db = `${b.date}T${b.time}`;
    return da < db ? -1 : da > db ? 1 : 0;
  });

  return combined;
}

export function useMergedSchedule(): ScheduleMatch[] {
  const [list, setList] = useState<ScheduleMatch[]>(cached || schedule);

  useEffect(() => {
    if (cached && Date.now() - lastFetch < TTL) {
      setList(cached);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const espn = await fetchEspnKnockoutMatches();
        if (cancelled) return;
        cached    = merge(schedule, espn);
        lastFetch = Date.now();
        setList(cached);
        console.log(
          `✅ Merged: ${espn.length} ESPN matches,`,
          `${cached.filter(m => m.group === null && m.team1 !== "TBD").length}`,
          `knockout slots with real teams`
        );
      } catch (err) {
        console.error("useMergedSchedule failed:", err);
        if (!cancelled && !cached) setList(schedule);
      }
    };

    load();
    const interval = setInterval(load, TTL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return list;
}