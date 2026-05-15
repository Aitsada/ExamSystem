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

export async function create(PositionID, data) {
  return await applicantModel.create(PositionID, data);
}

export async function update(ApplicantID, PositionID, data) {
  return await applicantModel.update(ApplicantID, PositionID, data);
}
