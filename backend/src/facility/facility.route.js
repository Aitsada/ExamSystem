import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import * as buildingController from "./building.controller.js";

const router = Router();
// /api
router.get("/", facilityController.FindAll);
router.post("/create", facilityController.Create);
router.delete("/:id", facilityController.Delete);
router.patch("/update/:id", facilityController.Update);

// /api
router.get("/building", buildingController.getAll);

export default router;
