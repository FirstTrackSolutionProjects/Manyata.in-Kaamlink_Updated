import { Op } from "sequelize";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  Booking,
  City,
  ContactMessage,
  CustomerProfilePhoto,
  NewsletterSubscription,
  Pincode,
  Professional,
  ProfessionalService,
  RefreshToken,
  Service,
  ServiceCategory,
  SupportTicket,
  User,
} from "../../models/index.js";
import { requireAuth } from "../../middleware/auth.js";
import { ADMIN_PERMISSION_KEYS, ADMIN_SECTIONS, requireAdminConsole } from "./admin.permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { parseProfilePhoto, profilePhotoDataUrl } from "../../utils/profilePhoto.js";
import { removeProfilePhotoObject, saveProfilePhoto } from "../../utils/profilePhotoStorage.js";

const router = Router();
const bookingStatuses = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"];
const ticketStatuses = ["new", "in_progress", "resolved", "closed"];
const messageStatuses = ["new", "read", "replied", "archived"];
const professionalStatuses = ["pending", "verified", "rejected"];

router.use(requireAuth, requireAdminConsole);

router.get("/overview", asyncHandler(async (_req, res) => {
  const [customers, professionals, bookings, pendingBookings, services, newMessages, openTickets, revenue, recentBookings] = await Promise.all([
    User.count({ where: { role: "customer" } }),
    Professional.count(),
    Booking.count(),
    Booking.count({ where: { status: "pending" } }),
    Service.count({ where: { is_active: true } }),
    ContactMessage.count({ where: { status: "new" } }),
    SupportTicket.count({ where: { status: { [Op.notIn]: ["resolved", "closed"] } } }),
    Booking.sum("amount", { where: { payment_status: "paid" } }),
    Booking.findAll({
      limit: 8,
      order: [["created_at", "DESC"]],
      include: [
        { model: User, as: "user", attributes: ["id", "full_name", "phone", "email"] },
        { model: Service, as: "service", attributes: ["id", "name"] },
      ],
    }),
  ]);
  res.json({ success: true, data: { customers, professionals, bookings, pendingBookings, services, newMessages, openTickets, paidRevenue: Number(revenue || 0), recentBookings } });
}));

router.get("/bookings", [query("status").optional().isIn(bookingStatuses), query("deleted").optional().isBoolean()], validate, asyncHandler(async (req, res) => {
  const where = { deleted_at: req.query.deleted === "true" ? { [Op.not]: null } : null };
  if (req.query.status) where.status = req.query.status;
  const [bookings, professionals, customers, services] = await Promise.all([Booking.findAll({
    where,
    limit: 250,
    order: [["created_at", "DESC"]],
    include: [
      { model: User, as: "user", attributes: ["id", "full_name", "email", "phone"] },
      { model: Service, as: "service", attributes: ["id", "name", "base_price"] },
      { model: Professional, as: "professional", attributes: ["id", "verification_status"], include: [{ model: User, as: "user", attributes: ["id", "full_name", "phone"] }] },
    ],
  }), Professional.findAll({
    where: { verification_status: "verified" },
    attributes: ["id", "is_available"],
    include: [{ model: User, as: "user", attributes: ["full_name"], where: { is_active: true } }],
    order: [[{ model: User, as: "user" }, "full_name", "ASC"]],
  }), User.findAll({ where: { role: "customer", is_active: true, deleted_at: null }, attributes: ["id", "full_name", "email"], order: [["full_name", "ASC"]] }), Service.findAll({ where: { is_active: true, deleted_at: null }, attributes: ["id", "name", "base_price", "duration_mins"], order: [["name", "ASC"]] })]);
  res.json({ success: true, data: { bookings, professionals, customers, services } });
}));

router.post("/bookings", [
  body("user_id").isInt({ min: 1 }), body("service_id").isInt({ min: 1 }),
  body("address_line").trim().notEmpty().isLength({ max: 255 }), body("pincode").matches(/^[1-9][0-9]{5}$/),
  body("slot_start").isISO8601(), body("slot_end").isISO8601(), body("amount").isFloat({ min: 0 }),
  body("city_id").optional({ nullable: true }).isInt({ min: 1 }), body("notes").optional({ nullable: true }).isLength({ max: 10000 }),
], validate, asyncHandler(async (req, res) => {
  const [customer, service] = await Promise.all([
    User.findOne({ where: { id: req.body.user_id, role: "customer", is_active: true, deleted_at: null } }),
    Service.findOne({ where: { id: req.body.service_id, is_active: true, deleted_at: null } }),
  ]);
  if (!customer) throw new ApiError(404, "Active customer not found");
  if (!service) throw new ApiError(404, "Active service not found");
  const start = new Date(req.body.slot_start);
  const end = new Date(req.body.slot_end);
  if (end <= start) throw new ApiError(400, "Booking end time must be after the start time");
  const coverage = await Pincode.findOne({ where: { pincode: req.body.pincode, is_serviceable: true, deleted_at: null } });
  if (!coverage) throw new ApiError(400, "That PIN code is not currently serviceable");
  const booking = await Booking.create({ ...req.body, slot_start: start, slot_end: end, payment_method: "pay_after_service", payment_status: "unpaid", status: "pending" });
  res.status(201).json({ success: true, data: booking });
}));

router.patch("/bookings/:id", [
  param("id").isInt({ min: 1 }),
  body("status").optional().isIn(bookingStatuses),
  body("professional_id").optional({ nullable: true }).isInt({ min: 1 }),
  body("user_id").optional().isInt({ min: 1 }), body("service_id").optional().isInt({ min: 1 }),
  body("address_line").optional().trim().notEmpty().isLength({ max: 255 }), body("pincode").optional().matches(/^[1-9][0-9]{5}$/),
  body("slot_start").optional().isISO8601(), body("slot_end").optional().isISO8601(), body("amount").optional().isFloat({ min: 0 }),
  body("city_id").optional({ nullable: true }).isInt({ min: 1 }), body("notes").optional({ nullable: true }).isLength({ max: 10000 }),
], validate, asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking || booking.deleted_at) throw new ApiError(404, "Booking not found");
  const updates = {};
  for (const key of ["status", "user_id", "service_id", "address_line", "pincode", "amount", "city_id", "notes", "slot_start", "slot_end"]) {
    if (Object.hasOwn(req.body, key)) updates[key] = ["slot_start", "slot_end"].includes(key) ? new Date(req.body[key]) : req.body[key];
  }
  if (updates.user_id && !await User.findOne({ where: { id: updates.user_id, role: "customer", is_active: true, deleted_at: null } })) throw new ApiError(404, "Active customer not found");
  if (updates.service_id && !await Service.findOne({ where: { id: updates.service_id, is_active: true, deleted_at: null } })) throw new ApiError(404, "Active service not found");
  const nextStart = updates.slot_start || booking.slot_start;
  const nextEnd = updates.slot_end || booking.slot_end;
  if (nextEnd <= nextStart) throw new ApiError(400, "Booking end time must be after the start time");
  if (Object.hasOwn(req.body, "professional_id")) {
    const professional = req.body.professional_id ? await Professional.findByPk(req.body.professional_id) : null;
    if (req.body.professional_id && !professional) throw new ApiError(404, "Professional not found");
    if (professional && booking.payment_method === "razorpay" && booking.payment_status !== "paid") {
      throw new ApiError(400, "This online booking must be paid before assigning a partner.");
    }
    updates.professional_id = professional?.id ?? null;
    if (professional && (professional.verification_status !== "verified" || !professional.is_available)) {
      throw new ApiError(400, "Only verified, available professionals can be assigned");
    }
    if (professional && !req.body.status && booking.status === "pending") updates.status = "assigned";
  }
  await booking.update(updates);
  const updated = await Booking.findByPk(booking.id, { include: ["service", "user", "professional"] });
  res.json({ success: true, data: updated });
}));

router.delete("/bookings/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  await booking.update({ deleted_at: booking.deleted_at || new Date() });
  res.json({ success: true, data: { id: booking.id, deleted_at: booking.deleted_at } });
}));
router.post("/bookings/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  await booking.update({ deleted_at: null });
  res.json({ success: true, data: { id: booking.id, deleted_at: null } });
}));

router.get("/customers", [query("search").optional().trim().isLength({ max: 120 })], validate, asyncHandler(async (req, res) => {
  const search = req.query.search;
  const where = { role: "customer" };
  if (search) where[Op.or] = [
    { full_name: { [Op.like]: `%${search}%` } },
    { email: { [Op.like]: `%${search}%` } },
    { phone: { [Op.like]: `%${search}%` } },
  ];
  const customers = await User.findAll({ where, attributes: ["id", "full_name", "email", "phone", "is_active", "address_line", "city", "pincode", "deleted_at", "created_at"], limit: 250, order: [["created_at", "DESC"]] });
  const photos = await CustomerProfilePhoto.findAll({ where: { user_id: customers.map(({ id }) => id) }, attributes: ["user_id"] });
  const photoIds = new Set(photos.map(({ user_id }) => String(user_id)));
  res.json({ success: true, data: customers.map((customer) => ({ ...customer.toJSON(), has_photo: photoIds.has(String(customer.id)) })) });
}));

router.post("/customers", [
  body("full_name").trim().notEmpty().isLength({ max: 120 }), body("email").trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("password").isLength({ min: 12 }).withMessage("Set a temporary password of at least 12 characters"),
], validate, asyncHandler(async (req, res) => {
  const password_hash = await bcrypt.hash(req.body.password, 12);
  const customer = await User.create({ full_name: req.body.full_name, email: req.body.email, phone: req.body.phone || null, password_hash, role: "customer", is_active: true, is_verified: false });
  res.status(201).json({ success: true, data: { id: customer.id, full_name: customer.full_name, email: customer.email, phone: customer.phone, is_active: customer.is_active } });
}));

router.get("/customers/:id/photo", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const photo = await CustomerProfilePhoto.findByPk(req.params.id);
  if (!photo) throw new ApiError(404, "This customer has no profile photo.");
  res.json({ success: true, data: { profile_photo: await profilePhotoDataUrl(photo) } });
}));

router.get("/customers/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const customer = await User.findOne({ where: { id: req.params.id, role: "customer" } });
  if (!customer) throw new ApiError(404, "Customer not found");
  const [photo, bookings] = await Promise.all([
    CustomerProfilePhoto.findByPk(customer.id),
    Booking.findAll({ where: { user_id: customer.id }, order: [["created_at", "DESC"]], limit: 100, include: [{ model: Service, as: "service", attributes: ["id", "name"] }] }),
  ]);
  const { id, full_name, email, phone, address_line, city, pincode, is_active, deleted_at, created_at, updated_at } = customer;
  res.json({ success: true, data: { id, full_name, email, phone, address_line, city, pincode, is_active, deleted_at, created_at, updated_at, profile_photo: await profilePhotoDataUrl(photo), bookings } });
}));

router.patch("/customers/:id", [
  param("id").isInt({ min: 1 }),
  body("full_name").optional().trim().notEmpty().isLength({ max: 120 }),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("address_line").optional({ values: "falsy" }).trim().isLength({ max: 255 }),
  body("city").optional({ values: "falsy" }).trim().isLength({ max: 100 }),
  body("pincode").optional({ values: "falsy" }).trim().matches(/^[0-9]{6}$/),
  body("is_active").optional().isBoolean(),
], validate, asyncHandler(async (req, res) => {
  const customer = await User.findOne({ where: { id: req.params.id, role: "customer" } });
  if (!customer) throw new ApiError(404, "Customer not found");
  if (customer.deleted_at) throw new ApiError(409, "Restore this customer before editing the profile.");
  const keys = ["full_name", "email", "phone", "address_line", "city", "pincode", "is_active"];
  const updates = Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] === "" ? null : req.body[key]]));
  for (const key of ["email"]) {
    if (!updates[key] || updates[key] === customer[key]) continue;
    if (await User.findOne({ where: { [key]: updates[key], id: { [Op.ne]: customer.id } } })) throw new ApiError(409, `That ${key} is already used by another account.`);
  }
  if (updates.is_active === false) await RefreshToken.update({ revoked: true }, { where: { user_id: customer.id, revoked: false } });
  await customer.update(updates);
  res.json({ success: true, data: { id: customer.id, full_name: customer.full_name, email: customer.email, phone: customer.phone, address_line: customer.address_line, city: customer.city, pincode: customer.pincode, is_active: customer.is_active } });
}));

router.delete("/customers/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const customer = await User.findOne({ where: { id: req.params.id, role: "customer" } });
  if (!customer) throw new ApiError(404, "Customer not found");
  if (!customer.deleted_at) await customer.update({ is_active: false, deleted_at: new Date() });
  await RefreshToken.update({ revoked: true }, { where: { user_id: customer.id, revoked: false } });
  res.json({ success: true, data: { id: customer.id, deleted_at: customer.deleted_at } });
}));

router.post("/customers/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const customer = await User.findOne({ where: { id: req.params.id, role: "customer" } });
  if (!customer) throw new ApiError(404, "Customer not found");
  await customer.update({ is_active: true, deleted_at: null });
  res.json({ success: true, data: { id: customer.id, is_active: customer.is_active, deleted_at: null } });
}));

router.get("/professionals", asyncHandler(async (_req, res) => {
  const [professionals, categories, cities] = await Promise.all([Professional.findAll({
    limit: 250,
    order: [["created_at", "DESC"]],
    include: [
      { model: User, as: "user", attributes: ["id", "full_name", "email", "phone", "is_active", "deleted_at", "created_at"] },
      { model: City, as: "city", attributes: ["id", "name", "state"] },
      { model: ServiceCategory, as: "categories", attributes: ["id", "name"], through: { attributes: [] } },
    ],
  }), ServiceCategory.findAll({ where: { is_active: true }, attributes: ["id", "name"] }), City.findAll({ where: { is_active: true }, attributes: ["id", "name", "state"] })]);
  const userIds = professionals.map(({ user_id }) => user_id);
  const photos = userIds.length ? await CustomerProfilePhoto.findAll({ where: { user_id: userIds }, attributes: ["user_id"] }) : [];
  const photoUserIds = new Set(photos.map(({ user_id }) => String(user_id)));
  res.json({ success: true, data: {
    professionals: professionals.map((professional) => {
      const item = professional.toJSON();
      if (item.user) item.user.profile_photo_available = photoUserIds.has(String(item.user.id));
      return item;
    }),
    categories,
    cities,
  } });
}));

router.post("/professionals", [
  body("full_name").trim().notEmpty().isLength({ max: 120 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("password").isLength({ min: 12 }).withMessage("Set a temporary password of at least 12 characters"),
  body("city_id").optional({ values: "falsy" }).isInt({ min: 1 }),
  body("experience_years").optional().isInt({ min: 0, max: 80 }),
  body("category_ids").optional().isArray(),
], validate, asyncHandler(async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    const password_hash = await bcrypt.hash(req.body.password, 12);
    if (req.body.city_id && !await City.findByPk(req.body.city_id, { transaction })) throw new ApiError(404, "City not found");
    if (req.body.bio && req.body.bio.length > 10000) throw new ApiError(400, "Professional bio is too long");
    const user = await User.create({ full_name: req.body.full_name, email: req.body.email, phone: req.body.phone || null, password_hash, role: "partner", is_active: true, is_verified: false }, { transaction });
    const professional = await Professional.create({ user_id: user.id, city_id: req.body.city_id || null, bio: req.body.bio || null, experience_years: Number(req.body.experience_years || 0), verification_status: "pending", is_available: false }, { transaction });
    const categoryIds = [...new Set((req.body.category_ids || []).map(Number))];
    if (categoryIds.length) {
      const categories = await ServiceCategory.count({ where: { id: categoryIds }, transaction });
      if (categories !== categoryIds.length) throw new ApiError(400, "One or more service categories were not found");
      await ProfessionalService.bulkCreate(categoryIds.map((category_id) => ({ professional_id: professional.id, category_id })), { transaction });
    }
    await transaction.commit();
    res.status(201).json({ success: true, data: { id: professional.id, user: { id: user.id, full_name: user.full_name, email: user.email }, verification_status: professional.verification_status } });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}));

router.patch("/professionals/:id", [
  param("id").isInt({ min: 1 }),
  body("full_name").optional().trim().notEmpty().isLength({ max: 120 }),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("password").optional({ values: "falsy" }).isLength({ min: 12 }).withMessage("Set a password of at least 12 characters"),
  body("city_id").optional({ nullable: true }).isInt({ min: 1 }),
  body("bio").optional({ nullable: true }).isLength({ max: 10000 }),
  body("experience_years").optional().isInt({ min: 0, max: 80 }),
  body("category_ids").optional().isArray(),
  body("verification_status").optional().isIn(professionalStatuses),
  body("is_available").optional().isBoolean(),
  body("is_active").optional().isBoolean(),
], validate, asyncHandler(async (req, res) => {
  const professional = await Professional.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
  if (!professional) throw new ApiError(404, "Professional not found");
  if (professional.user.deleted_at) throw new ApiError(404, "Partner not found");
  const transaction = await User.sequelize.transaction();
  try {
  const updates = {};
  const userUpdates = {};
  for (const key of ["full_name", "email", "phone"]) if (Object.hasOwn(req.body, key)) userUpdates[key] = req.body[key] || null;
  for (const key of ["email"]) {
    if (!userUpdates[key] || userUpdates[key] === professional.user[key]) continue;
    if (await User.findOne({ where: { [key]: userUpdates[key], id: { [Op.ne]: professional.user.id } }, transaction })) {
      throw new ApiError(409, `That ${key} is already used by another account.`);
    }
  }
  if (req.body.password) {
    userUpdates.password_hash = await bcrypt.hash(req.body.password, 12);
    userUpdates.password_reset_token_hash = null;
    userUpdates.password_reset_expires_at = null;
  }
  for (const key of ["city_id", "bio", "experience_years"]) if (Object.hasOwn(req.body, key)) updates[key] = req.body[key] === "" ? null : req.body[key];
  if (Object.hasOwn(req.body, "city_id") && req.body.city_id && !await City.findByPk(req.body.city_id, { transaction })) throw new ApiError(404, "City not found");
  let categoryIds;
  if (Object.hasOwn(req.body, "category_ids")) {
    categoryIds = [...new Set(req.body.category_ids.map(Number))];
    if (categoryIds.length && await ServiceCategory.count({ where: { id: categoryIds }, transaction }) !== categoryIds.length) throw new ApiError(400, "One or more service categories were not found");
  }
  for (const key of ["verification_status", "is_available"]) if (req.body[key] !== undefined) updates[key] = req.body[key];
  const nextStatus = updates.verification_status ?? professional.verification_status;
  const nextActive = req.body.is_active ?? professional.user.is_active;
  if (updates.is_available && (nextStatus !== "verified" || !nextActive)) {
    throw new ApiError(400, "A professional must be verified and active before becoming available");
  }
  if (nextStatus !== "verified" || !nextActive) updates.is_available = false;
  if (req.body.is_active !== undefined) userUpdates.is_active = req.body.is_active;
  await professional.update(updates, { transaction });
  if (Object.keys(userUpdates).length) await professional.user.update(userUpdates, { transaction });
  if (req.body.password || req.body.is_active === false) {
    await RefreshToken.update({ revoked: true }, { where: { user_id: professional.user.id, revoked: false }, transaction });
  }
  if (categoryIds) {
    await ProfessionalService.destroy({ where: { professional_id: professional.id }, transaction });
    if (categoryIds.length) await ProfessionalService.bulkCreate(categoryIds.map((category_id) => ({ professional_id: professional.id, category_id })), { transaction });
  }
  await transaction.commit();
  res.json({ success: true, data: { id: professional.id } });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}));

router.delete("/professionals/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const professional = await Professional.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
  if (!professional || professional.user.deleted_at) throw new ApiError(404, "Partner not found");
  const transaction = await User.sequelize.transaction();
  try {
    await professional.update({ is_available: false }, { transaction });
    await professional.user.update({ is_active: false, deleted_at: new Date() }, { transaction });
    await RefreshToken.update({ revoked: true }, { where: { user_id: professional.user.id, revoked: false }, transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  res.json({ success: true, data: { id: professional.id, deleted: true } });
}));
router.post("/professionals/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const professional = await Professional.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
  if (!professional || !professional.user.deleted_at) throw new ApiError(404, "Deleted partner not found");
  await professional.user.update({ is_active: true, deleted_at: null });
  res.json({ success: true, data: { id: professional.id, is_active: true, deleted_at: null } });
}));

router.get("/services", asyncHandler(async (_req, res) => {
  const [services, categories] = await Promise.all([
    Service.findAll({ include: [{ model: ServiceCategory, as: "category", attributes: ["id", "name"] }], order: [["created_at", "DESC"]] }),
    ServiceCategory.findAll({ order: [["name", "ASC"]] }),
  ]);
  res.json({ success: true, data: { services, categories } });
}));

router.post("/services", [
  body("category_id").isInt({ min: 1 }),
  body("name").trim().notEmpty().isLength({ max: 150 }),
  body("slug").trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).isLength({ max: 150 }),
  body("description").optional({ values: "falsy" }).isLength({ max: 10000 }),
  body("base_price").isFloat({ min: 0 }),
  body("duration_mins").isInt({ min: 1, max: 1440 }),
], validate, asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findByPk(req.body.category_id);
  if (!category) throw new ApiError(404, "Service category not found");
  const service = await Service.create({ ...req.body, is_active: true });
  res.status(201).json({ success: true, data: service });
}));

router.patch("/services/:id", [
  param("id").isInt({ min: 1 }),
  body("name").optional().trim().notEmpty().isLength({ max: 150 }),
  body("slug").optional().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).isLength({ max: 150 }),
  body("description").optional({ nullable: true }).isLength({ max: 10000 }),
  body("category_id").optional().isInt({ min: 1 }),
  body("base_price").optional().isFloat({ min: 0 }),
  body("duration_mins").optional().isInt({ min: 1, max: 1440 }),
  body("is_active").optional().isBoolean(),
], validate, asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) throw new ApiError(404, "Service not found");
  if (req.body.category_id && !await ServiceCategory.findByPk(req.body.category_id)) throw new ApiError(404, "Service category not found");
  const allowed = ["name", "slug", "description", "category_id", "base_price", "duration_mins", "is_active"];
  await service.update(Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])));
  res.json({ success: true, data: service });
}));
router.delete("/services/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) throw new ApiError(404, "Service not found");
  await service.update({ is_active: false, deleted_at: service.deleted_at || new Date() });
  res.json({ success: true, data: { id: service.id, deleted_at: service.deleted_at } });
}));
router.post("/services/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service || !service.deleted_at) throw new ApiError(404, "Deleted service not found");
  const category = await ServiceCategory.findByPk(service.category_id);
  await service.update({ deleted_at: null, is_active: Boolean(category?.is_active && !category.deleted_at) });
  res.json({ success: true, data: { id: service.id, deleted_at: null, is_active: service.is_active } });
}));

router.post("/categories", [body("name").trim().notEmpty().isLength({ max: 80 }), body("slug").trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).isLength({ max: 120 }), body("description").optional({ values: "falsy" }).isLength({ max: 10000 })], validate, asyncHandler(async (req, res) => {
  const category = await ServiceCategory.create({ name: req.body.name, slug: req.body.slug, description: req.body.description || null, is_active: true });
  res.status(201).json({ success: true, data: category });
}));

router.patch("/categories/:id", [param("id").isInt({ min: 1 }), body("name").optional().trim().notEmpty().isLength({ max: 80 }), body("slug").optional().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).isLength({ max: 120 }), body("description").optional({ nullable: true }).isLength({ max: 10000 }), body("is_active").optional().isBoolean()], validate, asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findByPk(req.params.id);
  if (!category) throw new ApiError(404, "Service category not found");
  const keys = ["name", "slug", "description", "is_active"];
  await category.update(Object.fromEntries(keys.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])));
  res.json({ success: true, data: category });
}));
router.delete("/categories/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findByPk(req.params.id);
  if (!category) throw new ApiError(404, "Service category not found");
  await category.update({ is_active: false, deleted_at: category.deleted_at || new Date() });
  await Service.update({ is_active: false }, { where: { category_id: category.id, deleted_at: null } });
  res.json({ success: true, data: { id: category.id, deleted_at: category.deleted_at } });
}));
router.post("/categories/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findByPk(req.params.id);
  if (!category || !category.deleted_at) throw new ApiError(404, "Deleted service category not found");
  await category.update({ deleted_at: null, is_active: true });
  res.json({ success: true, data: { id: category.id, deleted_at: null, is_active: true } });
}));

router.get("/contact", asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.findAll({ limit: 250, order: [["created_at", "DESC"]] });
  res.json({ success: true, data: messages });
}));

router.post("/contact", [body("name").trim().notEmpty().isLength({ max: 120 }), body("email").trim().isEmail().normalizeEmail(), body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }), body("subject").optional({ nullable: true }).isLength({ max: 200 }), body("message").trim().notEmpty().isLength({ max: 20000 })], validate, asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({ ...req.body, status: "new" });
  res.status(201).json({ success: true, data: message });
}));
router.patch("/contact/:id", [param("id").isInt({ min: 1 }), body("status").optional().isIn(messageStatuses), body("name").optional().trim().notEmpty().isLength({ max: 120 }), body("email").optional().trim().isEmail().normalizeEmail(), body("phone").optional({ nullable: true }).isLength({ max: 15 }), body("subject").optional({ nullable: true }).isLength({ max: 200 }), body("message").optional().trim().notEmpty().isLength({ max: 20000 })], validate, asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id);
  if (!message || message.deleted_at) throw new ApiError(404, "Contact message not found");
  const keys = ["status", "name", "email", "phone", "subject", "message"];
  await message.update(Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] || null])));
  res.json({ success: true, data: message });
}));
router.delete("/contact/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await ContactMessage.findByPk(req.params.id); if (!row) throw new ApiError(404, "Contact message not found");
  await row.update({ deleted_at: row.deleted_at || new Date() }); res.json({ success: true, data: { id: row.id, deleted_at: row.deleted_at } });
}));
router.post("/contact/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await ContactMessage.findByPk(req.params.id); if (!row || !row.deleted_at) throw new ApiError(404, "Deleted contact message not found");
  await row.update({ deleted_at: null }); res.json({ success: true, data: { id: row.id, deleted_at: null } });
}));

router.get("/tickets", asyncHandler(async (_req, res) => {
  const tickets = await SupportTicket.findAll({ limit: 250, order: [["created_at", "DESC"]] });
  res.json({ success: true, data: tickets });
}));

router.post("/tickets", [body("booking_reference").optional({ nullable: true }).isLength({ max: 80 }), body("category").optional({ nullable: true }).isLength({ max: 120 }), body("description").trim().notEmpty().isLength({ max: 20000 }), body("status").optional().isIn(ticketStatuses)], validate, asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({ ticket_ref: `MNY-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`, booking_reference: req.body.booking_reference || null, category: req.body.category || null, description: req.body.description, status: req.body.status || "new" });
  res.status(201).json({ success: true, data: ticket });
}));
router.patch("/tickets/:id", [param("id").isInt({ min: 1 }), body("status").optional().isIn(ticketStatuses), body("booking_reference").optional({ nullable: true }).isLength({ max: 80 }), body("category").optional({ nullable: true }).isLength({ max: 120 }), body("description").optional().trim().notEmpty().isLength({ max: 20000 })], validate, asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByPk(req.params.id);
  if (!ticket || ticket.deleted_at) throw new ApiError(404, "Support ticket not found");
  const keys = ["status", "booking_reference", "category", "description"];
  await ticket.update(Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key] || null])));
  res.json({ success: true, data: ticket });
}));
router.delete("/tickets/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await SupportTicket.findByPk(req.params.id); if (!row) throw new ApiError(404, "Support ticket not found");
  await row.update({ deleted_at: row.deleted_at || new Date() }); res.json({ success: true, data: { id: row.id, deleted_at: row.deleted_at } });
}));
router.post("/tickets/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await SupportTicket.findByPk(req.params.id); if (!row || !row.deleted_at) throw new ApiError(404, "Deleted support ticket not found");
  await row.update({ deleted_at: null }); res.json({ success: true, data: { id: row.id, deleted_at: null } });
}));

router.get("/newsletter", asyncHandler(async (_req, res) => {
  const subscriptions = await NewsletterSubscription.findAll({ order: [["created_at", "DESC"]] });
  res.json({ success: true, data: subscriptions });
}));
router.post("/newsletter", [body("email").trim().isEmail().normalizeEmail()], validate, asyncHandler(async (req, res) => {
  const existing = await NewsletterSubscription.findOne({ where: { email: req.body.email } });
  if (existing) {
    if (existing.deleted_at) { await existing.update({ deleted_at: null, is_active: true }); return res.status(200).json({ success: true, data: existing }); }
    throw new ApiError(409, "That email is already subscribed.");
  }
  const subscription = await NewsletterSubscription.create({ email: req.body.email, is_active: true });
  res.status(201).json({ success: true, data: subscription });
}));
router.patch("/newsletter/:id", [param("id").isInt({ min: 1 }), body("email").optional().trim().isEmail().normalizeEmail(), body("is_active").optional().isBoolean()], validate, asyncHandler(async (req, res) => {
  const row = await NewsletterSubscription.findByPk(req.params.id); if (!row || row.deleted_at) throw new ApiError(404, "Subscriber not found");
  const updates = Object.fromEntries(["email", "is_active"].filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key]]));
  await row.update(updates); res.json({ success: true, data: row });
}));
router.delete("/newsletter/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await NewsletterSubscription.findByPk(req.params.id); if (!row) throw new ApiError(404, "Subscriber not found");
  await row.update({ is_active: false, deleted_at: row.deleted_at || new Date() }); res.json({ success: true, data: { id: row.id, deleted_at: row.deleted_at } });
}));
router.post("/newsletter/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await NewsletterSubscription.findByPk(req.params.id); if (!row || !row.deleted_at) throw new ApiError(404, "Deleted subscriber not found");
  await row.update({ deleted_at: null, is_active: true }); res.json({ success: true, data: { id: row.id, deleted_at: null, is_active: true } });
}));

router.get("/service-areas", asyncHandler(async (_req, res) => {
  const [cities, pincodes] = await Promise.all([
    City.findAll({ order: [["name", "ASC"]] }),
    Pincode.findAll({ include: [{ model: City, attributes: ["id", "name", "state"] }], order: [["pincode", "ASC"]], limit: 500 }),
  ]);
  res.json({ success: true, data: { cities, pincodes } });
}));

router.post("/cities", [body("name").trim().notEmpty().isLength({ max: 80 }), body("state").trim().notEmpty().isLength({ max: 80 })], validate, asyncHandler(async (req, res) => {
  const city = await City.create({ name: req.body.name, state: req.body.state, is_active: true });
  res.status(201).json({ success: true, data: city });
}));

router.patch("/cities/:id", [param("id").isInt({ min: 1 }), body("is_active").optional().isBoolean(), body("name").optional().trim().notEmpty().isLength({ max: 80 }), body("state").optional().trim().notEmpty().isLength({ max: 80 })], validate, asyncHandler(async (req, res) => {
  const city = await City.findByPk(req.params.id);
  if (!city) throw new ApiError(404, "City not found");
  const keys = ["is_active", "name", "state"];
  await city.update(Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key]])));
  res.json({ success: true, data: city });
}));
router.delete("/cities/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await City.findByPk(req.params.id); if (!row) throw new ApiError(404, "City not found");
  await row.update({ is_active: false, deleted_at: row.deleted_at || new Date() }); res.json({ success: true, data: { id: row.id, deleted_at: row.deleted_at } });
}));
router.post("/cities/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await City.findByPk(req.params.id); if (!row || !row.deleted_at) throw new ApiError(404, "Deleted city not found");
  await row.update({ deleted_at: null, is_active: true }); res.json({ success: true, data: { id: row.id, deleted_at: null } });
}));

router.post("/pincodes", [body("pincode").matches(/^[1-9][0-9]{5}$/), body("city_id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  if (!await City.findOne({ where: { id: req.body.city_id, deleted_at: null } })) throw new ApiError(404, "City not found");
  const pincode = await Pincode.create({ pincode: req.body.pincode, city_id: req.body.city_id, is_serviceable: true });
  res.status(201).json({ success: true, data: pincode });
}));

router.patch("/pincodes/:id", [param("id").isInt({ min: 1 }), body("is_serviceable").optional().isBoolean(), body("pincode").optional().matches(/^[1-9][0-9]{5}$/), body("city_id").optional().isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const pincode = await Pincode.findByPk(req.params.id);
  if (!pincode) throw new ApiError(404, "PIN code not found");
  if (req.body.city_id && !await City.findByPk(req.body.city_id)) throw new ApiError(404, "City not found");
  const keys = ["is_serviceable", "pincode", "city_id"];
  await pincode.update(Object.fromEntries(keys.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key]])));
  res.json({ success: true, data: pincode });
}));
router.delete("/pincodes/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await Pincode.findByPk(req.params.id); if (!row) throw new ApiError(404, "PIN code not found");
  await row.update({ deleted_at: row.deleted_at || new Date() }); res.json({ success: true, data: { id: row.id, deleted_at: row.deleted_at } });
}));
router.post("/pincodes/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const row = await Pincode.findByPk(req.params.id); if (!row || !row.deleted_at) throw new ApiError(404, "Deleted PIN code not found");
  await row.update({ deleted_at: null }); res.json({ success: true, data: { id: row.id, deleted_at: null } });
}));

// Owner-only people directory. Password hashes and reset tokens are never selected.
router.get("/profiles", [query("search").optional().trim().isLength({ max: 120 }), query("role").optional().isIn(["customer", "partner", "employee", "admin"])], validate, asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.role) where.role = req.query.role;
  if (req.query.search) where[Op.or] = [
    { full_name: { [Op.like]: `%${req.query.search}%` } },
    { email: { [Op.like]: `%${req.query.search}%` } },
    { phone: { [Op.like]: `%${req.query.search}%` } },
  ];
  const users = await User.findAll({
    where,
    attributes: ["id", "full_name", "email", "phone", "role", "is_verified", "is_active", "address_line", "city", "pincode", "admin_permissions", "created_at", "deleted_at"],
    order: [["created_at", "DESC"]],
    limit: 500,
  });
  const ids = users.map((user) => user.id);
  const [professionals, photos] = ids.length ? await Promise.all([
    Professional.findAll({ where: { user_id: ids }, attributes: ["id", "user_id", "city_id", "bio", "experience_years", "rating_avg", "rating_count", "verification_status", "is_available"], include: [{ model: ServiceCategory, as: "categories", attributes: ["id", "name"], through: { attributes: [] } }] }),
    CustomerProfilePhoto.findAll({ where: { user_id: ids }, attributes: ["user_id"] }),
  ]) : [[], []];
  const cityIds = [...new Set(professionals.map(({ city_id }) => city_id).filter(Boolean))];
  const cities = cityIds.length ? await City.findAll({ where: { id: cityIds }, attributes: ["id", "name", "state"] }) : [];
  const cityById = new Map(cities.map((city) => [String(city.id), { id: city.id, name: city.name, state: city.state }]));
  const professionalByUser = new Map(professionals.map((professional) => [String(professional.user_id), professional]));
  const photoIds = new Set(photos.map((photo) => String(photo.user_id)));
  res.json({ success: true, data: users.map((user) => ({
    ...user.toJSON(),
    profile_photo_available: photoIds.has(String(user.id)),
    professional: professionalByUser.has(String(user.id)) ? {
      ...professionalByUser.get(String(user.id)).toJSON(),
      city: cityById.get(String(professionalByUser.get(String(user.id)).city_id)) || null,
    } : null,
    account_status: user.deleted_at ? "deleted" : user.is_active ? "active" : "suspended",
  })) });
}));

// Owner-only full profile editor. Role is deliberately immutable here; partner and employee
// fields are updated with their related records in one transaction.
router.patch("/profiles/:id", [
  param("id").isInt({ min: 1 }),
  body("full_name").optional().trim().notEmpty().isLength({ max: 120 }),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("phone").optional({ nullable: true, values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("address_line").optional({ nullable: true, values: "falsy" }).trim().isLength({ max: 255 }),
  body("city").optional({ nullable: true, values: "falsy" }).trim().isLength({ max: 100 }),
  body("pincode").optional({ nullable: true, values: "falsy" }).matches(/^[0-9]{6}$/),
  body("is_active").optional().isBoolean(),
  body("is_verified").optional().isBoolean(),
  body("bio").optional({ nullable: true }).isLength({ max: 10000 }),
  body("experience_years").optional().isInt({ min: 0, max: 80 }),
  body("city_id").optional({ nullable: true }).isInt({ min: 1 }),
  body("category_ids").optional().isArray(),
  body("verification_status").optional().isIn(professionalStatuses),
  body("is_available").optional().isBoolean(),
  body("permissions").optional().isArray({ max: ADMIN_PERMISSION_KEYS.length }),
  body("permissions.*").optional().isIn(ADMIN_PERMISSION_KEYS),
  body("password").optional({ values: "falsy" }).isString().isLength({ min: 12, max: 128 }),
], validate, asyncHandler(async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    const user = await User.findByPk(req.params.id, { transaction });
    if (!user) throw new ApiError(404, "Profile not found.");
    if (user.deleted_at) throw new ApiError(409, "Restore this profile before editing it.");
    if (user.role === "admin" && req.body.is_active === false) throw new ApiError(400, "The owner account cannot be deactivated here.");

    const userUpdates = {};
    for (const key of ["full_name", "email", "phone", "address_line", "city", "pincode", "is_active", "is_verified"]) {
      if (Object.hasOwn(req.body, key)) userUpdates[key] = req.body[key] === "" ? null : req.body[key];
    }
    if (userUpdates.email && userUpdates.email !== user.email && await User.findOne({ where: { email: userUpdates.email, id: { [Op.ne]: user.id } }, transaction })) {
      throw new ApiError(409, "That email is already used by another account.");
    }
    if (req.body.password) {
      userUpdates.password_hash = await bcrypt.hash(req.body.password, 12);
      userUpdates.password_reset_token_hash = null;
      userUpdates.password_reset_expires_at = null;
    }

    if (user.role === "employee" && Object.hasOwn(req.body, "permissions")) userUpdates.admin_permissions = [...new Set(req.body.permissions)];
    await user.update(userUpdates, { transaction });

    if (user.role === "partner") {
      const professional = await Professional.findOne({ where: { user_id: user.id }, transaction });
      if (!professional) throw new ApiError(404, "Partner profile not found.");
      const professionalUpdates = {};
      for (const key of ["city_id", "bio", "experience_years", "verification_status", "is_available"]) {
        if (Object.hasOwn(req.body, key)) professionalUpdates[key] = req.body[key] === "" ? null : req.body[key];
      }
      if (req.body.city_id && !await City.findByPk(req.body.city_id, { transaction })) throw new ApiError(404, "Selected city was not found.");
      if (Object.hasOwn(req.body, "is_available") && req.body.is_available && ((req.body.verification_status || professional.verification_status) !== "verified" || req.body.is_active === false)) {
        throw new ApiError(400, "A partner must be verified and active before becoming available.");
      }
      if ((professionalUpdates.verification_status && professionalUpdates.verification_status !== "verified") || req.body.is_active === false) professionalUpdates.is_available = false;
      await professional.update(professionalUpdates, { transaction });
      if (Object.hasOwn(req.body, "category_ids")) {
        const categoryIds = [...new Set(req.body.category_ids.map(Number))];
        if (categoryIds.length && await ServiceCategory.count({ where: { id: categoryIds }, transaction }) !== categoryIds.length) throw new ApiError(400, "One or more service categories were not found.");
        await ProfessionalService.destroy({ where: { professional_id: professional.id }, transaction });
        if (categoryIds.length) await ProfessionalService.bulkCreate(categoryIds.map((category_id) => ({ professional_id: professional.id, category_id })), { transaction });
      }
    }

    if (req.body.password || req.body.is_active === false || Object.hasOwn(req.body, "permissions")) {
      await RefreshToken.update({ revoked: true }, { where: { user_id: user.id, revoked: false }, transaction });
    }
    await transaction.commit();
    res.json({ success: true, data: { id: user.id } });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}));

router.put("/profiles/:id/photo", [param("id").isInt({ min: 1 }), body("photo").isString().notEmpty()], validate, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: ["id"] });
  if (!user) throw new ApiError(404, "Profile not found.");
  const photo = parseProfilePhoto(req.body.photo);
  const previous = await CustomerProfilePhoto.findByPk(user.id);
  const storedPhoto = await saveProfilePhoto(user.id, photo);
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

router.delete("/profiles/:id/photo", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const photo = await CustomerProfilePhoto.findByPk(req.params.id);
  await CustomerProfilePhoto.destroy({ where: { user_id: req.params.id } });
  if (photo?.object_key) await removeProfilePhotoObject(photo.object_key);
  res.json({ success: true, data: { profile_photo: null } });
}));

router.get("/profiles/:id/photo", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: ["id"] });
  if (!user) throw new ApiError(404, "Profile not found");
  const photo = await CustomerProfilePhoto.findByPk(user.id);
  res.json({ success: true, data: { profile_photo: await profilePhotoDataUrl(photo) } });
}));

router.get("/team", asyncHandler(async (_req, res) => {
  const employees = await User.findAll({
    where: { role: "employee" },
    attributes: ["id", "full_name", "email", "phone", "admin_permissions", "is_active", "created_at", "deleted_at"],
    order: [["created_at", "DESC"]],
  });
  res.json({ success: true, data: { employees, sections: ADMIN_SECTIONS } });
}));

router.post("/team", [
  body("full_name").trim().notEmpty().isLength({ max: 120 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 15 }),
  body("password").isString().isLength({ min: 12, max: 128 }),
  body("permissions").isArray({ max: ADMIN_PERMISSION_KEYS.length }),
  body("permissions.*").isIn(ADMIN_PERMISSION_KEYS),
], validate, asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  if (await User.findOne({ where: { email } })) throw new ApiError(409, "An account with this email already exists.");
  const user = await User.create({
    full_name: req.body.full_name,
    email,
    phone: req.body.phone || null,
    password_hash: await bcrypt.hash(req.body.password, 12),
    role: "employee",
    admin_permissions: [...new Set(req.body.permissions)],
    is_verified: true,
    is_active: true,
  });
  res.status(201).json({ success: true, data: { employee: {
    id: user.id, full_name: user.full_name, email: user.email, phone: user.phone,
    admin_permissions: user.admin_permissions, is_active: user.is_active, created_at: user.created_at,
  } } });
}));

router.patch("/team/:id", [
  param("id").isInt({ min: 1 }),
  body("full_name").optional().trim().notEmpty().isLength({ max: 120 }),
  body("phone").optional({ nullable: true }).trim().isLength({ min: 7, max: 15 }),
  body("permissions").optional().isArray({ max: ADMIN_PERMISSION_KEYS.length }),
  body("permissions.*").optional().isIn(ADMIN_PERMISSION_KEYS),
  body("is_active").optional().isBoolean(),
  body("password").optional().isString().isLength({ min: 12, max: 128 }),
], validate, asyncHandler(async (req, res) => {
  const employee = await User.findOne({ where: { id: req.params.id, role: "employee" } });
  if (!employee) throw new ApiError(404, "Employee account not found.");
  const updates = {};
  for (const key of ["full_name", "phone", "is_active"]) if (Object.hasOwn(req.body, key)) updates[key] = req.body[key];
  if (Object.hasOwn(req.body, "permissions")) updates.admin_permissions = [...new Set(req.body.permissions)];
  if (req.body.password) updates.password_hash = await bcrypt.hash(req.body.password, 12);
  await employee.update(updates);
  if (Object.hasOwn(req.body, "is_active") && !req.body.is_active || req.body.password || Object.hasOwn(req.body, "permissions")) {
    await RefreshToken.update({ revoked: true }, { where: { user_id: employee.id, revoked: false } });
  }
  res.json({ success: true, data: { employee: {
    id: employee.id, full_name: employee.full_name, email: employee.email, phone: employee.phone,
    admin_permissions: employee.admin_permissions, is_active: employee.is_active, created_at: employee.created_at,
  } } });
}));

router.delete("/team/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const employee = await User.findOne({ where: { id: req.params.id, role: "employee" } });
  if (!employee) throw new ApiError(404, "Employee account not found.");
  await employee.update({ is_active: false, deleted_at: new Date() });
  await RefreshToken.update({ revoked: true }, { where: { user_id: employee.id, revoked: false } });
  res.json({ success: true, data: { id: employee.id, deleted: true } });
}));

router.post("/team/:id/restore", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const employee = await User.findOne({ where: { id: req.params.id, role: "employee", deleted_at: { [Op.not]: null } } });
  if (!employee) throw new ApiError(404, "Deleted employee account not found.");
  await employee.update({ is_active: true, deleted_at: null });
  res.json({ success: true, data: { id: employee.id, restored: true } });
}));

export default router;
