import { Router } from "express";
import * as facilityController from "./facility.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// /api
router.get("/facility", facilityController.FindAll);
router.get("/facility/:id", facilityController.findById);
router.post("/facility/create", facilityController.Create);
router.post(
  "/facility/import",
  upload.single("file"),
  facilityController.importExcel,
);
router.delete("/facility/:id", facilityController.Delete);
router.patch("/facility/update/:id", facilityController.Update);

export default router;
