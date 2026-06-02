import * as seatMappingModel from "../models/seatMapping.js";
import db from "../config/db.js";

export async function findAll() {
  return await seatMappingModel.findAll();
}

export async function Create(SeatID, ApplicantID) {
  return await seatMappingModel.Create(SeatID, ApplicantID);
}

export async function findRoomMappingCounts(RoomIDs) {
  return await seatMappingModel.findRoomMappingCounts(RoomIDs);
}

async function ensureRoomSeats(RoomIDs, conn) {
  const rooms = await seatMappingModel.findRoomsByIDs(RoomIDs, conn);
  const seatRows = await seatMappingModel.findSeatRowsByRoomIDs(RoomIDs, conn);
  const seatRowsByRoomAndName = new Map(
    seatRows.map((seatRow) => [`${seatRow.RoomID}-${seatRow.Name}`, seatRow]),
  );

  for (const room of rooms) {
    const rowCount = Number(room.Rows) || 0;
    const columnCount = Number(room.Columns) || 0;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowName = String.fromCharCode(65 + rowIndex);
      const rowKey = `${room.ID}-${rowName}`;
      let seatRow = seatRowsByRoomAndName.get(rowKey);

      if (!seatRow) {
        const seatRowID = await seatMappingModel.createSeatRow(room.ID, rowName, conn);
        seatRow = { ID: seatRowID, RoomID: room.ID, Name: rowName };
        seatRowsByRoomAndName.set(rowKey, seatRow);
      }

      const existingSeatNames = new Set(await seatMappingModel.findSeatNamesBySeatRowID(seatRow.ID, conn));
      for (let columnIndex = 1; columnIndex <= columnCount; columnIndex++) {
        const seatName = `${rowName}${columnIndex}`;
        if (!existingSeatNames.has(seatName)) {
          await seatMappingModel.createSeat(seatRow.ID, seatName, conn);
        }
      }
    }
  }
}

export async function mapPositionToRooms(PositionID, RoomIDs) {
  if (!PositionID) {
    throw new Error("PositionID is required");
  }
  if (!Array.isArray(RoomIDs)) {
    throw new Error("RoomIDs is required");
  }

  const normalizedPositionID = Number(PositionID);
  const normalizedRoomIDs = RoomIDs
    .map((RoomID) => Number(RoomID))
    .filter((RoomID) => Number.isInteger(RoomID) && RoomID > 0);

  if (!Number.isInteger(normalizedPositionID) || normalizedPositionID <= 0) {
    throw new Error("PositionID is invalid");
  }
  if (!normalizedRoomIDs.length) {
    throw new Error("RoomIDs is required");
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const applicants = await seatMappingModel.findApplicantsByPositionID(normalizedPositionID, conn);
    await ensureRoomSeats(normalizedRoomIDs, conn);
    const seats = await seatMappingModel.findSeatsByRoomIDs(normalizedRoomIDs, conn);
    const mappingCount = Math.min(applicants.length, seats.length);
    const mappings = [];

    for (let index = 0; index < mappingCount; index++) {
      mappings.push({
        SeatID: seats[index].ID,
        ApplicantID: applicants[index].ID,
      });
    }

    await seatMappingModel.deleteByApplicantIDsOrSeatIDs(
      applicants.map((applicant) => applicant.ID),
      seats.map((seat) => seat.ID),
      conn,
    );
    await seatMappingModel.createMany(mappings, conn);

    await conn.commit();

    return {
      mapped: mappings.length,
      totalApplicants: applicants.length,
      totalSeats: seats.length,
      unmappedApplicants: Math.max(applicants.length - seats.length, 0),
      unusedSeats: Math.max(seats.length - applicants.length, 0),
    };
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
