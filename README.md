# wca-data-export

[![Export](https://github.com/mac-mg/wca-db-export/actions/workflows/export.yml/badge.svg)]([https://github.com/mac-mg/wca-db-export/actions/workflows/export.yml](https://github.com/mac-mg/wca-db-export/actions/workflows/export.yml))

This repository contains scripts for exporting data related to Madagascar from
the [World Cube Association](https://www.worldcubeassociation.org/)'s
[database](https://www.worldcubeassociation.org/export/results).

The extracted data are stored in the [data](./data) directory and it contains
the follwing files:

- [persons.json](./data/persons.json): contains the list of all cubers from
  Madagascar.
- [averages.json](./data/averages.json): contains the average times for all
  events.
- [singles.json](./data/singles.json): contains the single times for all events.
- [records.json](./data/records.json): contains the local records for single and
  average times.

## Schemas

Objects type definitions using Typescript:

<details>
<summary>WcaEvent</summary><br>

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
```

</details>

<details>
<summary>persons.json</summary><br>

The file is made of an array of `Person` as described bellow:

```typescript
type Person = {
  wcaId: string;
  name: string;
  gender: "m" | "f";
  records: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
};
```

</details>

<details>
<summary>singles.json</summary><br>

The file is made of an array of `RankEntry` as described bellow:

```typescript
type RankEntry = {
  eventId: WcaEvent;
  rank: number;
  time: number;
  wcaId: string;
  name: string;
  gender: "m" | "f";
};
```

</details>

<details>
<summary>averages.json</summary><br>

The file is made of an array of `RankEntry` as described bellow:

```typescript
type RankEntry = {
  eventId: WcaEvent;
  rank: number;
  time: number;
  wcaId: string;
  name: string;
  gender: "m" | "f";
};
```

</details>

<details>
<summary>records.json</summary><br>

The file is described by the `Records` object bellow:

```typescript
type Records = {
  [key in WcaEvent]: {
    single: RecordEntry[];
    average: RecordEntry[];
  } | null;
};

type RecordEntry = {
  eventId: WcaEvent;
  time: number;
  wcaId: string;
  name: string;
};
```

</details>
