import { Router } from "express";
import facilityRoute from "./facility/facility.route.js";

const router = Router();
router.use("/api", facilityRoute);

export default router;
