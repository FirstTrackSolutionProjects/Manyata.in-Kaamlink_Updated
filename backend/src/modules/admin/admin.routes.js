import { Op } from "sequelize";
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
import { requireRole } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { profilePhotoDataUrl } from "../../utils/profilePhoto.js";

const router = Router();
const bookingStatuses = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"];
const paymentStatuses = ["unpaid", "paid", "refunded"];
const ticketStatuses = ["new", "in_progress", "resolved", "closed"];
const messageStatuses = ["new", "read", "replied", "archived"];
const professionalStatuses = ["pending", "verified", "rejected"];

router.use(requireAuth, requireRole("admin"));

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

router.get("/bookings", [query("status").optional().isIn(bookingStatuses)], validate, asyncHandler(async (req, res) => {
  const where = req.query.status ? { status: req.query.status } : {};
  const [bookings, professionals] = await Promise.all([Booking.findAll({
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
  })]);
  res.json({ success: true, data: { bookings, professionals } });
}));

router.patch("/bookings/:id", [
  param("id").isInt({ min: 1 }),
  body("status").optional().isIn(bookingStatuses),
  body("payment_status").optional().isIn(paymentStatuses),
  body("professional_id").optional({ nullable: true }).isInt({ min: 1 }),
], validate, asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  const updates = {};
  if (req.body.status) updates.status = req.body.status;
  if (req.body.payment_status) updates.payment_status = req.body.payment_status;
  if (Object.hasOwn(req.body, "professional_id")) {
    const professional = req.body.professional_id ? await Professional.findByPk(req.body.professional_id) : null;
    if (req.body.professional_id && !professional) throw new ApiError(404, "Professional not found");
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

router.get("/customers/:id/photo", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const photo = await CustomerProfilePhoto.findByPk(req.params.id);
  if (!photo) throw new ApiError(404, "This customer has no profile photo.");
  res.json({ success: true, data: { profile_photo: profilePhotoDataUrl(photo) } });
}));

router.get("/customers/:id", [param("id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  const customer = await User.findOne({ where: { id: req.params.id, role: "customer" } });
  if (!customer) throw new ApiError(404, "Customer not found");
  const [photo, bookings] = await Promise.all([
    CustomerProfilePhoto.findByPk(customer.id),
    Booking.findAll({ where: { user_id: customer.id }, order: [["created_at", "DESC"]], limit: 100, include: [{ model: Service, as: "service", attributes: ["id", "name"] }] }),
  ]);
  const { id, full_name, email, phone, address_line, city, pincode, is_active, deleted_at, created_at, updated_at } = customer;
  res.json({ success: true, data: { id, full_name, email, phone, address_line, city, pincode, is_active, deleted_at, created_at, updated_at, profile_photo: profilePhotoDataUrl(photo), bookings } });
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
  for (const key of ["email", "phone"]) {
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
      { model: User, as: "user", attributes: ["id", "full_name", "email", "phone", "is_active", "created_at"] },
      { model: City, as: "city", attributes: ["id", "name", "state"] },
      { model: ServiceCategory, as: "categories", attributes: ["id", "name"], through: { attributes: [] } },
    ],
  }), ServiceCategory.findAll({ where: { is_active: true }, attributes: ["id", "name"] }), City.findAll({ where: { is_active: true }, attributes: ["id", "name", "state"] })]);
  res.json({ success: true, data: { professionals, categories, cities } });
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
  body("verification_status").optional().isIn(professionalStatuses),
  body("is_available").optional().isBoolean(),
  body("is_active").optional().isBoolean(),
], validate, asyncHandler(async (req, res) => {
  const professional = await Professional.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
  if (!professional) throw new ApiError(404, "Professional not found");
  const updates = {};
  for (const key of ["verification_status", "is_available"]) if (req.body[key] !== undefined) updates[key] = req.body[key];
  const nextStatus = updates.verification_status ?? professional.verification_status;
  const nextActive = req.body.is_active ?? professional.user.is_active;
  if (updates.is_available && (nextStatus !== "verified" || !nextActive)) {
    throw new ApiError(400, "A professional must be verified and active before becoming available");
  }
  if (nextStatus !== "verified" || !nextActive) updates.is_available = false;
  await professional.update(updates);
  if (req.body.is_active !== undefined) await professional.user.update({ is_active: req.body.is_active });
  res.json({ success: true, data: professional });
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

router.get("/contact", asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.findAll({ limit: 250, order: [["created_at", "DESC"]] });
  res.json({ success: true, data: messages });
}));

router.patch("/contact/:id", [param("id").isInt({ min: 1 }), body("status").isIn(messageStatuses)], validate, asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id);
  if (!message) throw new ApiError(404, "Contact message not found");
  await message.update({ status: req.body.status });
  res.json({ success: true, data: message });
}));

router.get("/tickets", asyncHandler(async (_req, res) => {
  const tickets = await SupportTicket.findAll({ limit: 250, order: [["created_at", "DESC"]] });
  res.json({ success: true, data: tickets });
}));

router.patch("/tickets/:id", [param("id").isInt({ min: 1 }), body("status").isIn(ticketStatuses)], validate, asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByPk(req.params.id);
  if (!ticket) throw new ApiError(404, "Support ticket not found");
  await ticket.update({ status: req.body.status });
  res.json({ success: true, data: ticket });
}));

router.get("/newsletter", asyncHandler(async (_req, res) => {
  const subscriptions = await NewsletterSubscription.findAll({ order: [["created_at", "DESC"]] });
  res.json({ success: true, data: subscriptions });
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

router.patch("/cities/:id", [param("id").isInt({ min: 1 }), body("is_active").isBoolean()], validate, asyncHandler(async (req, res) => {
  const city = await City.findByPk(req.params.id);
  if (!city) throw new ApiError(404, "City not found");
  await city.update({ is_active: req.body.is_active });
  res.json({ success: true, data: city });
}));

router.post("/pincodes", [body("pincode").matches(/^[1-9][0-9]{5}$/), body("city_id").isInt({ min: 1 })], validate, asyncHandler(async (req, res) => {
  if (!await City.findByPk(req.body.city_id)) throw new ApiError(404, "City not found");
  const pincode = await Pincode.create({ pincode: req.body.pincode, city_id: req.body.city_id, is_serviceable: true });
  res.status(201).json({ success: true, data: pincode });
}));

router.patch("/pincodes/:id", [param("id").isInt({ min: 1 }), body("is_serviceable").isBoolean()], validate, asyncHandler(async (req, res) => {
  const pincode = await Pincode.findByPk(req.params.id);
  if (!pincode) throw new ApiError(404, "PIN code not found");
  await pincode.update({ is_serviceable: req.body.is_serviceable });
  res.json({ success: true, data: pincode });
}));

export default router;
