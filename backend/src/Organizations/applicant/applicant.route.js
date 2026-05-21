import { Router } from "express";
import * as applicantController from "./applicant.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
// /api
router.get("/applicants", applicantController.findAll);
router.get("/applicant/:id", applicantController.findById);
router.get("/:PositionID/applicants",applicantController.findByPositionID,);
router.post("/:PositionID/applicant", applicantController.Create);
router.post("/:PositionID/applicants/import",upload.single("file"),applicantController.importExcel);
router.patch("/:PositionID/applicants/:ApplicantID",applicantController.Update);

export default router;
