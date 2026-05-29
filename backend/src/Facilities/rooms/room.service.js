import * as roomModel from "../../models/room.model.js";
import * as seatRowModel from "../../models/seatRow.model.js";
import * as seatModel from "../../models/seat.model.js";
import db from "../../config/db.js";

export async function findAll() {
  return await roomModel.findAll();
}

export async function findById(FloorID, RoomID) {
  return await roomModel.findById(FloorID, RoomID);
}

export async function findByFloorID(FloorID) {
  return await roomModel.findByFloorID(FloorID);
}

export async function create(data) {
  return await roomModel.create(data);
}

export async function importFromRows(FloorID, rows) {
  if (!FloorID) {
    throw new Error("FloorID is required");
  }

  let imported = 0;
  for (const row of rows) {
    if (!row.Name?.trim()) {
      continue;
    }

    await create({
      FloorID,
      CreatedBy: row.CreatedBy || "Admin",
      No: row.No,
      Name: row.Name,
      Description: row.Description || "",
      Rows: row.Rows,
      Columns: row.Columns,
      TemplateID: row.TemplateID,
    });
    imported += 1;
  }

  return imported;
}

export async function Delete(FloorID, RoomID) {
  return await roomModel.Delete(FloorID, RoomID);
}
export async function update(FloorID, RoomID, data) {
  return await roomModel.update(FloorID, RoomID, data);
}

// ceateTransaction
export async function createRoomWithSeats(FloorID, data) {
  console.log("room service start");
  let conn;
  try {
    conn = await db.getConnection();
    console.log("room service got connection");

    console.log("room service : ", FloorID, data);

    await conn.beginTransaction();

    const roomResult = await roomModel.create({ ...data, FloorID }, conn);
    const roomID = roomResult;
    console.log("roomID : ", roomID);

    for (let r = 0; r < data.Rows; r++) {
      const rowName = String.fromCharCode(65 + r);
      const seatRowResult = await seatRowModel.create(roomID, {
        Name: rowName,
      }, conn);
      const seatRowID = seatRowResult;
      for (let c = 1; c <= data.Columns; c++) {
        const seatName = `${rowName}${c}`;
        await seatModel.create(seatRowID, {
          Name: seatName,
        }, conn);
      }
    }

    await conn.commit();
    return roomID;
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}
