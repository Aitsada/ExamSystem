import { Router } from 'express';
import * as seatMappingController from './seatMapping.controller.js';

const router = Router();

// /api
router.get('/seatMapping', seatMappingController.findAll);
router.get('/seatMapping/history', seatMappingController.findHistory);
router.get('/seatMapping/summary', seatMappingController.findSummary);
router.get('/seatMapping/room-counts', seatMappingController.findRoomMappingCounts);
router.get('/seatMapping/position-room-counts', seatMappingController.findPositionRoomMappingCounts);
router.post('/seatMapping/map', seatMappingController.mapPositionToRooms);

router.post('/seatMapping/listOfName', seatMappingController.listOfName);
router.post('/seatMapping/signedDocument', seatMappingController.signedDocument);
router.post('/seatMapping/stickerID', seatMappingController.stickerID);
router.post('/seatMapping/roomLayout', seatMappingController.roomLayout);

export default router;
