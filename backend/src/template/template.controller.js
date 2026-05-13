import * as templateService from "./template.service.js";

export async function downloadFacilityTemplate(req, res) {
  try {
    const file = await templateService.getFacilityImportTemplate();
    return res.download(file.path, file.downloadName);
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function downloadBuildingTemplate(req, res) {
  try {
    const file = await templateService.getBuildingImportTemplate();
    return res.download(file.path, file.downloadName);
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function downloadFloorTemplate(req, res) {
  try {
    const file = await templateService.getFloorImportTemplate();
    return res.download(file.path, file.downloadName);
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function downloadRoomTemplate(req, res) {
  try {
    const file = await templateService.getRoomImportTemplate();
    return res.download(file.path, file.downloadName);
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
}
