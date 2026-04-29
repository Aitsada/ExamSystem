import { findAll, create } from "../models/facility.model.js";

export async function getAll() {
  console.log("service : ", "ok");

  return findAll();
}

export async function createData(data) {
  
  return create(data);
}
