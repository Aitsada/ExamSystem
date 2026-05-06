import facilityModel from "../models/facility.model.js";

const model = new facilityModel();

export async function getAll() {
  console.log("service : ", "ok");
  return model.findAll();
}

export async function createData(data) {
  return model.create(data);
}
export async function deleteData(id) {
  return model.deleteById(id);
}

export async function updateData(id, data) {
  return model.update(id, data);
}
