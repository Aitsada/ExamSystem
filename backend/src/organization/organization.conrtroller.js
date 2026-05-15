import * as organizationService from "./organization.service.js";

export async function findAll(req, res) {
  try {
    const result = await organizationService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}
export async function findById(req, res) {
  try {
    const { id } = req.params;
    const result = await organizationService.findById(id);
    
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
export async function Create(req, res) {
  try {
    const data = req.body;
    if (data.Name === "") {
      return res.status(400).json({
        status: "fail",
        message: "Name is required",
      });
    }
    const result = await organizationService.create(data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await organizationService.update(id, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
