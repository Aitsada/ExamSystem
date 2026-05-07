import * as floorModel from "../../models/floor.model.js";

export async function test() {
  return await floorModel.findAll();
}

export async function findById(BuildingID) {
  return await floorModel.findById(BuildingID);
}

export async function create(data) {
  return floorModel.create(data);
}

export async function deleteById(id) {
  return floorModel.deleteById(id);
}
