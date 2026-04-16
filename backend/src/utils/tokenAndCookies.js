import jwt from "jsonwebtoken";

const tokenAndCookies = (user, res) => {
    const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {
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