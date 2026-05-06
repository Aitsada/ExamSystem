import * as buildingService from "./building.service.js";

export async function getAll(req, res) {
  try {
    const data = await buildingService.getAll();
    res.status(200).json({ data: data, message: "get all buildings" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
