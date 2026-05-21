import * as applicantService from "./applicant.service.js";
import { getValue, parseExcelRows } from "../../utils/excelImport.js";

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

export async function importExcel(req, res) {
  try {
    const { PositionID } = req.params;
    const rows = parseExcelRows(req.file).map((row) => ({
      CreatedBy: getValue(row, "CreatedBy", "Admin"),
      Prefix: getValue(row, "Name1"),
      FirstName: getValue(row, "Name2"),
      LastName: getValue(row, "Name3"),
      ApplicantNumber: getValue(row, "AppID"),
      CitizenNumber: getValue(row, "CustomerID"),
      SeatRow: getValue(row, "SeatRow", 10),
    }));
    const imported = await applicantService.importFromRows(PositionID, rows);
    return res.status(201).json({
      status: "success",
      imported,
      message: `Imported ${imported} applicants`,
    });
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
