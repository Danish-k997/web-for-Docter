import UserModel from "../models/Usermodels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Sessionmodal from "../models/Sessionmodal.js";
import crypto from "crypto";
import optModel from "../models/OtpModal.js";
import { generateOtp, getopthtml } from "../Utlis/utlis.js";
import { Sendemail } from "../Services/email.services.js";

// --- HELPERS (Logic Centralization) ---

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// --- CONTROLLERS ---

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const otp = generateOtp();
  const html = getopthtml(otp);
  const hashedOtp = hashToken(otp);

  await optModel.create({
    email,
    user: newUser._id,
    Haseotp: hashedOtp,
  });

  await Sendemail(email, "OTP VERIFICATION", `Your OTP is ${otp}`, html);

  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
    user: {
      username: newUser.username,
      email: newUser.email,
      verified: newUser.Verified,
      userId:newUser.userId
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Industry Standard: Password ko model mein select: false rakhein aur yahan mangwayein
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.Verified) {
    return res
      .status(403)
      .json({ message: "Account not verified. Check your email." });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  const hashedRT = hashToken(refreshToken);

  await Sessionmodal.create({
    User: user._id,
    refreshtoken: hashedRT,
    Ip: req.ip,
    UserAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login successful", accessToken });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "User ID and O   TP are required",
    });
  }

  const hashedOtp = hashToken(otp);

  const otpDoc = await optModel.findOne({
    user: userId,
    Haseotp: hashedOtp,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP. Please request a new one.",
    });
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { Verified: true },
    { new: true, runValidators: true },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await optModel.deleteMany({ user: userId });
  const { accessToken, refreshToken } = generateTokens(user._id);
  const hashedRT = hashToken(refreshToken);

  await Sessionmodal.create({
    User: user._id,
    refreshtoken: hashedRT,
    Ip: req.ip,
    UserAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      userId: user._id,
      verified: user.Verified,
    },
    accessToken, 
  });
});

export const getme = asyncHandler(async (req, res) => {
  // Logic: Token decoding middleware mein honi chahiye (protect middleware)
  // Phir bhi as per your code:
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  res
    .status(200)
    .json({ user: { username: user.username, email: user.email } });
});

export const refreshtoken = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
  const hashedOldRT = hashToken(oldRefreshToken);

  const session = await Sessionmodal.findOne({
    refreshtoken: hashedOldRT,
    revoked: false,
  });
  if (!session) return res.status(401).json({ message: "Invalid session" });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    decoded.userId,
  );
  const hashedNewRT = hashToken(newRefreshToken);

  // Token Rotation: Update session with NEW hash
  session.refreshtoken = hashedNewRT;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const hashedRT = hashToken(refreshToken);
    await Sessionmodal.findOneAndUpdate(
      { refreshtoken: hashedRT },
      { revoked: true },
    );
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

export const logoutall = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No token found" });

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  await Sessionmodal.updateMany(
    { User: decoded.userId, revoked: false },
    { revoked: true },
  );

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out from all devices" });
});
