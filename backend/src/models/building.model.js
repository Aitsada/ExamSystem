import db from "../config/db.js";

export default class buildingModel {
  async findAll() {
    console.log("model: ", "ok");
  }
}

export async function findAll() {
  console.log("model: ", "ok");
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Building (CreatedBy, Name, Alias, Description) VALUES (?,?,?,?)",
    [data.CreatedBy, data.Name, data.Alias, data.Description],
  );
  return result.insertId;
}
