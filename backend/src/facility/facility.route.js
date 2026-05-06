import { Router } from "express";
import * as facilityController from "./facility.controller.js";

const router = Router();
// /api
router.get("/", facilityController.FindAll);
router.post("/create", facilityController.Create);
router.delete("/:id", facilityController.Delete);
router.patch("/update/:id", facilityController.Update);
export default router;
