import express from 'express';
import * as ScheduleController from '../Controller/ScheduleController.js';
import { verifyJWT, roleauthorize } from '../middleware/authmiddleware.js';

const router = express.Router();
router.get('/getschedule', ScheduleController.getschedule);
router.post(
  '/addschedule',
  verifyJWT,
  roleauthorize(['admin']),
  ScheduleController.addschedule,
);


export default router;
