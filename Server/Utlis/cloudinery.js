import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {

  try {

    if (!filePath) return null;

    const normalizedPath = path.resolve(filePath);

    const response = await cloudinary.uploader.upload(
      normalizedPath,
      {
        resource_type: "auto",
      }
    );

    fs.unlinkSync(normalizedPath);

    return response;

  } catch (error) {

    console.log("FULL CLOUDINARY ERROR");
    console.log(error);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};