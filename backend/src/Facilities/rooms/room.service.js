import * as roomModel from "../../models/room.model.js";

export async function findAll() {
  return await roomModel.findAll();
}

export async function findById(FloorID, RoomID) {
  return await roomModel.findById(FloorID, RoomID);
}

export async function findByFloorID(FloorID) {
  return await roomModel.findByFloorID(FloorID);
}

export async function create(data) {
  return await roomModel.create(data);
}

export async function importFromRows(FloorID, rows) {
  if (!FloorID) {
    throw new Error("FloorID is required");
  }

  let imported = 0;
  for (const row of rows) {
    if (!row.Name?.trim()) {
      continue;
    }

    await create({
      FloorID,
      CreatedBy: row.CreatedBy || "Admin",
      No: row.No,
      Name: row.Name,
      Description: row.Description || "",
      Rows: row.Rows,
      Columns: row.Columns,
      TemplateID: row.TemplateID,
    });
    imported += 1;
  }

  return imported;
}

export async function Delete(FloorID, RoomID) {
  return await roomModel.Delete(FloorID, RoomID);
}
export async function update(FloorID, RoomID, data) {
  return await roomModel.update(FloorID, RoomID, data);
}
