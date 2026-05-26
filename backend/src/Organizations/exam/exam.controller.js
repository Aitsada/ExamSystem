import * as examService from "./exam.service.js";

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const result = await examService.findById(id);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
export async function findByOrganID(req, res) {
  try {
    const { OrganID } = req.params;
    const result = await examService.findByOrganID(OrganID);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
export async function Create(req, res) {
  try {
    const { OrganID } = req.params;
    const data = req.body;
    const result = await examService.create(OrganID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Update(req, res) {
  try {
    const { ExamID, OrganID } = req.params;
    const data = req.body;
    const result = await examService.update(ExamID, OrganID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Delete(req, res) {
  try {
    const { id } = req.params;
    const result = await examService.Delete(id);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
