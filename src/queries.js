const persons = `
  SELECT
    id AS wcaId,
    name,
    gender
  FROM Persons
  WHERE countryId = "Madagascar"
`;

const finalists = `
  SELECT
    Persons.id AS wcaId,
    GROUP_CONCAT(Results.pos) AS pos
  FROM Persons
  JOIN Results ON Results.personId = Persons.id
  JOIN RoundTypes ON Results.roundTypeId = RoundTypes.id
  WHERE Persons.countryId = "Madagascar"
    AND RoundTypes.final = 1
    AND Results.pos <= 3
  GROUP BY Persons.id
`;

const recordCounts = `
  SELECT 
    Persons.id AS wcaId,
    COUNT(Persons.id) AS count
  FROM Persons
  JOIN Results ON Results.personId = Persons.id
  WHERE Persons.countryId = "Madagascar"
    AND (Results.regionalSingleRecord IS NOT NULL OR Results.regionalAverageRecord IS NOT NULL)
  GROUP BY Persons.id
`;

const ranking = `
  SELECT
    Ranks.eventId,
    Ranks.best AS time,
    Ranks.countryRank AS \`rank\`,
    Persons.id AS wcaId,
    Persons.name,
    Persons.gender
  FROM Ranks[?] AS Ranks
  JOIN Persons ON Persons.id = Ranks.personId
  WHERE Persons.countryId = "Madagascar"
`;

const records = `
  SELECT
    Ranks.eventId,
    Ranks.best AS time,
    Persons.id AS wcaId,
    Persons.name
  FROM Ranks[?] AS Ranks
  JOIN Persons ON Persons.id = Ranks.personId
  WHERE Persons.countryId = "Madagascar" AND Ranks.countryRank = 1
`;

const singleRanking = ranking.replace("[?]", "Single");
const averageRanking = ranking.replace("[?]", "Average");
const singleRecords = records.replace("[?]", "Single");
const averageRecords = records.replace("[?]", "Average");

export {
  persons,
  finalists,
  recordCounts,
  singleRanking,
  averageRanking,
  singleRecords,
  averageRecords,
};
