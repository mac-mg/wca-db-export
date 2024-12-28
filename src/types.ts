type WcaEvent =
  | "222"
  | "333"
  | "333bf"
  | "333fm"
  | "333mbf"
  | "333oh"
  | "444"
  | "444bf"
  | "555"
  | "555bf"
  | "666"
  | "777"
  | "clock"
  | "minx"
  | "pyram"
  | "skewb"
  | "sq1";

type Gender = "m" | "f";
type RankingType = "Single" | "Average";

type Medals = {
  gold: number;
  silver: number;
  bronze: number;
};

type Person = {
  wcaId: string;
  name: string;
  gender: Gender;
  records: number;
  medals: Medals;
};

type RankEntry = {
  eventId: WcaEvent;
  rank: number;
  time: number;
  wcaId: string;
  name: string;
  gender: Gender;
};

type RecordEntry = {
  eventId: WcaEvent;
  time: number;
  wcaId: string;
  name: string;
};

type MergedRecordEntry = {
  single: RecordEntry[];
  average: RecordEntry[];
};

type Records = { [key in WcaEvent]: MergedRecordEntry | null };

export type {
  Gender,
  Medals,
  MergedRecordEntry,
  Person,
  RankEntry,
  RankingType,
  RecordEntry,
  Records,
  WcaEvent,
};
