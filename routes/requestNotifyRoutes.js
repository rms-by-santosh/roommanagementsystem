import express from "express";
import { Request } from "../models/Request.js";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Setup mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // use true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// POST /api/notify/:id → Send email about approval/rejection
router.post("/notify/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id).populate("user");
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (!request.user || !request.user.email) {
      return res.status(404).json({ message: "User or user email not found." });
    }

    const { username, email } = request.user;
    const { amount, status } = request;

    const mailOptions = {
      from: `Room Management System <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Request Status Update",
      html: `
        <p>Dear <strong>${username}</strong>,</p>
        <p>Your request of amount <strong>${amount}</strong> has been <strong>${status}</strong>.</p>
        <p>Thank you,<br/>Room Management Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    res.status(200).json({ message: "Email sent." });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    res.status(500).json({ message: "Failed to send email." });
  }
});

export default router;
