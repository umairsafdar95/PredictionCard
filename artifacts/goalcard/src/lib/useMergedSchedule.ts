import { useState, useEffect } from "react";
import schedule, { type ScheduleMatch } from "@/data/schedule";
import { fetchEspnKnockoutMatches, type EspnKnockoutMatch } from "@/lib/espn";

/* ── Module-level cache: shared across all components ── */
let cached: ScheduleMatch[] | null = null;
let lastFetch = 0;
const TTL = 5 * 60 * 1000; // 5 minutes

/* ── Merge ESPN data over local schedule ── */
function merge(
  local: ScheduleMatch[],
  espn: EspnKnockoutMatch[]
): ScheduleMatch[] {
  if (espn.length === 0) return local;
  const used = new Set<number>();
  const result: ScheduleMatch[] = [];

  for (const m of local) {
    if (m.group !== null) {
      result.push(m);
      continue;
    }

    // Priority 1: stage + date + time
    let idx = espn.findIndex(
      (e, i) =>
        !used.has(i) &&
        e.stage === m.stage &&
        e.date === m.date &&
        e.time === m.time
    );
    // Priority 2: stage + date + venue
    if (idx === -1)
      idx = espn.findIndex(
        (e, i) =>
          !used.has(i) &&
          e.stage === m.stage &&
          e.date === m.date &&
          e.venue === m.venue
      );
    // Priority 3: stage + date only
    if (idx === -1)
      idx = espn.findIndex(
        (e, i) => !used.has(i) && e.stage === m.stage && e.date === m.date
      );

    if (idx !== -1) {
      used.add(idx);
      const e = espn[idx];
      result.push({
        ...m,
        team1: e.team1,
        team2: e.team2,
        team1Flag: e.team1Flag,
        team2Flag: e.team2Flag,
        status: e.status,
        ...(e.isFinal ? { isFinal: true } : {}),
      });
    } else {
      result.push(m);
    }
  }

  // Add ESPN matches not in local schedule
  for (let i = 0; i < espn.length; i++) {
    if (used.has(i)) continue;
    const e = espn[i];
    result.push({
      id: `espn-${e.date}-${e.time}`,
      date: e.date,
      time: e.time,
      timeET: e.timeET,
      group: null,
      team1: e.team1,
      team2: e.team2,
      team1Flag: e.team1Flag,
      team2Flag: e.team2Flag,
      venue: e.venue,
      city: e.city,
      stage: e.stage,
      status: e.status,
      isFinal: e.isFinal,
    });
  }

  return result;
}

/* ── Shared hook ── */
export function useMergedSchedule(): ScheduleMatch[] {
  const [list, setList] = useState<ScheduleMatch[]>(cached || schedule);

  useEffect(() => {
    // Use cache if fresh
    if (cached && Date.now() - lastFetch < TTL) {
      setList(cached);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const espn = await fetchEspnKnockoutMatches();
        if (cancelled) return;
        cached = merge(schedule, espn);
        lastFetch = Date.now();
        setList(cached);
        console.log(
          `📡 Merged schedule: ${espn.length} ESPN matches, ${cached.filter(m => m.group === null && !m.team1.includes("TBD")).length} real knockout teams`
        );
      } catch {
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