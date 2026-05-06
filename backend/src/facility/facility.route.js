import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import * as buildingController from "./buildings/building.controller.js";
import * as floorController from "./floors/floors.controller.js";

const router = Router();
// /api
router.get("/", facilityController.FindAll);
router.post("/create", facilityController.Create);
router.delete("/:id", facilityController.Delete);
router.patch("/update/:id", facilityController.Update);

// Building
router.get("/buildings", buildingController.getAll);
router.get("/:FacilityID/buildings", buildingController.findById);
router.delete("/buildings/:id", buildingController.deleteById);
router.post("/:FacilityID/buildings", buildingController.Create);

// Floor
router.get("/floors/test", floorController.test);
router.post("/:BuildingID/floors", floorController.create);
export default router;
