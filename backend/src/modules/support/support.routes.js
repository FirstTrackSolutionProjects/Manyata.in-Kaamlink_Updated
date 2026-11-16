import { randomBytes } from "node:crypto";
import { Router } from "express";
import { body } from "express-validator";
import { SupportTicket } from "../../models/index.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/tickets", [
  body("booking_reference").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Booking reference is too long"),
  body("category").optional({ values: "falsy" }).trim().isLength({ max: 120 }).withMessage("Category is too long"),
  body("description").trim().notEmpty().isLength({ max: 10000 }).withMessage("Please describe the issue"),
], validate, asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({
    ticket_ref: `MNY-${randomBytes(5).toString("hex").toUpperCase()}`,
    booking_reference: req.body.booking_reference?.trim() || null,
    category: req.body.category?.trim() || null,
    description: req.body.description.trim(),
  });
  res.status(201).json({ success: true, data: { ticket_ref: ticket.ticket_ref } });
}));

router.get("/tickets", requireAuth, requireRole("admin"), asyncHandler(async (_req, res) => {
  const tickets = await SupportTicket.findAll({ order: [["created_at", "DESC"]] });
  res.json({ success: true, data: tickets });
}));

export default router;
