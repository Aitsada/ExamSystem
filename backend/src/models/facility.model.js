import db from "../config/db.js";


  export async function findAll() {
    console.log("model: ", "ok");

    const [rows] = await db.query("SELECT * FROM Facility WHERE IsActive = 1");
    return rows;
  }

  export async function create(data) {
    const [result] = await db.query(
      "INSERT INTO Facility (CreatedBy, Name, Description, DisplayName) VALUES (?,?,?,?)",
      [data.CreatedBy, data.Name, data.Description, data.DisplayName],
    );
    console.log("result: ", result);
    
    return result.insertId;
  }

  export async function deleteById(id) {
    const [result] = await db.query(
      "UPDATE Facility SET IsActive = 0 WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  export async function update(id, data) {
    const [result] = await db.query(
      "UPDATE Facility SET Name = ?, DisplayName = ?, Description = ?, LastModifiedBy = ? WHERE id = ?",
      [data.Name, data.DisplayName, data.Description, data.LastModifiedBy, id],
    );
    return result.affectedRows;
  }

