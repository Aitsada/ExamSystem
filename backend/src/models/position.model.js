import db from "../config/db.js";

export async function create(ExamID, data) {
  const [result] = await db.query(
    "INSERT INTO Position (CreatedBy, ExamID, Number, Name, Description)",
    ["Ait", ExamID, data.Number, data.Name, data.Description],
  );
  return result;
}
