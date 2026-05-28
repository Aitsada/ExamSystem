import * as seatService from "./seat.service.js";

export async function findAll(req, res) {
  try {
    const result = await seatService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}

export async function Create(req, res) {
  try {
    const { seatRowID } = req.params;
    const data = req.body;
    const result = await seatService.create(seatRowID, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}