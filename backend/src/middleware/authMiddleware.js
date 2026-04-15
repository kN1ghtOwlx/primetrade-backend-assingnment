import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;
    
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        }

        if (!token) {
        return res.status(401).json({ message: "Unauthorised" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Invalid token" }); 
        };

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();

    } catch (error) {
        res.status(401).json({message: error.message});
        console.log("Error in authMiddleware: ", error.message);
    }
}

export default authMiddleware;