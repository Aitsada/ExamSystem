import { Router } from "express";
import * as floorController from "./floor.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/floors", floorController.findAll);
router.get("/:BuildingID/floors/:FloorID", floorController.findById);
router.get("/:BuildingID/floors", floorController.findByBuildingID);
router.post("/:BuildingID/floors", floorController.create);
router.post(
  "/:BuildingID/floors/import",
  upload.single("file"),
  floorController.importExcel,
);
router.delete("/:BuildingID/floors/:FloorID", floorController.Delete);
router.patch("/:BuildingID/floors/:FloorID", floorController.update);

export default router;
