import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Floor");
  return result;
}
export async function findById(BuildingID, FloorID) {
  const [result] = await db.query(
    "SELECT * FROM Floor WHERE BuildingID = ? AND ID = ? AND IsActive = 1",
    [BuildingID, FloorID],
  );
  return result[0];
}
export async function findByBuildingID(BuildingID) {
  const [result] = await db.query(
    "SELECT * FROM Floor WHERE BuildingID = ? AND IsActive = 1",
    [BuildingID],
  );
  return result;
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Floor (CreatedBy, BuildingID, Number, Name, Description) VALUES (?,?,?,?,?)",
    [data.CreatedBy, data.BuildingID, data.Number, data.Name, data.Description],
  );
  return result.insertId;
}
export async function update(BuildingID, FloorID, data) {
  const [result] = await db.query(
    "UPDATE Floor SET Number = ?, Name = ?, Description = ? WHERE ID = ? AND BuildingID = ? AND IsActive = 1",
    [data.Number, data.Name, data.Description, FloorID, BuildingID],
  );
  return result.affectedRows;
}
export async function deleteById(BuildingID, FloorID) {
  const [result] = await db.query(
    "UPDATE Floor SET IsActive = 0 WHERE ID = ? AND BuildingID = ? AND IsActive = 1",
    [FloorID, BuildingID],
  );
  return result.affectedRows;
}
