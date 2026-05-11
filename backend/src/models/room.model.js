import db from "../config/db.js";

export async function findAll() {
  const [rows] = await db.query("SELECT * FROM Room");
  return rows;
}

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Room WHERE ID = ? AND IsActive = 1", [id]);
  return result[0];
}

export async function findByFloorID(FloorID) {
  const [result] = await db.query("SELECT * FROM Room WHERE FloorID = ? AND IsActive = 1", [
    FloorID,
  ]);
  return result;
}

export async function update(id, data) {
  const [result] = await db.query(
    "UPDATE Room SET Name = ?, Description = ?, Rows = ?, Columns = ?, No = ? WHERE ID =?",
    [data.Name, data.Description, data.rows, data.Columns, data.No, id],
  );
  return result;
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
  return result.insertId;
}

export async function Delete(id) {
  const [result] = await db.query(
    "UPDATE Room SET IsAcive = 0 WHERE ID = ?"[id],
  );
  return result.affectedRows;
}
