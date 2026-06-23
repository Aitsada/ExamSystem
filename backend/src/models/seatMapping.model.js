import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM SeatMapping");
  return result;
}

export async function findHistory() {
  const [result] = await db.query(
    `SELECT
       Exam.ID AS ExamID,
       Exam.OrganizationID,
       Organization.Name AS OrganizationName,
       Exam.Name AS ExamName,
       Exam.StatusID,
       Exam.StartDateTime,
       Exam.EndDateTime,
       Facility.ID AS FacilityID,
       Facility.Name AS FacilityName,
       Facility.DisplayName AS FacilityDisplayName,
       COUNT(SeatMapping.ID) AS ApplicantCount
     FROM SeatMapping
     INNER JOIN Applicant ON SeatMapping.ApplicantID = Applicant.ID
     INNER JOIN Position ON Applicant.PositionID = Position.ID
     INNER JOIN Exam ON Position.ExamID = Exam.ID
     INNER JOIN Organization ON Exam.OrganizationID = Organization.ID
     INNER JOIN Seat ON SeatMapping.SeatID = Seat.ID
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     INNER JOIN Room ON SeatRow.RoomID = Room.ID
     INNER JOIN Floor ON Room.FloorID = Floor.ID
     INNER JOIN Building ON Floor.BuildingID = Building.ID
     INNER JOIN Facility ON Building.FacilityID = Facility.ID
     GROUP BY
       Exam.ID,
       Exam.OrganizationID,
       Organization.Name,
       Exam.Name,
       Exam.StatusID,
       Exam.StartDateTime,
       Exam.EndDateTime,
       Facility.ID,
       Facility.Name,
       Facility.DisplayName
     ORDER BY Exam.StartDateTime DESC, Exam.ID DESC, Facility.Name ASC`,
  );
  return result;
}

export async function findSummaryMeta(ExamID, FacilityID) {
  const [result] = await db.query(
    `SELECT
       Exam.ID AS ExamID,
       Exam.Name AS ExamName,
       Exam.StartDateTime,
       Exam.EndDateTime,
       Organization.ID AS OrganizationID,
       Organization.Name AS OrganizationName,
       Facility.ID AS FacilityID,
       Facility.Name AS FacilityName,
       Facility.DisplayName AS FacilityDisplayName
     FROM Exam
     INNER JOIN Organization ON Exam.OrganizationID = Organization.ID
     INNER JOIN Facility ON Facility.ID = ?
     WHERE Exam.ID = ?`,
    [FacilityID, ExamID],
  );
  return result[0] || null;
}

export async function findSummaryRows(ExamID, FacilityID) {
  const [result] = await db.query(
    `SELECT
       Position.ID AS PositionID,
       Position.Name AS PositionName,
       Applicant.ApplicantNumber,
       Building.Name AS BuildingName,
       Floor.Number AS FloorNumber,
       Floor.Name AS FloorName,
       Room.ID AS RoomID,
       Room.Name AS RoomName,
       Room.No AS RoomNo
     FROM SeatMapping
     INNER JOIN Applicant ON SeatMapping.ApplicantID = Applicant.ID
     INNER JOIN Position ON Applicant.PositionID = Position.ID
     INNER JOIN Exam ON Position.ExamID = Exam.ID
     INNER JOIN Seat ON SeatMapping.SeatID = Seat.ID
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     INNER JOIN Room ON SeatRow.RoomID = Room.ID
     INNER JOIN Floor ON Room.FloorID = Floor.ID
     INNER JOIN Building ON Floor.BuildingID = Building.ID
     WHERE Exam.ID = ?
       AND Building.FacilityID = ?
     ORDER BY
       Position.ID,
       Building.Name,
       Floor.Number,
       Floor.Name,
       Room.Name,
       Room.No,
       CAST(Applicant.ApplicantNumber AS UNSIGNED),
       Applicant.ApplicantNumber,
       Applicant.ID`,
    [ExamID, FacilityID],
  );
  return result;
}

export async function findApplicantsByPositionID(PositionID, conn = db) {
  const [result] = await conn.query(
    "SELECT * FROM Applicant WHERE PositionID = ? ORDER BY CAST(ApplicantNumber AS UNSIGNED), ID",
    [PositionID],
  );
  return result;
}

export async function findAvailableSeatsByRoomIDs(RoomIDs, conn = db) {
  if (!RoomIDs.length) {
    return [];
  }

  const roomPlaceholders = RoomIDs.map(() => "?").join(",");
  const [result] = await conn.query(
    `SELECT Seat.*
     FROM Seat
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     LEFT JOIN SeatMapping ON Seat.ID = SeatMapping.SeatID
     WHERE SeatRow.RoomID IN (${roomPlaceholders})
       AND SeatMapping.ID IS NULL
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
    `SELECT * FROM Room WHERE ID IN (${RoomIDs.map(() => "?").join(",")})`,
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

export async function findPositionRoomMappingCounts(RoomIDs = []) {
  const normalizedRoomIDs = RoomIDs
    .map((RoomID) => Number(RoomID))
    .filter((RoomID) => Number.isInteger(RoomID) && RoomID > 0);
  const where = normalizedRoomIDs.length
    ? `WHERE SeatRow.RoomID IN (${normalizedRoomIDs.map(() => "?").join(",")})`
    : "";

  const [result] = await db.query(
    `SELECT Applicant.PositionID, SeatRow.RoomID, COUNT(SeatMapping.ID) AS ApplicantCount
     FROM SeatMapping
     INNER JOIN Applicant ON SeatMapping.ApplicantID = Applicant.ID
     INNER JOIN Seat ON SeatMapping.SeatID = Seat.ID
     INNER JOIN SeatRow ON Seat.SeatRowID = SeatRow.ID
     ${where}
     GROUP BY Applicant.PositionID, SeatRow.RoomID`,
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
