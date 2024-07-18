import fs from "fs";
import { env } from "process";
import { createConnection } from "mysql2/promise";
import * as queries from "./queries.js";

console.log("Connecting to database...");

const conn = await createConnection({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

console.log("Fetching persons...");

const [persons] = await conn.query(queries.persons);

console.log("Fetching finalists...");

const [finalists] = await conn.query(queries.finalists);

const medalsMap = {};

for (const finalist of finalists) {
  const medals = { gold: 0, silver: 0, bronze: 0 };
  const pos = finalist.pos.split(",");

  for (const value of pos) {
    if (value === "1") medals.gold += 1;
    if (value === "2") medals.silver += 1;
    if (value === "3") medals.bronze += 1;
  }

  medalsMap[finalist.wcaId] = medals;
}

console.log("Fetching record counts...");

const [recordCounts] = await conn.query(queries.recordCounts);

const recordCountMap = {};

for (const record of recordCounts) {
  recordCountMap[record.wcaId] = record.count;
}

for (const person of persons) {
  person.medals = medalsMap[person.wcaId] ?? { gold: 0, silver: 0, bronze: 0 };
  person.records = recordCountMap[person.wcaId] ?? 0;
}

console.log("Fetching single ranking...");

const [singleRanking] = await conn.query(queries.singleRanking);

console.log("Fetching average ranking...");

const [averageRanking] = await conn.query(queries.averageRanking);

console.log("Fetching best singles...");

const [singleRecords] = await conn.query(queries.singleRecords);

console.log("Fetching best averages...");

const [averageRecords] = await conn.query(queries.averageRecords);

const records = {};

for (const single of singleRecords) {
  const { eventId } = single;

  if (!records[eventId]) {
    records[eventId] = { single: [] };
  }

  records[eventId].single.push(single);
}

for (const average of averageRecords) {
  const { eventId } = average;

  if (!records[eventId].average) {
    records[eventId].average = [];
  }

  records[eventId].average.push(average);
}

console.log("Writing JSON files...");

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

fs.writeFileSync("data/persons.json", JSON.stringify(persons));
fs.writeFileSync("data/singles.json", JSON.stringify(singleRanking));
fs.writeFileSync("data/averages.json", JSON.stringify(averageRanking));
fs.writeFileSync("data/records.json", JSON.stringify(records));

console.log("Closing database connection...");

await conn.end();

console.log("Done!");
