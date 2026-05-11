import * as buildingService from "./building.service.js";

export async function getAll(req, res) {
  try {
    const result = await buildingService.getAll();
    return res.status(200).json({ data: result, message: "get all buildings" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

export async function findById(req, res) {
  try {
    const { BuildingID, FacilityID } = req.params;
    const result = await buildingService.findById(BuildingID, FacilityID);
    if (!FacilityID || !BuildingID) return;
    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Building not found",
      });
    }
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}
export async function findByFacilityID(req, res) {
  try {
    const { FacilityID } = req.params;
    const result = await buildingService.findByFacilityID(FacilityID);
    if (!result) {
      return res.status(404).json({ status: "fail" });
    }
    return res
      .status(200)
      .json({ data: result, message: "get building by FacilityID" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

export async function Create(req, res) {
  try {
    const { FacilityID } = req.params;

    const result = await buildingService.create({ ...req.body, FacilityID });
    return res.status(201).json({
      status: "success",
      result,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}
export async function update(req, res) {
  try {
    const { BuildingID, FacilityID } = req.params;
    const data = req.body;
    const result = await buildingService.update(BuildingID, FacilityID, data);
    if (!FacilityID || !BuildingID) return;
    return res.status(200).json({ status: "success", result });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}
export async function deleteById(req, res) {
  try {
    const { BuildingID, FacilityID } = req.params;
    const result = await buildingService.deleteById(BuildingID, FacilityID);
    if (!FacilityID || !BuildingID) return;
    if (result) {
      return res.status(200).json({ message: "Building deleted successfully" });
    } else {
      return res.status(404).json({ message: "Building not found" });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}
