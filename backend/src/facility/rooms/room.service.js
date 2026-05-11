import * as roomModel from "../../models/room.model.js";

export async function findAll() {
  return await roomModel.findAll();
}

export async function findById(id) {
  return await roomModel.findById(id);
}

export async function findByFloorID(FloorID) {
  return await roomModel.findByFloorID(FloorID);
}

export async function create(data) {
  return await roomModel.create(data);
}

export async function Delete(id){
  return await roomModel.Delete(id)
}
export async function update(id, data) {
  return await roomModel.update(id, data);
}
