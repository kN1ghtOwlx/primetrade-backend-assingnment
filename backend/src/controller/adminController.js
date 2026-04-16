import Notes from "../models/Notes.js";

export async function getAllNotes(req, res) {
  try {

    const query = {};

    if (req.user.role !== "admin") {
        query.userId = req.user.id;
    }

    const notes = await Notes.find(query).populate("userId", "name email role").sort({ createdAt: -1 });

    return res.status(200).json({
        count: notes.length,
        notes
    });

  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Error in getAllNotes:", error.message);
  }
}