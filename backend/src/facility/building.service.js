import * as buildingModel from "../models/building.model.js";

export async function getAll() {
    console.log("service : ", "ok");
    return buildingModel.findAll();
}