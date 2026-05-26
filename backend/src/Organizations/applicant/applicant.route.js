import { Router } from "express";
import * as applicantController from "./applicant.controller.js";
import { uploadExcel } from "../../utils/excelUpload.js";

const router = Router();
// /api
router.get("/applicants", applicantController.findAll);
router.get("/applicant/:id", applicantController.findById);
router.get("/:PositionID/applicants",applicantController.findByPositionID,);
router.post("/:PositionID/applicant", applicantController.Create);
router.post("/:PositionID/applicants/import",uploadExcel.single("file"),applicantController.importExcel);
router.patch("/:PositionID/applicants/:ApplicantID",applicantController.Update);

export default router;
