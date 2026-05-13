import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Organization");
  console.log(result);
  return result;
}

export async function create(data) {
  const [result] = await db.query(
    "INSERT INTO Organization (Name, Description, Createdby) VALUES (?, ?, ?)",
    [data.Name, data.Description, "Ait"],
  );
  console.log("result : ", result);
  return result;
}

export async function update(id, data) {
  const [result] = await db.query(
    "UPDATE Organization SET Name = COALESCE(?, Name), Description = COALESCE(?, Description) WHERE ID = ?",
    [data.Name ?? null, data.Description ?? null, id],
  );
  return result;
}
