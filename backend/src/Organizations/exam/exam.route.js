import { Router } from "express";
import * as examController from "./exam.controller.js";

const router = Router();
// /api

router.get("/exam/:id", examController.findById);
router.get("/:OrganID/exams", examController.findByOrganID);
router.post("/:OrganID/exam", examController.Create);
router.patch("/:OrganID/exam/:ExamID", examController.Update);
router.delete("/exam/:id", examController.Delete)

export default router;
