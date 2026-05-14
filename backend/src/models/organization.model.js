import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Organization");
  return result;
}

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Organization WHERE ID = ?", [
    id,
  ]);
  return result[0];
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Organization (Name, Description, Createdby) VALUES (?, ?, ?)",
    [data.Name, data.Description, "Ait"],
  );
  return result;
}

export async function update(id, data) {
  console.log("md")
  const [result] = await db.query(
    "UPDATE Organization SET Name = COALESCE(?, Name), Description = COALESCE(?, Description) WHERE ID = ?",
    [data.Name ?? null, data.Description ?? null, id],
  );
  return result;
}
