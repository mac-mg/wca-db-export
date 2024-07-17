import fs from "fs";
import { env } from "process";
import { createConnection } from "mysql2/promise";

console.log("Connecting to database...");

const conn = await createConnection({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

const personQuery = `
  SELECT
    id as wcaId,
    name,
    gender
  FROM Persons
  WHERE countryId = "Madagascar"
`;

const rankingQuery = `
  SELECT
    Ranks.eventId,
    Ranks.best as time,
    Ranks.countryRank as \`rank\`,
    Persons.id as wcaId,
    Persons.name,
    Persons.gender
  FROM Ranks<?> as Ranks
  JOIN Persons ON Persons.id = Ranks.personId
  WHERE Persons.countryId = "Madagascar"
`;

const recordQuery = `
  SELECT
    Ranks.eventId,
    MIN(best) as time,
    ANY_VALUE(Persons.id) as wcaId,
    ANY_VALUE(Persons.name) as name
  FROM Ranks<?> as Ranks
  JOIN Persons ON Persons.id = Ranks.personId
  WHERE Persons.countryId = "Madagascar"
  GROUP BY Ranks.eventId
`;

console.log("Fetching persons...");

const [persons] = await conn.query(personQuery);

console.log("Fetching single ranking...");

const [singleRanking] = await conn.query(rankingQuery.replace("<?>", "Single"));

console.log("Fetching average ranking...");

const [avgRanking] = await conn.query(rankingQuery.replace("<?>", "Average"));

console.log("Fetching best singles...");

const [singleRecords] = await conn.query(recordQuery.replace("<?>", "Single"));

console.log("Fetching best averages...");

const [avgRecords] = await conn.query(recordQuery.replace("<?>", "Average"));

const records = { single: singleRecords, average: avgRecords };

console.log("Writing JSON files...");

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

fs.writeFileSync("data/persons.json", JSON.stringify(persons));
fs.writeFileSync("data/singles.json", JSON.stringify(singleRanking));
fs.writeFileSync("data/averages.json", JSON.stringify(avgRanking));
fs.writeFileSync("data/records.json", JSON.stringify(records));

console.log("Closing database connection...");

await conn.end();

console.log("Done!");
