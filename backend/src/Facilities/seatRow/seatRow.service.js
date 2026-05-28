import * as seatRowModel from "../../models/seatRow.model.js";

export async function findAll() {
  return await seatRowModel.findAll();
}

export async function create(roomID, data) {
  return await seatRowModel.craete(roomID, data);
}
