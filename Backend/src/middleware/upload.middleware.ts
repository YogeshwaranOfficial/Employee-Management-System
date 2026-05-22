import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 1. Get file name without the extension (e.g., "john profile.jpg" -> "john profile")
    const fileBaseName = path.parse(file.originalname).name;

    // 2. Clean spaces and special characters for a safe URL slug
    const cleanFileName = fileBaseName
      .replace(/\s+/g, "-")
      .toLowerCase();

    return {
      folder: "employee-management-system",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: cleanFileName, // Sets the exact clean file name
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export const uploadSingle = upload.single("image");
