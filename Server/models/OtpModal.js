import mongoose from "mongoose";

const optSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
      index: true,
    },
    Haseotp: {
      type: String,
      required: [true, "otp is required"],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: "10m" },
    },
  },
  {
    timestamps: true,
  },
);

optSchema.index({ userId: 1, hashedOtp: 1 });

const OtpModel = mongoose.model("otps", optSchema);

export default OtpModel;
