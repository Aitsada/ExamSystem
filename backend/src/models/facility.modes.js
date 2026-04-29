

export async function findAll() {
  const [rows] = await db.query("SELECT * FROM facility");
  return rows;
}
