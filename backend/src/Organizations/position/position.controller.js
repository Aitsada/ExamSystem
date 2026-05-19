import * as positionService from "./position.service.js";

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const result = await positionService.findById(id);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function findByExamID(req, res) {
  try {
    const { ExamID } = req.params;
    const result = await positionService.findByExamID(ExamID);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Create(req, res) {
  console.log(req.body, req.params);
  try {
    const { ExamID } = req.params;
    const data = req.body;
    const result = await positionService.create(ExamID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
