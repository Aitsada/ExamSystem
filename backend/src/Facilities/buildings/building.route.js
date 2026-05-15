import { Router } from "express";
import * as buildingController from "./building.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/buildings", buildingController.getAll);
router.get(
  "/:FacilityID/buildings/:BuildingID",
  buildingController.findById,
);
router.get(
  "/:FacilityID/buildings",
  buildingController.findByFacilityID,
);
router.post("/:FacilityID/buildings", buildingController.Create);
router.post(
  "/facilities/:FacilityID/buildings/import",
  upload.single("file"),
  buildingController.importExcel,
);
router.delete(
  "/:FacilityID/buildings/:BuildingID",
  buildingController.deleteById,
);
router.patch(
  "/:FacilityID/buildings/:BuildingID",
  buildingController.update,
);

export default router;
