import * as organizationService from "./organization.service.js";

export async function findAll(req, res) {
  try {
    const result = await organizationService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}

export async function Create(req, res) {
  console.log(req.body);
  try {
    const data = req.body;
    const result = await organizationService.create(data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}

export async function Update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await organizationService.update(id, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}
