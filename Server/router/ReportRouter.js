import express from 'express';
import * as ReportController from '../Controller/ReportController.js';
import upload from '../middleware/multer.js';
import { verifyJWT } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post('/add-report', verifyJWT, upload.array('images', 10), ReportController.addReport); 
router.get('/get-reports', verifyJWT, ReportController.getReports);



export default router