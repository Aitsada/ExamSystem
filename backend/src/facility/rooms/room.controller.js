import * as roomController from "./room.service.js";

export async function findAll(req, res) {
  try {
    const data = await roomController.findAll();
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "fail" });
  }
}
