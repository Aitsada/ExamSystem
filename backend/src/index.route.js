import { Router } from "express";
import facilityRoute from "./facility/facility.route.js";
import organizationRoute from "./organization/organization.route.js";
import examRoute from "./organization/exam/exam.route.js";
import positionRoute from "./organization/position/position.route.js";

const router = Router();

router.use("/api", facilityRoute);
router.use("/api", organizationRoute);
router.use("/api", examRoute);
router.use("/api", positionRoute);
export default router;
