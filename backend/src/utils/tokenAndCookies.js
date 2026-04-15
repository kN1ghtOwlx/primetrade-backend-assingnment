import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tokenAndCookies = (userId, res) => {
    const token = jwt.sign({userId, role: User.role}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true
    });

    return token;
}

export default tokenAndCookies;