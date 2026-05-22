import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
// import fs from "fs";
// import path from "path";

// Constants
const VALID_ROLES = ["ADMIN", "EMPLOYEE"];
const VALID_STATUS = ["ACTIVE", "INACTIVE"];

/**
 * CREATE USER (Admin creates employee)
 */
export const createUserService = async (
  data: any,
  file?: Express.Multer.File
) => {

  //  FIXED VALIDATION
  if (!data.name || !data.email || !data.password) {
    throw new Error("Name, email and password are required");
  }

  const email = data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({where: { email }});

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const role = data.role?.toUpperCase() || "EMPLOYEE";
  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  //  AUTO GENERATE EMPLOYEE ID
  let employeeId: string;

  if (role === "EMPLOYEE") {
    employeeId = await generateEmployeeId();
  } else {
    employeeId = data.employeeId || "EMP-ADMIN-001";
  }

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role,

      imageUrl: file ? file.path : data.imageUrl || null,

      phone: data.phone || null,
      dob: data.dob ? new Date(data.dob) : null,
      gender: data.gender || null,
      employeeId,
      department: data.department || null,
      jobTitle: data.jobTitle || null,
      joiningDate: data.joiningDate
        ? new Date(data.joiningDate)
        : null,
      employmentType: data.employmentType || null,
      status: data.status?.toUpperCase() || "ACTIVE",
    },
  });

  const { password, ...safeUser } = user;

  return safeUser;
};

/**
 * GET ALL USERS (Admin)
 */
export const getUsersService = async () => {
  return prisma.user.findMany({
   where: {
  role: "EMPLOYEE",
  status: "ACTIVE",
},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      employeeId: true,
      department: true,
      jobTitle: true,
      phone: true,
      gender: true,
    },
  });
};

/**
 * GET PROFILE (Logged-in user)
 */
export const getProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      phone: true,
      dob: true,
      gender: true,
      employeeId: true,
      department: true,
      jobTitle: true,
      joiningDate: true,
      employmentType: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * UPDATE USER (Admin or self)
 */
export const updateUserService = async (
  id: number,
  data: any,
  file?: Express.Multer.File
) => {
  const updateData: any = {};

  //Basic fields
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.email !== undefined) {
    const email = data.email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.id !== id) {
      throw new Error("Email already in use");
    }

    updateData.email = email;
  }

  // ptional fields (FIXED: allow empty update)
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.gender !== undefined) updateData.gender = data.gender || null;
  if (data.department !== undefined)
    updateData.department = data.department;
  if (data.jobTitle !== undefined)
    updateData.jobTitle = data.jobTitle;
  if (data.employmentType !== undefined)
    updateData.employmentType = data.employmentType;
  // Dates
  if (data.dob !== undefined) {
    const dob = new Date(data.dob);
    updateData.dob = isNaN(dob.getTime()) ? null : dob;
  }
  if (data.joiningDate !== undefined) {
    const jd = new Date(data.joiningDate);
    updateData.joiningDate = isNaN(jd.getTime()) ? null : jd;
  }
  // Role
  if (data.role !== undefined) {
    const role = data.role.toUpperCase();
    if (!VALID_ROLES.includes(role)) {
      throw new Error("Invalid role");
    }
    updateData.role = role;
  }
  //  Status
  if (data.status !== undefined) {
    const status = data.status.toUpperCase();
    if (!VALID_STATUS.includes(status)) {
      throw new Error("Invalid status");
    }
    updateData.status = status;
  }
  // Password
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  //  Image handling (FIXED)
  if (file) {
    updateData.imageUrl = file.path;
  } else if (data.imageUrl !== undefined) {
    updateData.imageUrl = data.imageUrl;
  }
  //  Prevent empty update
  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }
  //  Update user
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * DELETE USER (Soft delete)
 */
export const deleteUserService = async (id: number) => {

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // 2. Delete image if exists
  // if (user.imageUrl) {
  //   const filePath = path.join(__dirname, "../../uploads", user.imageUrl);
  //   if (fs.existsSync(filePath)) {
  //     fs.unlinkSync(filePath);
  //   }
  // }

  // 3. Delete user from DB
  return prisma.user.delete({
    where: { id },
  });
};



//employee id generation
export const generateEmployeeId = async () => {
  const result: any = await prisma.$queryRaw`
    SELECT MAX(CAST(RIGHT(employeeId, 3) AS INT)) as lastNumber
    FROM [User]
    WHERE role = 'EMPLOYEE'`;

  const lastNumber = result[0]?.lastNumber || 0;

  return `EMP-${String(lastNumber + 1).padStart(3, "0")}`;
};