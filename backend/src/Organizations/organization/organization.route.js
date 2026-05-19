import { Router } from "express";
import * as organizationController from "./organization.conrtroller.js";

const router = Router();
//api
router.get("/organizations", organizationController.findAll);
router.get("/organization/:id", organizationController.findById);
router.post("/organization", organizationController.Create);
router.patch("/organization/:id", organizationController.Update);

// Upload LOGO file
router.get('/organization/:id/logo', organizationController.getLogo)
router.patch('/organization/:id/logo', organizationController.uploadLogo)


export default router;
