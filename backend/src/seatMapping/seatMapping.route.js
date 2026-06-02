import { Router } from 'express';
import * as seatMappingController from './seatMapping.controller.js';

const router = Router();

// /api
router.get('/seatMapping', seatMappingController.findAll);
router.get('/seatMapping/room-counts', seatMappingController.findRoomMappingCounts);
router.post('/seatMapping/map', seatMappingController.mapPositionToRooms);

export default router;
