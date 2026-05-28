import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Seat");
  return result;
}

export async function create(seatRowID, data) {
  const [result] = await db.query(
    "INSERT INTO Seat (CreatedBy, SeatRowID, Name, Description) VALUES (?,?,?,?)",
    ["Admin", seatRowID, data.Name, data.Description],
  );
  return result;
}
