import jwt from "jsonwebtoken";
import UserModel from "../models/Usermodels.js";

export const roleauthorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized request. User not authenticated.",
      });
    }

    const userRole = req.user.role;

    if (!Array.isArray(allowedRoles)) {
      return res.status(500).json({
        message: "allowedRoles must be an array",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized request. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "error.message || 'Unauthorized'" });
  }
};
