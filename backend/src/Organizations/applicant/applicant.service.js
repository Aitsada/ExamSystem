import * as applicantModel from "../../models/applicant.model.js";

export async function findAll() {
  return await applicantModel.findAll();
}

export async function findById(id) {
  return await applicantModel.findById(id);
}

export async function findByPositionID(PositionID) {
  return await applicantModel.findByPositionID(PositionID);
}

export async function importFromRows(PositionID, rows) {
  if (!PositionID) {
    throw new Error("PositionID is required");
  }

  let imported = 0;
  for (const row of rows) {
    if (!row.ApplicantNumber?.trim()) {
      continue;
    }

    await create(PositionID, {
      CreatedBy: row.CreatedBy || "Admin",
      Prefix: row.Prefix,
      FirstName: row.FirstName,
      LastName: row.LastName,
      ApplicantNumber: row.ApplicantNumber,
      CitizenNumber: row.CitizenNumber,
      SeatRow: row.SeatRow
    })
    imported += 1
  }

  return imported
}

export async function create(PositionID, data) {
  return await applicantModel.create(PositionID, data);
}

export async function update(ApplicantID, PositionID, data) {
  return await applicantModel.update(ApplicantID, PositionID, data);
}
