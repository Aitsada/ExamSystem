import * as applicantService from "./applicant.service.js";

export async function findAll(req, res) {
  try {
    const result = await applicantService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const result = await applicantService.findById(id);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function findByPositionID(req, res) {
  try {
    const { PositionID } = req.params;
    const result = await applicantService.findByPositionID(PositionID);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Create(req, res) {
  try {
    const { PositionID } = req.params;
    const data = req.body;
    const result = await applicantService.create(PositionID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Update(req, res) {
  try {
    const { ApplicantID, PositionID } = req.params;
    const data = req.body;
    const result = await applicantService.update(ApplicantID, PositionID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
