import db from "../config/db.js";

export async function findAll() {
  const [rows] = await db.query("SELECT * FROM Room");
  return rows;
}

export async function findById(FloorID, RoomID) {
  const [result] = await db.query(
    "SELECT * FROM Room WHERE ID = ? AND FloorID = ? AND IsActive = 1",
    [RoomID, FloorID],
  );
  return result[0];
}

export async function findByFloorID(FloorID) {
  const [result] = await db.query(
    "SELECT * FROM Room WHERE FloorID = ? AND IsActive = 1",
    [FloorID],
  );
  return result;
}

export async function update(FloorID, RoomID, data) {
  const [result] = await db.query(
    "UPDATE Room SET Name = ?, Description = ?, \`Rows\` = ?, \`Columns\` = ?, No = ? WHERE ID = ? AND FloorID = ? AND IsActive = 1",
    [
      data.Name,
      data.Description,
      data.Rows,
      data.Columns,
      data.No,
      RoomID,
      FloorID,
    ],
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

export async function Delete(FloorID, RoomID) {
  const [result] = await db.query(
    "UPDATE Room SET IsActive = 0 WHERE ID = ? AND FloorID = ?",
    [RoomID, FloorID],
  );
  console.log(result);
  return result.affectedRows;
}
