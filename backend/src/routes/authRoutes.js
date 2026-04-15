import { Router } from "express";
import { authLogin, authLogout } from "../controller/authController.js";


const router = Router();

router.post("/login", authLogin);
router.post("/logout", authLogout);

export default router;