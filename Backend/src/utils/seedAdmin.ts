import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail.toLowerCase(),
          password: hashedPassword,
          role: "ADMIN",

          employeeId: "ADMIN-001",

          imageUrl: "admin.png", // or null
          status: "ACTIVE",
        },
      });

      console.log(`Admin created: ${adminEmail}`);
    } else {
      console.log(" Admin already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};