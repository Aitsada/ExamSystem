import * as buildingModel from "../../models/building.model.js";

export async function getAll() {
  return buildingModel.findAll();
}

export async function findById(BiuldingID, FacilityID) {
  return buildingModel.findById(BiuldingID, FacilityID);
}

export async function findByFacilityID(FacilityID) {
  return buildingModel.findByFacilityID(FacilityID);
}

export async function create(data) {
  if (!data.FacilityID) {
    throw new Error("FacilityID is required");
  }

  if (!data.Name?.trim()) {
    throw new Error("Building Name is required");
  }
  return buildingModel.create(data);
}
export async function update(BuildingID, FacilityID, data) {
  return await buildingModel.update(BuildingID, FacilityID, data);
}
export async function deleteById(BuildingID, FacilityID) {
  return buildingModel.deleteById(BuildingID, FacilityID);
}
