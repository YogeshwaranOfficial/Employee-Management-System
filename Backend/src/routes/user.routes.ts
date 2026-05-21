import { Router } from "express";
import {  createEmployee,  getUsers,  getProfile,  updateUser,  deleteUser } from "../controllers/user.controller";
import { uploadSingle } from "../middleware/upload.middleware";
import { verifyToken, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// Create employee (Admin only)
router.post( "/",  verifyToken,  isAdmin,  uploadSingle,  createEmployee);

// Get all users (Admin only)
router.get("/", verifyToken, isAdmin, getUsers);

// Get logged-in user profile
router.get("/me", verifyToken, getProfile);

// Update user (Admin OR self)
router.patch(  "/:id",  verifyToken,  updateUser);

// Delete user (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;