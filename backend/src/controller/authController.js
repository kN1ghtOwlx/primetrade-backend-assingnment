import User from "../models/User.js";
import tokenAndCookies, { getCookieOptions } from "../utils/tokenAndCookies.js";
import bcrypt from "bcryptjs";

export async function authLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required!" });
        }

        const user = await User.findOne({ email });

        if (user) {
            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                return res.status(401).json({ message: "Invalid password!!" });
            }

            const token = tokenAndCookies(user, res);
            return res.status(200).json({
              message: "User logged in successfully!!",
              token,
              user: { id: user._id, email: user.email, role: user.role }
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashPassword
        });

        const token = tokenAndCookies(newUser, res);
        return res.status(201).json({
          message: "New user created successfully!!",
          token,  // add this
          user: { id: newUser._id, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
        console.error("Error in authLogin", error.message);
    }
}

export async function authLogout(req, res) {
    try {
        res.clearCookie("jwt", {
            ...getCookieOptions(),
            maxAge: 0
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
        console.error("Error in authLogout", error.message);
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
        console.error("Error in getMe", error.message);
    }
}