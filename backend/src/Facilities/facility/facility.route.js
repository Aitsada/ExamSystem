import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import { uploadExcel } from "../../utils/excelUpload.js";

const router = Router();

// /api
router.get("/facilities", facilityController.FindAll);
router.get("/facility/:id", facilityController.findById);
router.post("/facility/create", facilityController.Create);
router.post(
  "/facility/import",
  uploadExcel.single("file"),
  facilityController.importExcel,
);
router.delete("/facility/:id", facilityController.Delete);
router.patch("/facility/update/:id", facilityController.Update);

export default router;
