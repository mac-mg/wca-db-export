import type {
  Medals,
  MergedRecordEntry,
  RecordEntry,
  WcaEvent,
} from "./types.ts";

function generateMedals(finalists: { wcaId: string; pos: string }[]) {
  const medalsMap = new Map<string, Medals>();

  for (const finalist of finalists) {
    const medals = { gold: 0, silver: 0, bronze: 0 };
    const pos = finalist.pos.split(",");

    for (const value of pos) {
      if (value === "1") medals.gold += 1;
      else if (value === "2") medals.silver += 1;
      else if (value === "3") medals.bronze += 1;
    }

    medalsMap.set(finalist.wcaId, medals);
  }

  return medalsMap;
}

function mergeRecords(singles: RecordEntry[], averages: RecordEntry[]) {
  const recordsMap = new Map<WcaEvent, MergedRecordEntry>();

  for (const single of singles) {
    const { eventId } = single;
    const entry = recordsMap.get(eventId);

    if (entry) {
      entry.single.push(single);
    } else {
      recordsMap.set(eventId, { single: [single], average: [] });
    }
  }

  for (const average of averages) {
    const { eventId } = average;
    const entry = recordsMap.get(eventId);

    if (entry) {
      entry.average.push(average);
    } else {
      recordsMap.set(eventId, { single: [], average: [average] });
    }
  }

  return Object.fromEntries(recordsMap);
}

export { generateMedals, mergeRecords };
