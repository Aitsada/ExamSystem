import * as floorService from "./floor.service.js";
import { getValue, parseExcelRows, toNumber } from "../../utils/excelImport.js";

export async function findAll(req, res) {
  const data = await floorService.findAll();
  res.status(200).json({ message: "test floor", data: data });
}

export async function findById(req, res) {
  try {
    const { BuildingID, FloorID } = req.params;
    const result = await floorService.findById(BuildingID, FloorID);

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

export async function findByBuildingID(req, res) {
  try {
    const { BuildingID } = req.params;
    const data = await floorService.findByBuildingID(BuildingID);
    res.status(200).json({ message: "Find By Id", data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { BuildingID } = req.params;
    const data = await floorService.create({ ...req.body, BuildingID });
    res.status(201).json({ data: data, message: "Floor created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function importExcel(req, res) {
  try {
    const { BuildingID } = req.params;
    const rows = parseExcelRows(req.file).map((row) => ({
      CreatedBy: getValue(row, "CreatedBy", "Admin"),
      Number: toNumber(
        getValue(row, ["Number", "เลขชั้นสอบ", "ชั้นสอบ"]),
        null,
      ),
      Name: getValue(row, ["Name", "ชื่อชั้นสอบ"]),
      Description: getValue(row, ["Description", "รายละเอียด"]),
    }));
    const imported = await floorService.importFromRows(BuildingID, rows);

    res.status(201).json({
      status: "success",
      imported,
      message: `Imported ${imported} floors`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { BuildingID, FloorID } = req.params;
    const data = req.body;
    const result = await floorService.update(BuildingID, FloorID, data);

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function Delete(req, res) {
  try {
    const { BuildingID, FloorID } = req.params;
    const data = await floorService.deleteById(BuildingID, FloorID);
    if (data) {
      res.status(200).json({ message: "Floor deleted successfully" });
    } else {
      res.status(404).json({ message: "Floor not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
