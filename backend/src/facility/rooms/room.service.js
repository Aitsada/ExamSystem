import * as roomModel from "../../models/room.model.js";

export async function findAll() {
  return roomModel.findAll();
}
