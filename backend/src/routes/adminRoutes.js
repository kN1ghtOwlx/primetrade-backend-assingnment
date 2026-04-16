import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getAllNotes, getUserNotes } from "../controller/adminController.js";


const router = Router();

router.get("/all-notes", authMiddleware, requireRole("admin"), getAllNotes);
router.get("/user/:userId", authMiddleware, requireRole("admin"), getUserNotes);

export default router;