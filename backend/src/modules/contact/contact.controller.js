import { ContactMessage } from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const newMessage = await ContactMessage.create({
    name, email, phone, subject, message
  });

  res.status(201).json({ success: true, data: newMessage });
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.findAll({
    order: [["created_at", "DESC"]]
  });
  res.status(200).json({ success: true, data: messages });
});