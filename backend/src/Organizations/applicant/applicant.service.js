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

    await applicantModel.create(PositionID, {
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

  await applicantModel.updatePositionNumber(PositionID);
  return imported
}

export async function create(PositionID, data) {
  const result = await applicantModel.create(PositionID, data);
  await applicantModel.updatePositionNumber(PositionID);
  return result;
}

export async function update(ApplicantID, PositionID, data) {
  const result = await applicantModel.update(ApplicantID, PositionID, data);
  await applicantModel.updatePositionNumber(PositionID);
  return result;
}

export async function Delete(id) {
  const applicant = await applicantModel.findById(id);
  const result = await applicantModel.Delete(id);

  if (applicant) {
    await applicantModel.updatePositionNumber(applicant.PositionID);
  }

  return result;
}
