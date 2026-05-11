import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Building");
  return result;
}

export async function findById(BuildingID, FacilityID) {
  const [result] = await db.query(
    "SELECT * FROM Building WHERE ID = ? AND FacilityID = ? AND IsActive = 1",
    [BuildingID, FacilityID],
  );
  return result[0];
}
export async function findByFacilityID(FacilityID) {
  const [result] = await db.query(
    "SELECT * FROM Building WHERE FacilityID = ? AND IsActive = 1",
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
export async function update(BuildingID, FacilityID, data) {
  const [result] = await db.query(
    "UPDATE Building SET Name = ?, Alias = ?, Description = ? WHERE ID = ? AND FacilityID = ? AND IsActive = 1",
    [data.Name, data.Alias, data.Description, BuildingID, FacilityID],
  );
  return result.affectedRows;
}

export async function deleteById(BuildingID, FacilityID) {
  const [result] = await db.query(
    "UPDATE Building SET IsActive = 0 WHERE id = ? AND FacilityID = ?",
    [BuildingID, FacilityID],
  );
  return result.affectedRows;
}
