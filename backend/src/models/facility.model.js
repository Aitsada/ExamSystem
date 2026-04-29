import db from "../config/db.js";

export async function findAll() {
  console.log("model: ", "ok");

  const [rows] = await db.query("SELECT * FROM Facility");
  return rows;
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Facility (CreatedBy, Name, Description, DisplayName) VALUES (?,?,?,?)",
    [data.CreatedBy, data.Name, data.Description, data.DisplayName]
  );

  return result.insertId;
}
