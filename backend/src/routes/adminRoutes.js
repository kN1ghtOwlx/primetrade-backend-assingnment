import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getAllNotes, getAllUsers, getUserNotes, setRole } from "../controller/adminController.js";


const router = Router();

router.get("/all-notes", authMiddleware, requireRole("admin"), getAllNotes);
router.get("/user/:userId", authMiddleware, requireRole("admin"), getUserNotes);
router.get("/users", authMiddleware, requireRole("admin"), getAllUsers)
router.put("/set-role/:userId", authMiddleware, requireRole("admin"), setRole);

export default router;