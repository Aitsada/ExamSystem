import * as roomModel from "../../models/room.model.js";

export async function findAll() {
  return roomModel.findAll();
}

export async function create(data) {
  return roomModel.create(data);
}
