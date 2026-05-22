import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // CHECK AUTH HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // GET USER (password excluded via schema select:false)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};

export default authMiddleware;