import { Router } from "express";
import * as organizationController from "./organization.conrtroller.js";

const router = Router();
//api
router.get("/organization", organizationController.findAll);
router.post("/organization", organizationController.Create);
router.patch("/organization/:id", organizationController.Update);

export default router;
