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

const Report = mongoose.model("Report", ReportSchema);
export default Report;
