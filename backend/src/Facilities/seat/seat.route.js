import { Router } from "express";
import * as seatController from "./seat.controller.js";

const router = Router();

// /api
router.get("/seat", seatController.findAll);
router.post("/:seatRowID/seat", seatController.Create);

export default router;
