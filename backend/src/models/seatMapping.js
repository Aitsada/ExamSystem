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

export async function findRoomsByIDs(RoomIDs, conn = db) {
  if (!RoomIDs.length) {
    return [];
  }

  const [result] = await conn.query(
    `SELECT * FROM Room WHERE ID IN (${RoomIDs.map(() => "?").join(",")}) AND IsActive = 1`,
    RoomIDs,
  );
  return result;
}

export async function findSeatRowsByRoomIDs(RoomIDs, conn = db) {
  if (!RoomIDs.length) {
    return [];
  }

  const [result] = await conn.query(
    `SELECT * FROM SeatRow WHERE RoomID IN (${RoomIDs.map(() => "?").join(",")})`,
    RoomIDs,
  );
  return result;
}

export async function findSeatNamesBySeatRowID(SeatRowID, conn = db) {
  const [result] = await conn.query(
    "SELECT Name FROM Seat WHERE SeatRowID = ?",
    [SeatRowID],
  );
  return result.map((seat) => seat.Name);
}

export async function createSeatRow(RoomID, Name, conn = db) {
  const [result] = await conn.query(
    "INSERT INTO SeatRow (RoomID, CreatedBy, Name, Description) VALUES (?, ?, ?, ?)",
    [RoomID, "Admin", Name, ""],
  );
  return result.insertId;
}

export async function createSeat(SeatRowID, Name, conn = db) {
  const [result] = await conn.query(
    "INSERT INTO Seat (SeatRowID, CreatedBy, Name, Description) VALUES (?, ?, ?, ?)",
    [SeatRowID, "Admin", Name, ""],
  );
  return result.insertId;
}

export async function findRoomMappingCounts(RoomIDs = []) {
  const normalizedRoomIDs = RoomIDs
    .map((RoomID) => Number(RoomID))
    .filter((RoomID) => Number.isInteger(RoomID) && RoomID > 0);
  const where = normalizedRoomIDs.length
    ? `WHERE SeatRow.RoomID IN (${normalizedRoomIDs.map(() => "?").join(",")})`
    : "";

  const [result] = await db.query(
    `SELECT SeatRow.RoomID, COUNT(SeatMapping.ID) AS ApplicantCount
     FROM SeatMapping
     INNER JOIN Seat ON SeatMapping.SeatID = Seat.ID
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     ${where}
     GROUP BY SeatRow.RoomID`,
    normalizedRoomIDs,
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
