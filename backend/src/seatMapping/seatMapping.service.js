import * as seatMappingModel from "../models/seatMapping.model.js";
import db from "../config/db.js";

export async function findAll() {
  return await seatMappingModel.findAll();
}

export async function findHistory() {
  return await seatMappingModel.findHistory();
}

export async function findSummary(ExamID, FacilityID) {
  if (!ExamID) {
    throw new Error("ExamID is required");
  }
  if (!FacilityID) {
    throw new Error("FacilityID is required");
  }

  const meta = await seatMappingModel.findSummaryMeta(ExamID, FacilityID);
  const detailRows = await seatMappingModel.findSummaryRows(ExamID, FacilityID);
  const groupedRows = [];
  const rowMap = new Map();

  detailRows.forEach((item) => {
    const key = `${item.PositionID}-${item.RoomID}`;
    if (!rowMap.has(key)) {
      const summaryRow = {
        ExamID: item.ExamID,
        PositionID: item.PositionID,
        PositionName: item.PositionName,
        BuildingName: item.BuildingName,
        FloorNumber: item.FloorNumber,
        FloorName: item.FloorName,
        RoomID: item.RoomID,
        RoomName: item.RoomName,
        RoomNo: item.RoomNo,
        ApplicantNumbers: [],
      };
      rowMap.set(key, summaryRow);
      groupedRows.push(summaryRow);
    }

    rowMap.get(key).ApplicantNumbers.push(item.ApplicantNumber);
  });

  return {
    meta,
    rows: groupedRows.map((item) => ({
      ...item,
      ApplicantNumberStart: item.ApplicantNumbers[0] || "",
      ApplicantNumberEnd: item.ApplicantNumbers[item.ApplicantNumbers.length - 1] || "",
      ApplicantCount: item.ApplicantNumbers.length,
    })),
  };
}

export async function Create(SeatID, ApplicantID) {
  return await seatMappingModel.Create(SeatID, ApplicantID);
}

export async function findRoomMappingCounts(RoomIDs) {
  return await seatMappingModel.findRoomMappingCounts(RoomIDs);
}

export async function findPositionRoomMappingCounts(RoomIDs) {
  return await seatMappingModel.findPositionRoomMappingCounts(RoomIDs);
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

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const applicants = await seatMappingModel.findApplicantsByPositionID(normalizedPositionID, conn);
    await seatMappingModel.deleteByApplicantIDsOrSeatIDs(
      applicants.map((applicant) => applicant.ID),
      [],
      conn,
    );

    if (!normalizedRoomIDs.length) {
      await conn.commit();

      return {
        mapped: 0,
        totalApplicants: applicants.length,
        totalSeats: 0,
        unmappedApplicants: applicants.length,
        unusedSeats: 0,
      };
    }

    await ensureRoomSeats(normalizedRoomIDs, conn);
    const seats = await seatMappingModel.findAvailableSeatsByRoomIDs(normalizedRoomIDs, conn);
    const mappingCount = Math.min(applicants.length, seats.length);
    const mappings = [];

    for (let index = 0; index < mappingCount; index++) {
      mappings.push({
        SeatID: seats[index].ID,
        ApplicantID: applicants[index].ID,
      });
    }

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
