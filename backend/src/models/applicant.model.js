import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Applicant");
  return result;
}

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Applicant WHERE ID = ?", [id]);
  return result[0];
}

export async function findByPositionID(PositionID) {
  const [result] = await db.query(
    "SELECT * FROM Applicant WHERE PositionID = ?",
    [PositionID],
  );
  return result;
}

export async function create(PositionID, data) {
  const [result] = await db.query(
    "INSERT INTO Applicant (CreatedBy, PositionID, Prefix, FirstName, LastName, ApplicantNumber, CitizenNumber, SeatRow) VALUES (?,?,?,?,?,?,?,?)",
    [
      data.CreatedBy ?? "Ait",
      PositionID,
      data.Prefix,
      data.FirstName,
      data.LastName,
      data.ApplicantNumber,
      data.CitizenNumber,
      data.SeatRow,
    ],
  );
  return result;
}

export async function updatePositionNumber(PositionID) {
  const [result] = await db.query(
    "UPDATE `Position` SET Number = (SELECT COUNT(*) FROM Applicant WHERE PositionID = ?) WHERE ID = ?",
    [PositionID, PositionID],
  );
  return result;
}

export async function update(ApplicantID, PositionID, data) {
  const [result] = await db.query(
    "UPDATE Applicant SET LastModifiedDateTime = CURRENT_TIMESTAMP, Prefix = ?, FirstName = ?, LastName = ?, ApplicantNumber = ?, CitizenNumber = ?, SeatRow = ? WHERE ID = ? AND PositionID = ?",
    [
      data.Prefix,
      data.FirstName,
      data.LastName,
      data.ApplicantNumber,
      data.CitizenNumber,
      data.SeatRow,
      ApplicantID,
      PositionID,
    ],
  );
  return result;
}

export async function Delete(id) {
  const [result] = await db.query("DELETE FROM Applicant WHERE ID = ?", [id]);
  return result;
}
