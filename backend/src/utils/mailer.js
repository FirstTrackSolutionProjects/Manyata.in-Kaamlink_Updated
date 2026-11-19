import nodemailer from "nodemailer";
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
  return value.replace(/[&<>\"']/g, (character) => ({
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
