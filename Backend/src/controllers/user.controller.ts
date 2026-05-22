import { Request, Response } from "express";
import { createUserService,  getUsersService,  getProfileService,  updateUserService,  deleteUserService } from "../services/user.service";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    console.log("REQ FILE:", req.file);
    const file = req.file; 
    // const imageUrl = req.file?.path || "";
    const user = await createUserService(req.body, file); 
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
  console.error("CREATE EMPLOYEE ERROR:", error);

  res.status(400).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getProfileService(req.user!.id);
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    console.log("REQ BODY ", req.body);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (
      req.user!.role !== "ADMIN" &&
      req.user!.id !== userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const file = req.file;

    const user = await updateUserService(userId, req.body, file);
    res.json({ success: true, data: user });

  } catch (error: any) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await deleteUserService(userId);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};