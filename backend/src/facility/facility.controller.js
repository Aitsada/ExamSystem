import { getAll, createData } from "./facility.service.js";

export async function FindAll(req, res) {
  try {
    console.log("controller : ", "ok");

    const data = await getAll();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function Create(req, res) {
  try {
    const data = req.body;
    console.log("data: ", data);

    if (!data?.Name || !data?.DisplayName) {
      return res.status(400).json({ message: "Name and DisplayName are required" });
    }

    const result = await createData(data);

    res.status(201).json({ id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
