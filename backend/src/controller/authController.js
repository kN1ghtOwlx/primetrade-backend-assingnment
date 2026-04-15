import User from "../models/User.js";
import tokenAndCookies from "../utils/tokenAndCookies.js";
import bcrypt from "bcryptjs";


export async function authLogin(req, res) {
    try {
        // res.send("Login working!");
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(201).json({ message: "All fields required!" })
        };

        const user = await User.findOne({email});
        if(user){
            const correctPassword = await bcrypt.compare(password, user.password);
            if(!correctPassword){
                return res.status(401).json({message: "Invalid password!!"})
            };

            tokenAndCookies(user._id, res);
            return res.status(200).json({
                message: "User logged in successfully!!",
                user: user.email
            })
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashPassword
        });

        tokenAndCookies(newUser._id, res);
        return res.status(201).json({
            message: "New user created successfully!!",
            user: newUser.email
        })


    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in authLogin", error.message); 
    }
}

export async function authLogout(req, res) {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({message: "Logged out successfully"})

    } catch (error) {
        res.status(500).json({message:"Internal Server eroor"});
        console.error("Error in authLogout", error.message);
    }
}