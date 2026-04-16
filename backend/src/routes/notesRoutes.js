import { Router } from "express";
import { createNotes } from "../controller/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router();

router.post("/create", authMiddleware, createNotes);

export default router;