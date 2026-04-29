import { Router } from "express";
import { FindAll, Create } from "./facility.controller.js";

const router = Router();
// /api
router.get("/", FindAll);
router.post("/create", Create)
export default router;
