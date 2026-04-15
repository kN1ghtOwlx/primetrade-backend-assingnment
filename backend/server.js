import dotenv from "dotenv";
import app from "./src/app.js";
import { connnectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connnectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on PORT: ", PORT)
    })
})