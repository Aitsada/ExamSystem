import * as seatMappingService from "./seatMapping.service.js";
import { findByRoomId } from "../models/room.model.js";
import { roomLayout as roomLayoutPDF } from "../pdfKit/roomLayout.js";
import { listOfName as listOfNamePDF } from "../pdfKit/listOfName.js";
import { stickerIdPDF } from "../pdfKit/stickerID.js";

export async function findAll(req, res) {
  try {
    const result = await seatMappingService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function findHistory(req, res) {
  try {
    const result = await seatMappingService.findHistory();
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function findSummary(req, res) {
  try {
    const { ExamID, FacilityID } = req.query;
    const result = await seatMappingService.findSummary(ExamID, FacilityID);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function findRoomMappingCounts(req, res) {
  try {
    const RoomIDs = String(req.query.RoomIDs || "")
      .split(",")
      .filter((RoomID) => RoomID);
    const result = await seatMappingService.findRoomMappingCounts(RoomIDs);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function findPositionRoomMappingCounts(req, res) {
  try {
    const RoomIDs = String(req.query.RoomIDs || "")
      .split(",")
      .filter((RoomID) => RoomID);
    const result =
      await seatMappingService.findPositionRoomMappingCounts(RoomIDs);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function mapPositionToRooms(req, res) {
  try {
    const { PositionID, RoomIDs } = req.body;
    const result = await seatMappingService.mapPositionToRooms(
      PositionID,
      RoomIDs,
    );
    res.status(201).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// roomLayout

export async function roomLayout(req, res) {
  try {
    const body = req.body;
    const roomID = Number(body.roomID);
    const room = await findByRoomId(roomID);

    if (!room.length) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    const rows = room[0].Rows;
    const columns = room[0].Columns;
    const result = { ...body, rows, columns };

    await roomLayoutPDF(result);
    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function stickerID(req, res) {
  const body = req.body;
  // console.log(body);
  const result = await stickerIdPDF(body);
  return res.json({ status: "success", data: body });
}

export async function listOfName(req, res) {
  const body = req.body;
  // console.log(body);
  const result = await listOfNamePDF(body);
  return res.json({ data: body });
}
