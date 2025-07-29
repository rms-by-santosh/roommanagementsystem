import { Request } from "../models/Request.js";
import { User } from "../models/User.js";
import { addEntryToCurrentSheet } from "./sheetController.js";
import { transporter } from "../config/mail.js";
import { approvalMail, rejectionMail } from "../utils/mailTemplates.js";

// Create request (user)
export const createRequest = async (req, res, next) => {
  try {
    const { dop, particulars, amount } = req.body;
    const userId = req.user._id;
    const request = await Request.create({
      dop,
      particulars,
      amount,
      user: userId,
    });
    res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    next(err);
  }
};

// Get all requests (admin), or own requests (user)
export const getRequests = async (req, res, next) => {
  try {
    let requests;
    if (req.user.role === "admin") {
      requests = await Request.find().populate("user", "username email");
    } else {
      requests = await Request.find({ user: req.user._id });
    }
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// Approve request (admin)
export const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).populate("user", "username email");
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Add to current sheet
    await addEntryToCurrentSheet({
      dop: request.dop,
      particulars: request.particulars,
      amount: request.amount,
      paidBy: request.user.username,
    });

    request.status = "approved";
    await request.save();

    // Send approval email
    await transporter.sendMail({
      to: request.user.email,
      ...approvalMail(request.user.username, `${request.particulars} - ${request.amount}`),
    });

    res.json({ message: "Request approved and added to sheet" });
  } catch (err) {
    next(err);
  }
};

// Reject request (admin)
export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).populate("user", "username email");
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    // Send rejection email
    await transporter.sendMail({
      to: request.user.email,
      ...rejectionMail(request.user.username, `${request.particulars} - ${request.amount}`),
    });

    res.json({ message: "Request rejected" });
  } catch (err) {
    next(err);
  }
};
