import express from 'express';
import * as ReportController from '../Controller/ReportController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/add-report', upload.array('images', 10), ReportController.addReport); 




export default router