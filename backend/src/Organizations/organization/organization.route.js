import { Router } from "express";
import fileUpload from "express-fileupload";
import * as organizationController from "./organization.conrtroller.js";

const router = Router();
const upload = fileUpload({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  abortOnLimit: true,
});

//api
router.get("/organizations", organizationController.findAll);
router.get("/organization/:id", organizationController.findById);
router.post("/organization", upload, organizationController.Create);
router.patch("/organization/:id", organizationController.Update);
router.delete("/organization/:id", organizationController.Delete);

// Upload LOGO file
router.get("/organization/:id/logo", organizationController.getLogo);
router.patch("/organization/:id/logo", upload, organizationController.uploadLogo);

export default router;
