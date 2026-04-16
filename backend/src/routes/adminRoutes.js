import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getAllNotes } from "../controller/adminController.js";


const router = Router();

router.get("/all-notes", authMiddleware, requireRole("admin"), getAllNotes)

export default router;