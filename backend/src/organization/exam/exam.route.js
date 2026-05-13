import { Router } from "express";
import * as examController from "./exam.controller.js";

const router = Router();
// /api
router.post("/:OrganID/exam", examController.Create);
router.patch("/:OraganID/exam/:ExamID", examController.Update);
export default router;
