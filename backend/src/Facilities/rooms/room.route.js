import { Router } from "express";
import * as roomController from "./room.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/rooms", roomController.findAll);
router.get("/:FloorID/room/:RoomID", roomController.findById);
router.get("/:FloorID/rooms", roomController.findByFloorID);
router.post("/:FloorID/room", roomController.Create);
router.post("/:FloorID/rooms/import",upload.single("file"),roomController.importExcel);
router.delete("/:FloorID/room/:RoomID", roomController.Delete);
router.patch("/:FloorID/room/:RoomID", roomController.update);

export default router;
