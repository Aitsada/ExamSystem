import * as seatModel from "../../models/seat.model.js";

export async function findAll() {
  return await seatModel.findAll();
}

export async function create(seatRowID, data) {
  return await seatModel.create(seatRowID, data);
}