import { Router } from "express";
import { authLogin, authLogout, getMe } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router();

router.post("/login", authLogin);
router.post("/logout",authMiddleware, authLogout);
router.get("/me",authMiddleware, getMe);

export default router;