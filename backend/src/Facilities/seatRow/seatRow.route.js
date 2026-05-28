import { Router } from "express";
import * as seatRowController from "./seatRow.controller.js";

const router = Router();

// /api
router.get("/seatRow", seatRowController.findAll);
router.post("/:roomID/seatRow", seatRowController.Create);

export default router;
