import * as facilityModel from "../../models/facility.model.js";

export async function findAll() {
  return facilityModel.findAll();
}
export async function findById(id) {
  return await facilityModel.findById(id);
}
export async function createData(data) {
  return facilityModel.create(data);
}

export async function importFromRows(rows) {
  let imported = 0;
  for (const row of rows) {
    if (!row.Name?.trim() || !row.DisplayName?.trim()) {
      continue;
    }

    await createData({
      CreatedBy: row.CreatedBy || "Admin",
      Name: row.Name,
      DisplayName: row.DisplayName,
      Description: row.Description || "",
    });
    imported += 1;
  }

  return imported;
}

export async function deleteData(id) {
  return facilityModel.deleteById(id);
}

export async function updateData(id, data) {
  return facilityModel.update(id, data);
}
