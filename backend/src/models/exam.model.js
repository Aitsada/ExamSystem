import db from "../config/db.js";

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Exam WHERE ID = ?", [id]);
  return result[0];
}

export async function findByOrganID(organID) {
  const [result] = await db.query(
    "SELECT * FROM Exam WHERE OrganizationID = ?",
    [organID],
  );
  return result;
}
export async function create(OrganID, data) {
  const [result] = await db.query(
    "INSERT INTO Exam (CreatedBy, OrganizationID, Name, StartDateTime, EndDateTime) VALUES (?,?,?,?,?)",
    ["Ait", Number(OrganID), data.Name, data.StartDateTime, data.EndDateTime],
  );
  return result;
}

export async function update(ExamID, OrganID, data) {
  const [result] = await db.query(
    "UPDATE Exam SET Name = COALESCE(?, Name) WHERE ID = ? AND OrganizationID",
    [data.Name ?? null, ExamID, OrganID],
  );
  return result;
}
