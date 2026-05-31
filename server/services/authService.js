import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/index.js";
import { USER_ROLES } from "../constants/enums.js";

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const formatAuthUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  avatar: user.avatar || "",
  phone: user.phone || "",
  age: user.age || null,
  ngoProfile: user.ngoProfile,
  volunteerProfile: user.volunteerProfile,
  missionStats: user.missionStats,
});

export const registerUser = async ({ fullName, email, password, role }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedName = fullName?.trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const safeRole = USER_ROLES.includes(role) ? role : "user";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: safeRole,
  });

  return {
    token: generateToken(user._id),
    user: formatAuthUser(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !user.isActive) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id);
  return {
    token: generateToken(user._id),
    user: formatAuthUser(safeUser),
  };
};

// Find-or-create a user from a Google OAuth profile.
// Looks up by googleId first, then by email for existing email/password accounts.
export const googleAuthUser = async (profile, requestedRole = "user") => {
  const { id: googleId, email, name, picture } = profile;

  if (!email) {
    const error = new Error("Google account did not provide an email address");
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ googleId });
  if (!user) user = await User.findOne({ email: normalizedEmail });

  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (!user.avatar && picture) user.avatar = picture;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });
  } else {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const safeRole = USER_ROLES.includes(requestedRole) ? requestedRole : "user";

    user = await User.create({
      fullName: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: hashedPassword,
      role: safeRole,
      googleId,
      avatar: picture || "",
      lastLoginAt: new Date(),
    });
  }

  return {
    token: generateToken(user._id),
    user: formatAuthUser(user),
  };
};

export default {
  registerUser,
  loginUser,
  generateToken,
  formatAuthUser,
  googleAuthUser,
};
