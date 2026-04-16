import { Router } from "express";
import { createNotes, deleteNotes, getNoteById, seeNotes, updateNote } from "../controller/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router();

router.post("/create", authMiddleware, createNotes);
router.delete("/delete/:id", authMiddleware, deleteNotes);
router.get("/", authMiddleware, seeNotes);
router.put("/update/:id", authMiddleware, updateNote);
router.get("/:id", authMiddleware, getNoteById)

export default router;