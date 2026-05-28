import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM SeatRow");
  return result;
}

export async function craete(roomID, data) {
  const [result] = await db.query(
    "INSERT INTO SeatRow (CreatedBy, RoomID, Name, Description) VALUES (?,?,?,?)",
    ["Admin", roomID, data.Name, data.Description],
  );
  return result;
}