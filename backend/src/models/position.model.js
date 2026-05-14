import db from "../config/db.js";

export async function findByExamID(ExamID) {
  const [result] = await db.query("SELECT * FROM Exam WHERE ExamID = ?", [
    ExamID,
  ]);
  return result;
}

export async function create(ExamID, data) {
  const [result] = await db.query(
    "INSERT INTO `Position` (CreatedBy, ExamID, Number, Name, Description) VALUES (?,?,?,?,?)",
    ["Ait", Number(ExamID), data.Number, data.Name, data.Description],
  );
  return result;
}
