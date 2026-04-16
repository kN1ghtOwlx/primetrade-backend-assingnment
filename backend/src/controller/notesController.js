import Notes from "../models/Notes.js";


export async function createNotes(req, res) {
    try {
        // res.send("Note created successfully!");
        const {title, description} = req.body;

        const note = await Notes.create({
            title,
            description,
            userId: req.userId
        });;

        return res.status(201).json({
            message: "Note created successfully",
            note: note
        })

    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in createNotes", error.message);
    }
}