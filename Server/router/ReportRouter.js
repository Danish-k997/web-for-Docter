import express from "express";
import * as ReportController from "../Controller/ReportController.js";
import upload from "../middleware/multer.js";
import { verifyJWT, roleauthorize } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post(
  "/add-report",
  verifyJWT,
  upload.array("images", 10),
  ReportController.addReport,
);
router.get("/get-reports", verifyJWT, ReportController.getReports);
router.get(
  "/get-all-reports",
  verifyJWT,
  roleauthorize(["admin"]),
  ReportController.getAllReports,
);

export default router;
