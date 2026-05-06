import * as floorModel from "../../models/floor.model.js";

export async function test() {
  return floorModel.test();
}

export async function create(data) {
  return floorModel.create(data);
}

export async function deleteById(id) {
  return floorModel.deleteById(id);
}
