import * as seatMappingModel from "../models/seatMapping.js";
import db from "../config/db.js";

export async function findAll() {
  return await seatMappingModel.findAll();
}

export async function Create(SeatID, ApplicantID) {
  return await seatMappingModel.Create(SeatID, ApplicantID);
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

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const applicants = await seatMappingModel.findApplicantsByPositionID(normalizedPositionID, conn);
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
