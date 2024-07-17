# wca-data-export

This repository contains scripts for exporting data related to Madagascar from the World Cube Association (WCA) [database](https://www.worldcubeassociation.org/export/results).

The extracted data are stored in the [data](./data) directory and the schemas are described bellow using TypeScript:

```typescript
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

type Gender = "f" | "m";

type Person = {
  wcaId: string;
  name: string;
  gender: Gender;
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
```
