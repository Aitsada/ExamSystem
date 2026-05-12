import * as roomController from "./room.service.js";
import { getValue, parseExcelRows, toNumber } from "../../utils/excelImport.js";

export async function findAll(req, res) {
  try {
    const data = await roomController.findAll();
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}

export async function findById(req, res) {
  try {
    const { FloorID, RoomID } = req.params;
    const result = await roomController.findById(FloorID, RoomID);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}

export async function findByFloorID(req, res) {
  try {
    const { FloorID } = req.params;
    const result = await roomController.findByFloorID(FloorID);

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
export async function create(req, res) {
  try {
    const { FloorID } = req.params;
    const result = await roomController.create({
      ...req.body,
      FloorID,
      CreatedBy: req.body.CreatedBy || "Admin",
    });
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}

export async function importExcel(req, res) {
  try {
    const { FloorID } = req.params;
    const rows = parseExcelRows(req.file).map((row) => ({
      CreatedBy: getValue(row, "CreatedBy", "Admin"),
      No: toNumber(getValue(row, ["No", "ห้องสอบที่"]), 0),
      Name: getValue(row, ["Name", "ชื่อห้องสอบ", "ห้องสอบ"]),
      Description: getValue(row, ["Description", "รายละเอียด"]),
      Rows: toNumber(getValue(row, ["Rows", "จำนวนแถว"]), 0),
      Columns: toNumber(getValue(row, ["Columns", "จำนวนคนในแถว"]), 0),
      TemplateID: toNumber(getValue(row, ["TemplateID", "Template"], 0), 0),
    }));
    const imported = await roomController.importFromRows(FloorID, rows);

    res.status(201).json({
      status: "success",
      imported,
      message: `Imported ${imported} rooms`,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Delete(req, res) {
  try {
    const { FloorID, RoomID } = req.params;
    const result = await roomController.Delete(FloorID, RoomID);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
export async function update(req, res) {
  try {
    const { FloorID, RoomID } = req.params;
    const data = req.body;
    const result = await roomController.update(FloorID, RoomID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
