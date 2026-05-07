import * as facilityModel from "../models/facility.model.js";

export async function getAll() {
  return facilityModel.findAll();
}
export async function findById(id) {
  return await facilityModel.findById(id);
}
export async function createData(data) {
  return facilityModel.create(data);
}
export async function deleteData(id) {
  return facilityModel.deleteById(id);
}

export async function updateData(id, data) {
  console.log("sv");
  return facilityModel.update(id, data);
}
