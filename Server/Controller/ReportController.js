import ReportModel from "../models/ReportModal.js";
import { uploadToCloudinary } from "../Utlis/cloudinery.js";

export const addReport = async (req, res) => {
  try {
    const { name, date, title } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // Validation
    if ([name, date, title].some((field) => !field?.trim())) {
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

    // Extract local paths
    const localImagePaths = req.files.map((file) => file.path);
    // Upload promises
    const uploadPromises = localImagePaths.map((path) =>
      uploadToCloudinary(path),
    );

    // Parallel upload
    const uploadedImages = await Promise.all(uploadPromises);
    // Remove failed uploads
    const images = uploadedImages.filter(Boolean).map((response) => ({
      url: response.secure_url,
      public_id: response.public_id,
    }));

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
      title,
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

export const getReports = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User session not found",
    });
  }
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      20,
    );
    const skip = (page - 1) * limit;

    const [reports, totalReports] = await Promise.all([
      ReportModel.find({ userId })
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReportModel.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      pagination: {
        totalItems: totalReports,
        currentPage: page,
        totalPages: Math.ceil(totalReports / limit),
        itemsPerPage: limit,
      },
      data: reports,
    });
  } catch (error) {
    console.error(`[GetReports Error]: ${error.message}`, { userId, error });

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export const getallReports = async (req, res) => {
  try {
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit, 10) || 10),
    );

    const { status, search, fromDate, toDate, cursor } = req.query;

    const queryFilter = {};

    const allowedStatuses = ["pending", "completed"];

    if (status && allowedStatuses.includes(status)) {
      queryFilter.status = status;
    }

    if (search?.trim()) {
      queryFilter.$text = {
        $search: search,
      };
    }

    if (fromDate || toDate) {
      queryFilter.createdAt = {};
    }

    if (fromDate) {
      queryFilter.createdAt.$gte = new Date(fromDate);
    }

    if (toDate) {
      queryFilter.createdAt.$lte = new Date(toDate);
    }

    // CURSOR PAGINATION
    if (cursor) {
      queryFilter._id = {
        $lt: cursor,
      };
    }

    let reports = await ReportModel.find(queryFilter)
      .select("-__v")
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    // CHECK NEXT PAGE
    const hasNextPage = reports.length > limit;

    // REMOVE EXTRA ITEM
    if (hasNextPage) {
      reports.pop();
    }
    // NEXT CURSOR
    const nextCursor = reports[reports.length - 1]?._id;

    return res.status(200).json({
      success: true,
      message: "All reports fetched successfully",
      hasNextPage,
      nextCursor,
      data: reports,
    });
  } catch (error) {
    console.error(
      `[GetAllReports Error]:
       ${error.message}`,
      { error },
    );

    return res.status(500).json({
      success: false,

      message: "An internal server error occurred.",
    });
  }
};

