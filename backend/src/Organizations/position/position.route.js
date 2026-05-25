import { Router } from "express";
import * as positionController from "./position.controller.js";

const router = Router();
// /api
router.get("/position/:id", positionController.findById);
router.get("/:ExamID/positions", positionController.findByExamID);
router.post("/:ExamID/position", positionController.Create);
router.delete("/position/:id", positionController.Delete);

export default router;
