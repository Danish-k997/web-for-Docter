import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    title: {
      type: String,
      default: "medical report",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);  

ReportSchema.index({ name: "text", title: "text" });
ReportSchema.index({ status: 1, _id: -1 });
ReportSchema.index({ createdAt: -1, _id: -1 });

const Report = mongoose.model("Report", ReportSchema);
export default Report;
