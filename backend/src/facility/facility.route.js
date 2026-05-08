import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import * as buildingController from "./buildings/building.controller.js";
import * as floorController from "./floors/floors.controller.js";
import * as roomController from "./rooms/room.controller.js";
const router = Router();
// /api
// Facility
router.get("/facility", facilityController.FindAll);
router.get("/facility/:id", facilityController.findById);
router.post("/facility/create", facilityController.Create);
router.delete("/facility/:id", facilityController.Delete);
router.patch("/facility/update/:id", facilityController.Update);

// Building
router.get("/buildings", buildingController.getAll);
router.get("/buildings/:id", buildingController.findById);
router.get("/:FacilityID/buildings", buildingController.findByFacilityID);
router.delete("/buildings/:id", buildingController.deleteById);
router.post("/:FacilityID/buildings", buildingController.Create);

// Floor`
router.get("/floors/test", floorController.test);
router.get("/floors/:FloorID", floorController.findById);
router.get("/:BuildingID/floors", floorController.findByBuildingID);
router.post("/:BuildingID/floors", floorController.create);

// Room
router.get("/rooms", roomController.findAll);
router.post("/:FloorID/rooms", roomController.create);
export default router;
