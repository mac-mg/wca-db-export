import { Connection, RowDataPacket } from "npm:mysql2/promise";
import type { Gender, RankEntry, RankingType } from "./types.ts";

class Repositry {
  constructor(private conn: Connection) {}

  private async query<T>(sql: string): Promise<T> {
    const [rows] = await this.conn.query<T & RowDataPacket[]>(sql);
    return rows;
  }

  getPersons() {
    return this.query<{ wcaId: string; name: string; gender: Gender }[]>(`
      SELECT
        id AS wcaId,
        name,
        gender
      FROM
        Persons
      WHERE countryId = "Madagascar"
    `);
  }

  getFinalists() {
    return this.query<{ wcaId: string; pos: string }[]>(`
      SELECT
        Persons.id AS wcaId,
        GROUP_CONCAT(Results.pos) AS pos
      FROM
        Persons
      JOIN
        Results ON Results.personId = Persons.id
      JOIN
        RoundTypes ON Results.roundTypeId = RoundTypes.id
      WHERE
        Persons.countryId = "Madagascar"
        AND RoundTypes.final = 1
        AND Results.pos <= 3
      GROUP BY Persons.id
    `);
  }

  getRecordCounts() {
    return this.query<{ wcaId: string; count: number }[]>(`
      SELECT 
        Persons.id AS wcaId,
        COUNT(Persons.id) AS count
      FROM
        Persons
      JOIN
        Results ON Results.personId = Persons.id
      WHERE
        Persons.countryId = "Madagascar"
        AND (
          Results.regionalSingleRecord IS NOT NULL
          OR Results.regionalAverageRecord IS NOT NULL
        )
      GROUP BY
        Persons.id
    `);
  }

  getRanking({ type }: { type: RankingType }) {
    return this.query<RankEntry[]>(`
      SELECT
        Ranks.eventId,
        Ranks.best AS time,
        Ranks.countryRank AS \`rank\`,
        Persons.id AS wcaId,
        Persons.name,
        Persons.gender
      FROM
        Ranks${type} AS Ranks
      JOIN
        Persons ON Persons.id = Ranks.personId
      WHERE
        Persons.countryId = "Madagascar"
      ORDER BY
        Ranks.eventId, \`rank\`, Persons.name
    `);
  }

  getRecords({ type }: { type: RankingType }) {
    return this.query<RankEntry[]>(`
      SELECT
        Ranks.eventId,
        Ranks.best AS time,
        Persons.id AS wcaId,
        Persons.name
      FROM
        Ranks${type} AS Ranks
      JOIN
        Persons ON Persons.id = Ranks.personId
      WHERE
        Persons.countryId = "Madagascar" AND Ranks.countryRank = 1
      ORDER BY
        Ranks.eventId, time, Persons.name
    `);
  }

  closeConnection() {
    return this.conn.end();
  }
}

export default Repositry;
