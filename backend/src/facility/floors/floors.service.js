import * as floorModel from "../../models/floor.model.js";

export async function test() {
  return await floorModel.findAll();
}
export async function findById(id) {
  return await floorModel.findById(id);
}
export async function findByBuildingID(BuildingID) {
  return await floorModel.findByBuildingID(BuildingID);
}
export async function create(data) {
  return floorModel.create(data);
}
export async function update(id, data) {
  return floorModel.update(id, data);
}
export async function deleteById(id) {
  return floorModel.deleteById(id);
}
