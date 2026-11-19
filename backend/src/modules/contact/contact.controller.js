import { ContactMessage } from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendContactNotificationEmail } from "../../utils/mailer.js";

export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const newMessage = await ContactMessage.create({
    name, email, phone, subject, message
  });

  try {
    await sendContactNotificationEmail({ name, email, phone, subject, message });
  } catch (error) {
    // Keep the enquiry saved in the admin inbox even if SMTP is temporarily unavailable.
    console.error("Contact enquiry was saved, but its email notification failed:", error.message);
  }

  res.status(201).json({ success: true, data: newMessage });
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.findAll({
    order: [["created_at", "DESC"]]
  });
  res.status(200).json({ success: true, data: messages });
});
