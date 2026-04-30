import { findAll, create, deleteById, update } from "../models/facility.model.js";

export async function getAll() {
  console.log("service : ", "ok");

  return findAll();
}

export async function createData(data) {
  
  return create(data);
}

export async function deleteData(id) {
  return deleteById(id);
}

export async function updateData(id, data) {
  return update(id, data);
}