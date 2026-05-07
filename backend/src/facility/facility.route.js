import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import * as buildingController from "./buildings/building.controller.js";
import * as floorController from "./floors/floors.controller.js";

const router = Router();
// /api
// Facility
router.get("/", facilityController.FindAll);
router.get("/:id", facilityController.findById);
router.post("/create", facilityController.Create);
router.delete("/:id", facilityController.Delete);
router.patch("/update/:id", facilityController.Update);

// Building
router.get("/buildings", buildingController.getAll);
router.get("/buildings/:id", buildingController.findById);
router.get("/:FacilityID/buildings", buildingController.findByFacilityID);
router.delete("/buildings/:id", buildingController.deleteById);
router.post("/:FacilityID/buildings", buildingController.Create);

// Floor`
router.get("/floors/test", floorController.test);
router.get("/floors/:BuildingID", floorController.findById);
router.post("/:BuildingID/floors", floorController.create);
export default router;
