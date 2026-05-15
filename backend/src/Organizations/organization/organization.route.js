import { Router } from "express";
import * as organizationController from "./organization.conrtroller.js";

const router = Router();
//api
router.get("/organizations", organizationController.findAll);
router.get("/organizations/:id", organizationController.findById);
router.post("/organizations", organizationController.Create);
router.patch("/organizations/:id", organizationController.Update);

export default router;
