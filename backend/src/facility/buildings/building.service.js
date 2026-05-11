import * as buildingModel from "../../models/building.model.js";

export async function getAll() {
  return buildingModel.findAll();
}

export async function findById(id) {
  return buildingModel.findById(id);
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
export async function update(id, data) {
  return await buildingModel.update(id, data);
}
export async function deleteById(id) {
  return buildingModel.deleteById(id);
}
