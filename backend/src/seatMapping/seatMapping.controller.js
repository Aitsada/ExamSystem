import * as seatMappingService from "./seatMapping.service.js";

export async function findAll(req, res) {
  try {
    const result = await seatMappingService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function mapPositionToRooms(req, res) {
  try {
    const { PositionID, RoomIDs } = req.body;
    const result = await seatMappingService.mapPositionToRooms(PositionID, RoomIDs);
    res.status(201).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
