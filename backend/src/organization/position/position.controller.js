import * as positionService from "./position.service.js";

export async function Create(req, res) {
  try {
    const { ExamID } = req.params;
    const data = req.body;
    const result = await positionService.create(ExamID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
