import UserModel from "../models/Usermodels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Sessionmodal from "../models/Sessionmodal.js";
import crypto from "crypto";
import optModel from "../models/OtpModal.js";
import { generateOtp, getopthtml } from "../Utlis/utlis.js";
import { Sendemail } from "../Services/email.services.js";

const genrateaccesstoken = (usedId) => {
  return jwt.sign({ userId: usedId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const genraterefreshtoken = (usedId) => {
  return jwt.sign({ userId: usedId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const otp = genreteotp();
  const html = getopthtml(otp);

  const Haseotp = crypto.createHash("sha256").update(otp).digest("hex");

  await optModel.create({
    email,
    user: newUser._id,
    Haseotp,
  });

  await Sendemail(email, "OTP VERIFACTION", `your otp is ${otp}`, html);

  res.status(200).json({
    message: "user register successfully",
    username: newUser.username,
    email: newUser.email,
    userverifde: newUser.Verified,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "user not found" });
  }

  if (!user.Verified) {
    return res.status(401).json({ message: "user not verified" });
  }

  const ispasswordvalid = await bcrypt.compare(password, user.password);

  if (!ispasswordvalid) {
    return res.status(401).json({ message: "invalid password or email" });
  }

  const refreshtoken = genraterefreshtoken(user._id);

  const haserefreshtoken = crypto
    .createHash("sha256")
    .update(refreshtoken)
    .digest("hex");

  const session = await Sessionmodal.create({
    User: user._id,
    refreshtoken: haserefreshtoken,
    Ip: req.ip,
    UserAgent: req.headers["user-agent"],
  });

  const accessToken = genrateaccesstoken(user._id);

  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "login successfully", accessToken });
};

export const getme = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized token not found" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;

  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(201).json({
    message: "user fetch successfully",
    user: { username: user.username, email: user.email },
  });
};

export const refreshtoken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "refresh token not found" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const haserefreshtoken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Sessionmodal.findOne({
      refreshtoken: haserefreshtoken,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({ message: "invalid refresh token" });
    }

    const accesstoken = genrateaccesstoken(userId);

    const refreshtoken = genraterefreshtoken(userId);

    const newhaserefreshtoken = crypto
      .createHash("sha256")
      .update(refreshtoken)
      .digest("hex");

    session.refreshtoken = newhaserefreshtoken;
    await session.save();

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "accesstoken refresh sucessfully", accesstoken });
  } catch (error) {
    res.status(401).json({ message: "invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "refresh token not found" });
  }

  const haserefreshtoken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await Sessionmodal.findOne({
    refreshtoken: haserefreshtoken,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({ message: "invalid refresh token" });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logout successful" });
};

export const logoutall = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "refresh token not found" });
  }

  const decode = jwt.verify(refreshToken, process.env.JWT_SECRET);

  await Sessionmodal.updateMany(
    {
      User: decode.userId,
      revoked: false,
    },
    {
      revoked: true,
    },
  );

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logout From all devices successful" });
};

export const verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  const Haseotp = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = optModel.findOne({
    email,
    Haseotp,
  });

  if (!otpDoc) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const user = await UserModel.findByIdAndUpdate(otpDoc.user, {
    Verified: true,
  });

  const deleteotp = await optModel.deleteMany({
    user: otpDoc.user,
  });

  return res.status(200).json({
    message: "email verifaied successfully",
    user: {
      username: user.username,
      email: user.email,
      Verified: user.Verified,
    },
  });
};
