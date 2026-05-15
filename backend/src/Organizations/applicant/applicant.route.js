import { Router } from "express";
import * as applicantController from "./applicant.controller.js";

const router = Router();
// api
router.get("/applicants", applicantController.findAll);
router.get("/applicants/:id", applicantController.findById);
router.get(
  "/positions/:PositionID/applicants",
  applicantController.findByPositionID,
);
router.post("/positions/:PositionID/applicants", applicantController.Create);
router.patch(
  "/positions/:PositionID/applicants/:ApplicantID",
  applicantController.Update,
);

export default router;
