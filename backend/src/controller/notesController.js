import Notes from "../models/Notes.js";


export async function createNotes(req, res) {
    try {
        // res.send("Note created successfully!");
        const {title, description} = req.body;

        const note = await Notes.create({
            title,
            description,
            userId: req.user.id
        });;

        return res.status(201).json({
            message: "Note created successfully",
            note: note
        })

    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in createNotes", error.message);
    }
};

export async function deleteNotes(req, res) {
    try {
        const noteId = req.params.id;

        const note = await Notes.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }

        await note.deleteOne();

        return res.status(200).json({
            message: "Note deleted successfully!!"
        });
        
    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in deleteNotes", error.message);
    }
};

export async function seeNotes(req, res) {
    try {
        const notes = await Notes.find({ userId: req.user.id }).populate("userId", "name email role").sort({ createdAt: -1 });

        return res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in seeNotes", error.message);
    }
};

export async function updateNote(req, res) {
    try {
        const noteId = req.params.id;
        const {title, description} = req.body;
        
        const note = await Notes.findById(noteId);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
      
        if (
            note.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not allowed" });
        }
      
        if (title) note.title = title;
        if (description) note.description = description;
      
        await note.save();
      
        return res.status(200).json({
            message: "Note updated successfully",
            note
        });
      
    } catch (error) {
          console.error("Error in updateNote:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}