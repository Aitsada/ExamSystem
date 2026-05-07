import * as floorService from "./floors.service.js";

export async function test(req, res) {
  const data = await floorService.test();
  res.status(200).json({ data: data, message: "test floor" });
}

export async function findById(req, res) {
  try {
    const { BuildingID } = req.params;
    const data = await floorService.findById(BuildingID);
    
    res.status(200).json({ message: "Find By Id", data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { BuildingID } = req.params;
    const data = await floorService.create({ ...req.body, BuildingID });
    res
      .status(201)
      .json({ data: data, message: "Floor created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const data = await floorService.deleteById(id);
    if (data) {
      res.status(200).json({ message: "Floor deleted successfully" });
    } else {
      res.status(404).json({ message: "Floor not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
