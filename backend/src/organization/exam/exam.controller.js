import * as examService from "./exam.service.js";

export async function Create(req, res) {
  console.log(req.params, req.body);

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
