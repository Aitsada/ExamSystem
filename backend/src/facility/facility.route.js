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
router.post("/:FacilityID/buildings", buildingController.Create);
router.delete("/building/:id", buildingController.deleteById);
router.patch("/building/update/:id", buildingController.update);

// Floor`
router.get("/floors/test", floorController.test);
router.get("/floors/:FloorID", floorController.findById);
router.get("/:BuildingID/floors", floorController.findByBuildingID);
router.post("/:BuildingID/floors", floorController.create);
router.delete("/floor/:id", floorController.Delete)
router.patch("/floor/update/:id", floorController.update);

// Room
router.get("/rooms", roomController.findAll);
router.get("/rooms/:id", roomController.findById);
router.get("/:FloorID/rooms", roomController.findByFloorID);
router.post("/:FloorID/rooms", roomController.create);
router.delete("/room/:id", roomController.Delete);
router.patch("/room/update/:id", roomController.update)
export default router;
