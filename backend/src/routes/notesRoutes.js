import { Router } from "express";
import { createNotes, deleteNotes } from "../controller/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router();

router.post("/create", authMiddleware, createNotes);
router.delete("/delete/:id", authMiddleware, deleteNotes);
router.get("/", authMiddleware, seeNot)


export default router;