import db from "../config/db.js";

export default class facilityModel {
  async findAll() {
    console.log("model: ", "ok");

    const [rows] = await db.query("SELECT * FROM Facility WHERE IsActive = 1");
    return rows;
  }

  async create(data) {
    const [result] = await db.query(
      "INSERT INTO Facility (CreatedBy, Name, Description, DisplayName) VALUES (?,?,?,?)",
      [data.CreatedBy, data.Name, data.Description, data.DisplayName],
    );

    return result.insertId;
  }

  async deleteById(id) {
    const [result] = await db.query(
      "UPDATE Facility SET IsActive = 0 WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  async update(id, data) {
    const [result] = await db.query(
      "UPDATE Facility SET Name = ?, DisplayName = ?, Description = ?, LastModifiedBy = ? WHERE id = ?",
      [data.Name, data.DisplayName, data.Description, data.LastModifiedBy, id],
    );
    return result.affectedRows;
  }
}
