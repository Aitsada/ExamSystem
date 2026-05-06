import buildingModel from "./building.model.js";

const model = new buildingModel();

export async function getAll() {
    console.log("service : ", "ok");
    return model.findAll();
}