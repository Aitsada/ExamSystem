import * as roomModel from "../../models/room.model.js";

export async function findAll() {
  return await roomModel.findAll();
}

export async function findById(FloorID, RoomID) {
  return await roomModel.findById(FloorID, RoomID);
}

export async function findByFloorID(FloorID) {
  return await roomModel.findByFloorID(FloorID);
}

export async function create(data) {
  return await roomModel.create(data);
}

export async function Delete(FloorID, RoomID) {
  return await roomModel.Delete(FloorID, RoomID);
}
export async function update(FloorID, RoomID, data) {
  return await roomModel.update(FloorID, RoomID, data);
}
