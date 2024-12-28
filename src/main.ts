import Repositry from "./repository.ts";
import { generateMedals, mergeRecords } from "./utils.ts";
import { createConnection } from "npm:mysql2/promise";

console.log("Connecting to database...");

const conn = await createConnection({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
});

const repository = new Repositry(conn);

console.log("Fetching persons...");

const personsRaw = await repository.getPersons();

console.log("Fetching finalists...");

const finalists = await repository.getFinalists();
const medalsMap = generateMedals(finalists);

console.log("Fetching record counts...");

const recordCounts = await repository.getRecordCounts();

const recordCountMap = new Map<string, number>();

for (const record of recordCounts) {
  recordCountMap.set(record.wcaId, record.count);
}

const persons = personsRaw.map((data) => ({
  ...data,
  medals: medalsMap.get(data.wcaId) ?? { gold: 0, silver: 0, bronze: 0 },
  records: recordCountMap.get(data.wcaId) ?? 0,
}));

console.log("Fetching rankings...");

const singleRanking = await repository.getRanking({ type: "Single" });
const averageRanking = await repository.getRanking({ type: "Average" });

console.log("Fetching records...");

const singleRecords = await repository.getRecords({ type: "Single" });
const averageRecords = await repository.getRecords({ type: "Average" });
const records = mergeRecords(singleRecords, averageRecords);

console.log("Writing JSON files...");

Deno.mkdirSync("data", { recursive: true });
Deno.writeTextFileSync("data/persons.json", JSON.stringify(persons));
Deno.writeTextFileSync("data/singles.json", JSON.stringify(singleRanking));
Deno.writeTextFileSync("data/averages.json", JSON.stringify(averageRanking));
Deno.writeTextFileSync("data/records.json", JSON.stringify(records));

console.log("Closing database connection...");

await repository.closeConnection();

console.log("Done!");
