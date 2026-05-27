import * as facilityService from "./facility.service.js";
import { getValue, parseExcelRows } from "../../utils/excelImport.js";

export async function FindAll(req, res) {
  try {
    const data = await facilityService.findAll();

    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function findById(req, res) {
  console.log(req.params)
  try {
    const { id } = req.params;
    const data = await facilityService.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "fail", message: "Faiclity not found" });
    }
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function Create(req, res) {
  try {
    const data = req.body;

    if (!data?.Name || !data?.DisplayName) {
      return res
        .status(400)
        .json({ status: "fail", message: "Name and DisplayName are required" });
    }

    const result = await facilityService.createData(data);

    res.status(201).json({ id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function importExcel(req, res) {
  try {
    const rows = parseExcelRows(req.file).map((row) => ({
      CreatedBy: getValue(row, "CreatedBy", "Admin"),
      Name: getValue(row, ["Name", "ชื่อสถานที่สอบ", "สถานที่สอบ"]),
      DisplayName: getValue(row, ["DisplayName", "ชื่อที่แสดง"]),
      Description: getValue(row, ["Description", "รายละเอียด"]),
    }));
    const imported = await facilityService.importFromRows(rows);

    return res.status(201).json({
      status: "success",
      imported,
      message: `Imported ${imported} facilities`,
    });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Delete(req, res) {
  try {
    const id = req.params.id;

    const result = await facilityService.deleteData(id);

    res.status(200).json({ message: "Facility deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function Update(req, res) {
  try {
    const id = req.params.id;
    const data = {
      ...req.body,
      LastModifiedDateTime: new Date(),
      LastModifiedBy: "Ait07",
    };

    const result = await facilityService.updateData(id, data);

    res.status(200).json({ message: "Facility updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
