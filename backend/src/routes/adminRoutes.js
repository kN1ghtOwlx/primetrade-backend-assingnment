import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getAllNotes, getAllUsers, getUserNotes, makeAdmin } from "../controller/adminController.js";


const router = Router();

router.get("/all-notes", authMiddleware, requireRole("admin"), getAllNotes);
router.get("/user/:userId", authMiddleware, requireRole("admin"), getUserNotes);
router.get("/users", authMiddleware, requireRole("admin"), getAllUsers)
router.put("/make-admin/:userId", authMiddleware, requireRole("admin"), makeAdmin);

export default router;