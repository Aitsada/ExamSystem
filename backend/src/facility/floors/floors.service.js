import * as floorModel from "../../models/floor.model.js";

export async function test() {
  return await floorModel.findAll();
}
export async function findById(BuildingID, FloorID) {
  return await floorModel.findById(BuildingID, FloorID);
}
export async function findByBuildingID(BuildingID) {
  return await floorModel.findByBuildingID(BuildingID);
}
export async function create(data) {
  return floorModel.create(data);
}
export async function update(BuildingID, FloorID, data) {
  return floorModel.update(BuildingID, FloorID, data);
}
export async function deleteById(BuildingID, FloorID) {
  return floorModel.deleteById(BuildingID, FloorID);
}
