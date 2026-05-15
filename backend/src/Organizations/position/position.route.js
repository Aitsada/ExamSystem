import { Router } from "express";
import * as positionController from "./position.controller.js";

const router = Router();
router.get("/exams/:ExamID/positions", positionController.findByExamID);
router.post("/exams/:ExamID/positions", positionController.Create);

export default router;
