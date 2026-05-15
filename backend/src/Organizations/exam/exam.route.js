import { Router } from "express";
import * as examController from "./exam.controller.js";

const router = Router();
// /api

router.get("/exams/:id", examController.findById);
router.get("/organizations/:OrganID/exams", examController.findByOrganID);
router.post("/organizations/:OrganID/exams", examController.Create);
router.patch("/organizations/:OrganID/exams/:ExamID", examController.Update);
export default router;
