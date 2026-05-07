import * as buildingService from "./building.service.js";

export async function getAll(req, res) {
  try {
    const data = await buildingService.getAll();
    res.status(200).json({ data: data, message: "get all buildings" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const data = await buildingService.findById(id);
    if (!data) {
      res.status(404).json({ status: "fail" });
    }
    res.status(200).json({ data: data, message: "get building by FacilityID" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
export async function findByFacilityID(req, res) {
  try {
    const { FacilityID } = req.params;
    const data = await buildingService.findByFacilityID(FacilityID);
    if (!data) {
      res.status(404).json({ status: "fail" });
    }
    res.status(200).json({ data: data, message: "get building by FacilityID" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function Create(req, res) {
  try {
    const { FacilityID } = req.params;

    const result = await buildingService.create({ ...req.body, FacilityID });
    res.status(201).json({
      status: "success",
      result,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const data = await buildingService.deleteById(id);
    if (result) {
      res.status(200).json({ message: "Building deleted successfully" });
    } else {
      res.status(404).json({ message: "Building not found" });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
