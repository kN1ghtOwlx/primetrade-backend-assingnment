import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Api running successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
