import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Building");
  return result;
}

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Building WHERE ID = ?", [id])
  return result[0]
}
export async function findByFacilityID(FacilityID) {
  const [result] = await db.query(
    "SELECT * FROM Building WHERE FacilityID = ?",
    [FacilityID],
  );
  return result;
}
export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Building (CreatedBy, FacilityID, Name, Alias, Description) VALUES (?,?,?,?,?)",
    [data.CreatedBy, data.FacilityID, data.Name, data.Alias, data.Description],
  );
  return result.insertId;
}

export async function deleteById(id) {
  const [result] = await db.query(
    "UPDATE Building SET IsActive = 0 WHERE id = ?",
    [id],
  );
  return result.affectedRows;
}
