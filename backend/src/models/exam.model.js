import db from "../config/db.js";

export async function create(OrganID, data) {
  console.log("result : ", data);
  const [result] = await db.query(
    "INSERT INTO Exam (CreatedBy, OrganizationID, Name) VALUES (?,?,?)",
    ["Ait", Number(OrganID), data.Name],
  );
  return result;
}

export async function update(ExamID, OrganID, data) {
  const [result] = await db.query(
    "UPDATE Exam SET Name = COALESCE(?, Name) WHERE ID = ? AND OrganizationID",
    [data.Name ?? null, ExamID, OrganID],
  );
  return result
}
