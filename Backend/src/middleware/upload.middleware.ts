import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "employee-management-system",
    allowed_formats: ["jpg", "png", "jpeg"],
  } as any,
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadSingle = upload.single("image");








// For Local Storage for images 

// import multer, { FileFilterCallback } from "multer";
// import { Request } from "express";
// import path from "path";
// import fs from "fs";

// const uploadPath = "uploads/";

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// const storage = multer.diskStorage({
//   destination: (
//     req: Request,
//     file: Express.Multer.File,
//     cb
//   ) => {
//     cb(null, uploadPath);
//   },

//   filename: (
//     req: Request,
//     file: Express.Multer.File,
//     cb
//   ) => {
//     const ext = path.extname(file.originalname);

//     const name = file.originalname
//       .replace(ext, "")
//       .replace(/\s+/g, "-")
//       .toLowerCase();

//     const uniqueName = `${Date.now()}-${name}${ext}`;

//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB
//   },
// });

// export const uploadSingle = upload.single("image");