import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM SeatMapping");
  return result;
}

export async function findApplicantsByPositionID(PositionID, conn = db) {
  const [result] = await conn.query(
    "SELECT * FROM Applicant WHERE PositionID = ? ORDER BY CAST(ApplicantNumber AS UNSIGNED), ID",
    [PositionID],
  );
  return result;
}

export async function findSeatsByRoomIDs(RoomIDs, conn = db) {
  if (!RoomIDs.length) {
    return [];
  }

  const roomPlaceholders = RoomIDs.map(() => "?").join(",");
  const [result] = await conn.query(
    `SELECT Seat.*
     FROM Seat
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     WHERE SeatRow.RoomID IN (${roomPlaceholders})
     ORDER BY FIELD(SeatRow.RoomID, ${roomPlaceholders}), SeatRow.Name, LENGTH(Seat.Name), Seat.Name`,
    [...RoomIDs, ...RoomIDs],
  );
  return result;
}

export async function deleteByApplicantIDsOrSeatIDs(ApplicantIDs, SeatIDs, conn = db) {
  if (!ApplicantIDs.length && !SeatIDs.length) {
    return { affectedRows: 0 };
  }

  const where = [];
  const params = [];

  if (ApplicantIDs.length) {
    where.push(`ApplicantID IN (${ApplicantIDs.map(() => "?").join(",")})`);
    params.push(...ApplicantIDs);
  }
  if (SeatIDs.length) {
    where.push(`SeatID IN (${SeatIDs.map(() => "?").join(",")})`);
    params.push(...SeatIDs);
  }

  const [result] = await conn.query(
    `DELETE FROM SeatMapping WHERE ${where.join(" OR ")}`,
    params,
  );
  return result;
}

export async function createMany(mappings, conn = db) {
  if (!mappings.length) {
    return { affectedRows: 0 };
  }

  const [result] = await conn.query(
    "INSERT INTO SeatMapping (SeatID, ApplicantID) VALUES ?",
    [mappings.map((mapping) => [mapping.SeatID, mapping.ApplicantID])],
  );
  return result;
}

export async function Create(SeatID, ApplicantID) {
  const [result] = await db.query("INSERT INTO SeatMapping (SeatID, ApplicantID) VALUES (?, ?)", [SeatID, ApplicantID]);
  return result;
}
