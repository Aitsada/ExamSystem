import db from "../config/db.js";

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Exam WHERE ID = ?", [id]);
  return result[0];
}

export async function findByOrganID(organID) {
  const [result] = await db.query(
    "SELECT * FROM Exam WHERE OrganizationID = ? AND isActive = 1",
    [organID],
  );
  return result;
}
export async function create(OrganID, data) {
  const [result] = await db.query(
    "INSERT INTO Exam (CreatedBy, OrganizationID, Name, StatusID, StartDateTime, EndDateTime) VALUES (?,?,?,?,?,?)",
    [
      "Ait",
      Number(OrganID),
      data.Name,
      data.StatusID,
      data.StartDateTime,
      data.EndDateTime,
    ],
  );
  return result;
}

export async function update(ExamID, OrganID, data) {
  const [result] = await db.query(
    "UPDATE Exam SET Name = COALESCE(?, Name), StatusID = COALESCE(?, StatusID), StartDateTime = COALESCE(?, StartDateTime), EndDateTime = COALESCE(?, EndDateTime) WHERE ID = ? AND OrganizationID = ?",
    [
      data.Name ?? null,
      data.StatusID ?? null,
      data.StartDateTime ?? null,
      data.EndDateTime ?? null,
      ExamID,
      OrganID,
    ],
  );
  return result;
}

export async function Delete(id) {
  const [result] = await db.query("DELETE FROM Exam WHERE ID = ?", [id]);

  return result;
}
