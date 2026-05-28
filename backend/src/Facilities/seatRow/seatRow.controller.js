import * as seatRowService from "./seatRow.service.js";

export async function findAll(req, res) {
  try {
    const result = seatRowService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}

export async function Create(req, res) {
  console.log("body : ", req.body, req.params);
  try {
    const { roomID } = req.params;
    const data = req.body;
    const result = seatRowService.create(roomID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
