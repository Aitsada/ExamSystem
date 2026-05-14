import * as organizationModel from "../models/organization.model.js";

export async function findAll() {
  return await organizationModel.findAll();
}

export async function findById(id) {
  return await organizationModel.findById(id);
}

export async function create(data) {
  return await organizationModel.create(data);
}

export async function update(id, data) {
  return await organizationModel.update(id, data);
}
