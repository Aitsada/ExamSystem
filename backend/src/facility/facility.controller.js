import * as facilityService from "./facility.service.js";


export async function FindAll(req, res) {
  try {
    console.log("controller : ", "ok");

    const data = await facilityService.getAll();

    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function Create(req, res) {
  try {
    const data = req.body;
    console.log("data: ", data);

    if (!data?.Name || !data?.DisplayName) {
      return res
        .status(400)
        .json({ message: "Name and DisplayName are required" });
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
    console.log("controller DELETE : ", req.params.id);

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
      LastModifiedBy: "Ait0102",
    };

    const result = await facilityService.updateData(id, data);
    console.log("controller UPDATE id : ", id );
    console.log("controller UPDATE data : ", data );
    
    res.status(200).json({ message: "Facility updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
