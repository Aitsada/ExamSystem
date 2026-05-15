import { Router } from "express";
import * as roomController from "./room.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/rooms", roomController.findAll);
router.get("/:FloorID/rooms/:RoomID", roomController.findById);
router.get("/:FloorID/rooms", roomController.findByFloorID);
router.post("/:FloorID/rooms", roomController.create);
router.post(
  "/:FloorID/rooms/import",
  upload.single("file"),
  roomController.importExcel,
);
router.delete("/:FloorID/rooms/:RoomID", roomController.Delete);
router.patch("/:FloorID/rooms/:RoomID", roomController.update);

export default router;
