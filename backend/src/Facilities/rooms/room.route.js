import { Router } from "express";
import * as roomController from "./room.controller.js";
import { uploadExcel } from "../../utils/excelUpload.js";

const router = Router();

router.get("/rooms", roomController.findAll);
router.get("/:FloorID/room/:RoomID", roomController.findById);
router.get("/:FloorID/rooms", roomController.findByFloorID);
router.post("/:FloorID/room", roomController.Create);
router.post("/:FloorID/rooms/import",uploadExcel.single("file"),roomController.importExcel);
router.delete("/:FloorID/room/:RoomID", roomController.Delete);
router.patch("/:FloorID/room/:RoomID", roomController.update);

router.post("/:FloorID/roomConn", roomController.createRoomWithSeats)
export default router;
