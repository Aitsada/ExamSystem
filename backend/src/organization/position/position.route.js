import { Router } from "express";
import * as positionController from "./position.controller.js";

const router = Router();
router.get("/:ExamID/position", positionController.findByExamID);
router.post("/:ExamID/position", positionController.Create);

export default router;
