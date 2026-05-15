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

export async function importFromRows(FacilityID, rows) {
  if (!FacilityID) {
    throw new Error("FacilityID is required");
  }

  let imported = 0;
  for (const row of rows) {
    if (!row.Name?.trim()) {
      continue;
    }

    await create({
      FacilityID,
      CreatedBy: row.CreatedBy || "Admin",
      Name: row.Name,
      Alias: row.Alias || "",
      Description: row.Description || "",
    });
    imported += 1;
  }

  return imported;
}

export async function update(BuildingID, FacilityID, data) {
  return await buildingModel.update(BuildingID, FacilityID, data);
}
export async function deleteById(BuildingID, FacilityID) {
  return buildingModel.deleteById(BuildingID, FacilityID);
}
