import * as examModel from "../../models/exam.model.js";

export async function findById(id) {
  return await examModel.findById(id);
}
export async function findByOrganID(organID) {
  return await examModel.findByOrganID(organID);
}

export async function create(organID, data) {
  return await examModel.create(organID, data);
}

export async function update(ExamID, OrganID, data) {
  return await examModel.update(ExamID, OrganID, data);
}

export async function Delete(id) {
  return await examModel.Delete(id);
}
