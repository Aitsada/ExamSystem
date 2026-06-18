import * as seatMappingService from "./seatMapping.service.js";

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

export async function findRoomMappingCounts(req, res) {
  try {
    const RoomIDs = String(req.query.RoomIDs || "")
      .split(",")
      .filter((RoomID) => RoomID);
    console.log("Received RoomIDs:", RoomIDs);
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
    const result = await seatMappingService.findPositionRoomMappingCounts(RoomIDs);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function mapPositionToRooms(req, res) {
  console.log("Received request body:", req.body);
  try {
    const { PositionID, RoomIDs } = req.body;
    const result = await seatMappingService.mapPositionToRooms(PositionID, RoomIDs);
    res.status(201).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
