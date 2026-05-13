import { Router } from "express";
import * as positionController from "./position.controller.js";

const router = Router();

router.post("/position", positionController.Create);

export default router;
