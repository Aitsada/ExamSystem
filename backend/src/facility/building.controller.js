import buildingService from "./building.service.js";

const service = new buildingService();

export async function getAll(req, res) {
  try {
    const data = await service.getAll();
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
