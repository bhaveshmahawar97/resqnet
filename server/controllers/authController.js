import { registerUser, loginUser } from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user?.toSafeJSON?.() || req.user;
    return res.status(200).json({
      success: true,
      message: "Current user profile",
      user,
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return sendError(res, { status: 500, message: error.message, error });
  }
};
