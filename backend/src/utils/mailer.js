import nodemailer from "nodemailer";
import process from "node:process";
import { ApiError } from "./ApiError.js";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new ApiError(503, "Password reset email is not configured. Please contact support.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[character]);
}

export async function sendPasswordResetEmail({ to, name, token }) {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    await getTransporter().sendMail({
      from: `Manyata <${from}>`,
      to,
      subject: "Reset your Manyata password",
      text: `Hi ${name || "there"},\n\nUse this link to reset your Manyata password. It expires in 30 minutes and can only be used once:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>Hi ${escapeHtml(name || "there")},</p><p>We received a request to reset your Manyata password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Password reset email could not be sent:", error.message);
    throw new ApiError(503, "We couldn't send the reset email right now. Please try again later.");
  }
}

export async function sendContactNotificationEmail({ name, email, phone, subject, message }) {
  const to = process.env.CONTACT_SERVICE_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!to || !from) {
    throw new ApiError(503, "Contact notification email is not configured.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject || "Website enquiry");
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  try {
    await getTransporter().sendMail({
      from: `Manyata <${from}>`,
      to,
      replyTo: email,
      subject: `New website enquiry: ${subject || "General enquiry"}`,
      text: [
        "A new enquiry was submitted on Manyata.in.",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Subject: ${subject || "Website enquiry"}`,
        "Message:",
        message,
      ].join("\n"),
      html: `<h2>New Manyata.in enquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Subject:</strong> ${safeSubject}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
    });
  } catch (error) {
    console.error("Contact notification email could not be sent:", error.message);
    throw new ApiError(503, "We couldn't send the contact notification email.");
  }
}
