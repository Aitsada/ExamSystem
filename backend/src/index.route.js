import { Router } from "express";
import facilityRoute from "./Facilities/facility/facility.route.js";
import buildingRoute from "./Facilities/buildings/building.route.js";
import floorRoute from "./Facilities/floors/floor.route.js";
import roomRoute from "./Facilities/rooms/room.route.js";
import templateRoute from "./template/template.route.js";

import organizationRoute from "./Organizations/organization/organization.route.js";
import examRoute from "./Organizations/exam/exam.route.js";
import positionRoute from "./Organizations/position/position.route.js";
import applicantRoute from "./Organizations/applicant/applicant.route.js";
const router = Router();

// Facility
router.use("/api", facilityRoute);
router.use("/api", buildingRoute);
router.use("/api", floorRoute);
router.use("/api", roomRoute);
router.use("/api", templateRoute);

// Organization
router.use("/api", organizationRoute);
router.use("/api", examRoute);
router.use("/api", positionRoute);
router.use("/api", applicantRoute);

export default router;
