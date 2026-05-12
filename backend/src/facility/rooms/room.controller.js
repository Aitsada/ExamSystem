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
      CreatedBy: "AdminX",
    });
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
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
