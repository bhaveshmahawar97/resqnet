import { registerUser, loginUser, googleAuthUser } from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import crypto from "crypto";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  sendWelcomeEmail(result.user).catch(err => console.error("Welcome email failed:", err));
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: result.token,
    user: result.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user?.toSafeJSON?.() || req.user;
  return res.status(200).json({
    success: true,
    message: "Current user profile",
    user,
  });
});

export const googleAuth = (req, res) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;
  const role = req.query.role || "user";

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return res.status(500).json({ success: false, message: "Google OAuth is not configured on this server" });
  }

  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  res.cookie("oauth_role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleCallback = asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

  if (error) return res.redirect(`${CLIENT_URL}/auth/callback?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect(`${CLIENT_URL}/auth/callback?error=missing_code`);

  const storedState = req.cookies?.oauth_state;
  const role = req.cookies?.oauth_role || "user";
  
  if (!storedState || storedState !== state) {
    return res.redirect(`${CLIENT_URL}/auth/callback?error=state_mismatch`);
  }

  res.clearCookie("oauth_state");
  res.clearCookie("oauth_role");

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: GOOGLE_REDIRECT_URI, grant_type: "authorization_code" }).toString(),
  });

  if (!tokenRes.ok) {
    console.error("Google token exchange failed:", await tokenRes.text());
    return res.redirect(`${CLIENT_URL}/auth/callback?error=token_exchange_failed`);
  }

  const { access_token } = await tokenRes.json();

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    console.error("Google userinfo fetch failed:", await profileRes.text());
    return res.redirect(`${CLIENT_URL}/auth/callback?error=profile_fetch_failed`);
  }

  const profile = await profileRes.json();
  const { token, user } = await googleAuthUser(profile, role);

  const encodedUser = encodeURIComponent(JSON.stringify(user));
  return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}&user=${encodedUser}`);
});
