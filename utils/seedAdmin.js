import { User } from "../models/User.js";

export const seedAdminUser = async () => {
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    await User.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    console.log("Default admin user seeded!");
  }
};
