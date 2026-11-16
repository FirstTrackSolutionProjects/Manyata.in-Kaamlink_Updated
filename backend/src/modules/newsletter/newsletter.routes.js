import { Router } from "express";
import { body } from "express-validator";
import { NewsletterSubscription } from "../../models/index.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/", [body("email").trim().isEmail().normalizeEmail().withMessage("Please provide a valid email")], validate, asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const [subscription, created] = await NewsletterSubscription.findOrCreate({ where: { email }, defaults: { email, is_active: true } });
  if (!created && !subscription.is_active) await subscription.update({ is_active: true });
  res.status(created ? 201 : 200).json({ success: true, data: { subscribed: true } });
}));

router.get("/", requireAuth, requireRole("admin"), asyncHandler(async (_req, res) => {
  const subscriptions = await NewsletterSubscription.findAll({ where: { is_active: true }, order: [["created_at", "DESC"]], attributes: ["id", "email", "created_at"] });
  res.json({ success: true, data: subscriptions });
}));

export default router;
