import db from "../config/db.js";

export async function create(roomID, data, conn = db) {
  console.log("seatRow : ", roomID, data);
  const [result] = await conn.query(
    "INSERT INTO SeatRow (RoomID, CreatedBy, Name, Description) VALUES (?,?,?,?)",
    [roomID, "Admin", data.Name, data.Description || ""],
  );
  return result.insertId;
}
