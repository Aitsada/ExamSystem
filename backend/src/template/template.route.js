import { Router } from "express";
import * as templateController from "./template.controller.js";

const router = Router();

router.get("/template/facility.xls",templateController.downloadFacilityTemplate,);
router.get("/template/building.xls",templateController.downloadBuildingTemplate,);
router.get("/template/floor.xls", templateController.downloadFloorTemplate);
router.get("/template/room.xls", templateController.downloadRoomTemplate);

export default router;
