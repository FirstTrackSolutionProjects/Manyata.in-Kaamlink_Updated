import { Router } from "express";
import { body } from "express-validator";
import * as authController from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/signup",
  [
    body("full_name").trim().notEmpty().isLength({ max: 120 }).withMessage("Enter a valid name"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("phone").optional({ values: "falsy" }).isLength({ max: 15 }).withMessage("Phone number is too long"),
  ],
  validate,
  authController.signup
);

router.post("/login", [body("email").isEmail().withMessage("Please provide a valid email"), body("password").notEmpty().withMessage("Password is required")], validate, authController.login);
router.get("/me", requireAuth, authController.getMe);

export default router;
