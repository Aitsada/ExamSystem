import { Router } from "express";
import { FindAll, Create, Delete, Update } from "./facility.controller.js";

const router = Router();
// /api
router.get("/", FindAll);
router.post("/create", Create);
router.delete("/:id", Delete);
router.patch("/update/:id", Update);
export default router;
