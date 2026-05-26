import { Router } from "express";
import * as floorController from "./floor.controller.js";
import { uploadExcel } from "../../utils/excelUpload.js";

const router = Router();

router.get("/floors", floorController.findAll);
router.get("/:BuildingID/floor/:FloorID", floorController.findById);
router.get("/:BuildingID/floors", floorController.findByBuildingID);
router.post("/:BuildingID/floor", floorController.create);
router.post("/:BuildingID/floors/import",uploadExcel.single("file"),floorController.importExcel);
router.delete("/:BuildingID/floor/:FloorID", floorController.Delete);
router.patch("/:BuildingID/floor/:FloorID", floorController.update);

export default router;
