import * as roomController from "./room.service.js";

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
    const { id } = req.params;
    const result = await roomController.findById(id);
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
      CreatedBy: "AdminX",
    });
    res.status(200).json({ status: "sussess", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
