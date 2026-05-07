import * as facilityService from "./facility.service.js";

export async function FindAll(req, res) {
  try {
    const data = await facilityService.getAll();

    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const data = await facilityService.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "fail", message: "Faiclity not found" });
    }
    res.status(200).json({ status: "success", data: data });
    console.log("data : ", data);
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
  console.log("ctrl : ", req.body, req.params.id)
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
