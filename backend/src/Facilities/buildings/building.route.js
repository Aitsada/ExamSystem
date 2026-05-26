import { Router } from "express";
import * as buildingController from "./building.controller.js";
import { uploadExcel } from "../../utils/excelUpload.js";

const router = Router();

// api
router.get("/buildings", buildingController.getAll);
router.get("/:FacilityID/building/:BuildingID", buildingController.findById);
router.get("/:FacilityID/buildings", buildingController.findByFacilityID);
router.post("/:FacilityID/building", buildingController.Create);
router.post("/:FacilityID/buildings/import",uploadExcel.single("file"),buildingController.importExcel,);
router.delete("/:FacilityID/buildings/:BuildingID",buildingController.deleteById,);
router.patch("/:FacilityID/buildings/:BuildingID", buildingController.update);

export default router;
