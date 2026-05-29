import db from "../config/db.js";

export async function create(seatRowID, data, conn = db) {
  const [result] = await conn.query(
    "INSERT INTO Seat (SeatRowID, CreatedBy, Name, Description) VALUES (?,?,?,?)",
    [seatRowID, "Admin", data.Name, data.Description || ""],
  );
  return result.insertId;
}
