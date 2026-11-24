import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import * as authController from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { CustomerProfilePhoto, Professional, User, City } from "../../models/index.js";
import { parseProfilePhoto } from "../../utils/profilePhoto.js";
import { removeProfilePhotoObject, saveProfilePhoto } from "../../utils/profilePhotoStorage.js";

const router = Router();
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many password reset attempts. Please try again in 15 minutes." },
});

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
router.post("/forgot-password", passwordResetLimiter, [body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail()], validate, authController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, [
  body("token").isString().isLength({ min: 32, max: 256 }).withMessage("This reset link is invalid or expired."),
  body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password must be between 8 and 128 characters."),
], validate, authController.resetPassword);
router.post("/google", [body("credential").isString().notEmpty().withMessage("Google credential is required")], validate, authController.googleLogin);
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
  body("bio").optional({ nullable: true }).isLength({ max: 5000 }),
  body("experience_years").optional().isInt({ min: 0, max: 60 }),
  body("city_id").optional({ nullable: true }).isInt({ min: 1 }),
], validate, asyncHandler(async (req, res) => {
  const keys = ["full_name", "phone", "address_line", "city", "pincode"];
  const updates = Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] || null]));
  await req.user.update(updates);
  let professional = null;
  if (req.user.role === "partner" && ["bio", "experience_years", "city_id"].some((key) => Object.hasOwn(req.body, key))) {
    professional = await Professional.findOne({ where: { user_id: req.user.id } });
    if (!professional) throw new ApiError(404, "Partner profile not found.");
    const professionalUpdates = Object.fromEntries(["bio", "experience_years", "city_id"].filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] || null]));
    if (professionalUpdates.city_id && !await City.findByPk(professionalUpdates.city_id)) throw new ApiError(404, "Selected city was not found.");
    await professional.update(professionalUpdates);
    professional = { id: professional.id, city_id: professional.city_id, bio: professional.bio, experience_years: professional.experience_years, verification_status: professional.verification_status, is_available: professional.is_available };
  }
  res.json({ success: true, data: { user: { id: req.user.id, full_name: req.user.full_name, email: req.user.email, role: req.user.role, phone: req.user.phone, address_line: req.user.address_line, city: req.user.city, pincode: req.user.pincode, professional } } });
}));
router.put("/me/photo", requireAuth, asyncHandler(async (req, res) => {
  const photo = parseProfilePhoto(req.body?.photo);
  const previous = await CustomerProfilePhoto.findByPk(req.user.id);
  const storedPhoto = await saveProfilePhoto(req.user.id, photo);
  try {
    await CustomerProfilePhoto.upsert(storedPhoto);
  } catch (error) {
    if (storedPhoto.object_key) await removeProfilePhotoObject(storedPhoto.object_key).catch(() => {});
    throw error;
  }
  if (previous?.object_key && previous.object_key !== storedPhoto.object_key) {
    await removeProfilePhotoObject(previous.object_key).catch((error) => console.error("Unable to remove replaced profile photo from S3:", error.message));
  }
  res.json({ success: true, data: { profile_photo: `data:${photo.mime_type};base64,${photo.image_data.toString("base64")}` } });
}));
router.delete("/me/photo", requireAuth, asyncHandler(async (req, res) => {
  const photo = await CustomerProfilePhoto.findByPk(req.user.id);
  await CustomerProfilePhoto.destroy({ where: { user_id: req.user.id } });
  if (photo?.object_key) await removeProfilePhotoObject(photo.object_key);
  res.json({ success: true, data: { profile_photo: null } });
}));

export default router;
