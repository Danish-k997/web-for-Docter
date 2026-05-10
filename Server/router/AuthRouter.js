import express from "express";
import * as authRouter from "../Controller/AuthController.js";

const router = express.Router();

router.post("/register", authRouter.register);
router.post("/login", authRouter.login);
router.get("/getme", authRouter.getme);
router.get("/refresh-token", authRouter.refreshtoken)
router.get("/logout", authRouter.logout)
router.get("/logoutall", authRouter.logoutall)
router.post("/verifyotp", authRouter.verifyotp)


export default router;