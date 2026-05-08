import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Floor");
  return result;
}
export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Floor WHERE ID = ?", [id]);
  console.log('md : ', result)
  return result;
}
export async function findByBuildingID(BuildingID) {
  const [result] = await db.query("SELECT * FROM Floor WHERE BuildingID = ?", [
    BuildingID,
  ]);
  return result;
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Floor (CreatedBy, BuildingID, Number, Name, Description) VALUES (?,?,?,?,?)",
    [data.CreatedBy, data.BuildingID, data.Number, data.Name, data.Description],
  );
  return result.insertId;
}

export async function deleteById(id) {
  const [result] = await db.query(
    "UPDATE Floor SET IsActive = 0 WHERE id = ?",
    [id],
  );
  return result.affectedRows;
}
