import db from "../config/db.js";

export async function findById(id) {
  const [result] = await db.query(`SELECT * FROM Position WHERE ID = ?`, [id]);
  return result[0];
}

export async function findByExamID(ExamID) {
  const [result] = await db.query(`SELECT * FROM Position WHERE ExamID = ?`, [
    ExamID,
  ]);
  return result;
}

export async function create(ExamID, data) {
  const [result] = await db.query(
    "INSERT INTO `Position` (CreatedBy, ExamID, Number, Name, Description) VALUES (?,?,?,?,?)",
    [
      data.CreatedBy ?? "Ait",
      Number(ExamID),
      Number(data.Number) || 0,
      data.Name,
      data.Description ?? "",
    ],
  );
  return result;
}

export async function Delete(id) {
  const [result] = await db.query("DELETE FROM Position WHERE ID = ?", [id]);
  return result;
}
