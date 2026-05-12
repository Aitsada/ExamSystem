import * as floorModel from "../../models/floor.model.js";

export async function test() {
  return await floorModel.findAll();
}
export async function findById(BuildingID, FloorID) {
  return await floorModel.findById(BuildingID, FloorID);
}
export async function findByBuildingID(BuildingID) {
  return await floorModel.findByBuildingID(BuildingID);
}
export async function create(data) {
  return floorModel.create(data);
}

export async function importFromRows(BuildingID, rows) {
  if (!BuildingID) {
    throw new Error("BuildingID is required");
  }

  let imported = 0;
  for (const row of rows) {
    if (row.Number === "" || row.Number === null || row.Number === undefined) {
      continue;
    }

    await create({
      BuildingID,
      CreatedBy: row.CreatedBy || "Admin",
      Number: row.Number,
      Name: row.Name || String(row.Number),
      Description: row.Description || "",
    });
    imported += 1;
  }

  return imported;
}

export async function update(BuildingID, FloorID, data) {
  return floorModel.update(BuildingID, FloorID, data);
}
export async function deleteById(BuildingID, FloorID) {
  return floorModel.deleteById(BuildingID, FloorID);
}
