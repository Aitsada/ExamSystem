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

function normalizeAppId(value) {
  return String(value ?? "").trim();
}

function toAppIdNumber(value, fieldName = "AppId") {
  const appId = normalizeAppId(value);

  if (!appId) {
    return null;
  }
  if (!/^\d+$/.test(appId)) {
    throw new Error(`${fieldName} ต้องเป็นตัวเลข`);
  }

  return Number(appId);
}

function filterRowsByAppIdRange(rows, startAppId, endAppId) {
  const start = toAppIdNumber(startAppId, "AppId เริ่มต้น");
  const end = toAppIdNumber(endAppId, "AppId สิ้นสุด");

  if (start !== null && end !== null && start > end) {
    throw new Error("ช่วง AppId เริ่มต้นต้องไม่มากกว่าสิ้นสุด");
  }

  if (start === null && end === null) {
    return rows;
  }

  return rows.filter((row) => {
    const appId = toAppIdNumber(getValue(row, ["AppID", "AppId"]));

    if (appId === null) {
      return false;
    }
    if (start !== null && appId < start) {
      return false;
    }
    if (end !== null && appId > end) {
      return false;
    }

    return true;
  });
}

export async function importExcel(req, res) {
  try {
    const { PositionID } = req.params;
    const { startAppId, endAppId } = req.body;
    const excelRows = filterRowsByAppIdRange(parseExcelRows(req.file), startAppId, endAppId);
    const rows = excelRows.map((row) => ({
      CreatedBy: getValue(row, "CreatedBy", "Admin"),
      Prefix: getValue(row, "Name1"),
      FirstName: getValue(row, "Name2"),
      LastName: getValue(row, "Name3"),
      ApplicantNumber: getValue(row, ["AppID", "AppId"]),
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

export async function Delete(req, res) {
  try {
    const { id } = req.params;
    const result = await applicantService.Delete(id);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
