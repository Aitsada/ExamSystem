import db from "../config/db.js";

export async function findAll() {
  const [rows] = await db.query("SELECT * FROM Room");
  return rows;
}

export async function findById(id){
  const [result] = await db.query("SELECT * FROM Room WHERE ID = ?", [id])
  return result[0]
}

export async function findByFloorID(FloorID){
  const [result] = await db.query("SELECT * FROM Room WHERE FloorID = ?", [FloorID])
  return result
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Room (CreatedBy, FloorID, No, Name, Description, `Rows`, `Columns`, TemplateID) VALUES (?,?,?,?,?,?,?,?)",
    [
      data.CreatedBy,
      Number(data.FloorID),
      data.No,
      data.Name,
      data.Description,
      data.Rows,
      data.Columns,
      data.TemplateID,
    ],
  );
  return result.insertId
}
