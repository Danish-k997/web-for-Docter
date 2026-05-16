import ReportModel from "../models/ReportModal.js";
import { uploadToCloudinary } from "../Utlis/cloudinery.js";

export const addReport = async (req, res) => {
  try {
    const { name, date } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // Validation
    if ([name, date].some((field) => !field?.trim())) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Files validation
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    console.log("req.files", req.files);
    // Extract local paths
    const localImagePaths = req.files.map((file) => file.path);
    console.log("local paths", localImagePaths);
    // Upload promises
    const uploadPromises = localImagePaths.map((path) =>
      uploadToCloudinary(path),
    );

    console.log("uploadPromises", uploadPromises);

    // Parallel upload
    const uploadedImages = await Promise.all(uploadPromises);
    console.log("uploadedImages", uploadedImages);
    // Remove failed uploads
    const images = uploadedImages.filter(Boolean).map((response) => ({
      url: response.secure_url,
      publicId: response.public_id,
    }));
    console.log("uploded img", images);

    // Check uploads
    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload images",
      });
    }

    // Save report
    const newReport = await ReportModel.create({
      userId,
      name,
      date,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Report added successfully",
      data: newReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
