import jwt from "jsonwebtoken";

export const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/"
    };
};

const tokenAndCookies = (user, res) => {
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", token, getCookieOptions());
    return token;
  };

export default tokenAndCookies;