import * as examModel from "../../models/exam.model.js";

export async function create(organID, data) {
  return await examModel.create(organID, data);
}

export async function update(ExamID, OrganID, data) {
  return await examModel.update(ExamID, OrganID, data);
}
