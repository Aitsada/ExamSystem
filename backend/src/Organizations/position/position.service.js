import * as positionModel from "../../models/position.model.js";

export async function findByExamID(ExamID) {
  return await positionModel.findByExamID(ExamID);
}
export async function create(ExamID, data) {
  return await positionModel.create(ExamID, data);
}
