import e from "cors";
import * as positionModel from "../../models/position.model.js";

export async function findById(id) {
  return await positionModel.findById(id)
}

export async function findByExamID(ExamID) {
  return await positionModel.findByExamID(ExamID);
}

export async function create(ExamID, data) {
  return await positionModel.create(ExamID, data);
}

export async function Delete(id) {
  return await positionModel.Delete(id)
}