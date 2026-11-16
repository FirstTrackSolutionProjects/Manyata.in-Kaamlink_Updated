import { Router } from "express";
import { createMessage, getAllMessages } from "./contact.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { body } from "express-validator";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.post("/", [
  body("name").trim().notEmpty().isLength({ max: 120 }).withMessage("Enter your name"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("phone").optional({ values: "falsy" }).isLength({ max: 15 }).withMessage("Phone number is too long"),
  body("subject").optional({ values: "falsy" }).isLength({ max: 200 }).withMessage("Subject is too long"),
  body("message").trim().notEmpty().withMessage("Message is required"),
], validate, createMessage);
router.get("/", requireAuth, requireRole("admin"), getAllMessages);

export default router;
