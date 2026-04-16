import Notes from "../models/Notes.js";
import User from "../models/User.js";

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

export async function getUserNotes(req, res) {
  try {
    const { userId } = req.params;

    const notes = await Notes.find({ userId }).populate("userId", "name email role").sort({ createdAt: -1 });

    return res.status(200).json({
        count: notes.length,
        notes
    });

  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error("Error in getUserNotes:", error.message);
  }
};

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
          count: users.length,
          users
    });

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
        console.error("Error in getAllUsers:", error.message);
    }
};

export async function setRole(req, res) {
  try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      return res.status(200).json({
          message: "User role updated successfully",
          user: {
              id: user._id,
              email: user.email,
              role: user.role
          }
      });
  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error("Error in setRole:", error.message);
  }
}