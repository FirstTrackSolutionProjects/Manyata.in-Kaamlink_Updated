import { Router } from "express";
import { Op } from "sequelize";
import { body } from "express-validator";
import * as authController from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { CustomerProfilePhoto, User } from "../../models/index.js";
import { parseProfilePhoto, profilePhotoDataUrl } from "../../utils/profilePhoto.js";

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
router.post("/refresh", [body("refreshToken").isString().notEmpty()], validate, authController.refresh);
router.post("/refresh/bootstrap", requireAuth, authController.bootstrapSession);
router.post("/logout", [body("refreshToken").optional().isString()], validate, authController.logout);
router.get("/me", requireAuth, authController.getMe);
router.patch("/me", requireAuth, [
  body("full_name").optional().trim().notEmpty().isLength({ max: 120 }),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("address_line").optional({ values: "falsy" }).trim().isLength({ max: 255 }),
  body("city").optional({ values: "falsy" }).trim().isLength({ max: 100 }),
  body("pincode").optional({ values: "falsy" }).trim().matches(/^[0-9]{6}$/),
], validate, asyncHandler(async (req, res) => {
  if (req.user.role !== "customer") throw new ApiError(403, "Customer profile editing is only available for customer accounts.");
  const keys = ["full_name", "phone", "address_line", "city", "pincode"];
  const updates = Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] || null]));
  if (updates.phone) {
    const duplicate = await User.findOne({ where: { phone: updates.phone, id: { [Op.ne]: req.user.id } } });
    if (duplicate) throw new ApiError(409, "That phone number is already used by another account.");
  }
  await req.user.update(updates);
  res.json({ success: true, data: { user: { id: req.user.id, full_name: req.user.full_name, email: req.user.email, phone: req.user.phone, address_line: req.user.address_line, city: req.user.city, pincode: req.user.pincode } } });
}));
router.put("/me/photo", requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== "customer") throw new ApiError(403, "Customer profile photos are only available for customer accounts.");
  const photo = parseProfilePhoto(req.body?.photo);
  await CustomerProfilePhoto.upsert({ user_id: req.user.id, ...photo });
  res.json({ success: true, data: { profile_photo: profilePhotoDataUrl(photo) } });
}));
router.delete("/me/photo", requireAuth, asyncHandler(async (req, res) => {
  await CustomerProfilePhoto.destroy({ where: { user_id: req.user.id } });
  res.json({ success: true, data: { profile_photo: null } });
}));

export default router;
