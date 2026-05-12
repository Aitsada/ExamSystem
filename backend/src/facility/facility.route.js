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
router.get("/:FacilityID/building/:BuildingID", buildingController.findById);
router.get("/:FacilityID/buildings", buildingController.findByFacilityID);
router.post("/:FacilityID/buildings", buildingController.Create);
router.delete("/:FacilityID/building/:BuildingID", buildingController.deleteById);
router.patch("/:FacilityID/building/update/:BuildingID", buildingController.update);

// Floor`
router.get("/floors/test", floorController.test);
router.get("/:BuildingID/floor/:FloorID", floorController.findById);
router.get("/:BuildingID/floors", floorController.findByBuildingID);
router.post("/:BuildingID/floors", floorController.create);
router.delete("/:BuildingID/floor/:FloorID", floorController.Delete);
router.patch("/:BuildingID/floor/update/:FloorID", floorController.update);

// Room
router.get("/rooms", roomController.findAll);
router.get("/:FloorID/room/:RoomID", roomController.findById);
router.get("/:FloorID/rooms", roomController.findByFloorID);
router.post("/:FloorID/rooms", roomController.create);
router.delete("/:FloorID/room/:RoomID", roomController.Delete);
router.patch("/:FloorID/room/update/:RoomID", roomController.update);
export default router;
