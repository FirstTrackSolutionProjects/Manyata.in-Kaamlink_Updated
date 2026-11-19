import { Booking, Service, Professional, Pincode } from "../../models/index.js";
import { Op } from "sequelize";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { service_id, address_line, pincode, slot_start } = req.body;
  
  // req.user is set by requireAuth middleware
  const user_id = req.user.id;

  const service = await Service.findOne({ where: { id: service_id, deleted_at: null } });
  if (!service || !service.is_active) throw new ApiError(404, "Service not found");

  // Calculate slot_end based on service duration
  const startTime = new Date(slot_start);
  if (!address_line?.trim() || !/^\d{6}$/.test(pincode || "") || Number.isNaN(startTime.getTime())) {
    throw new ApiError(400, "Enter a valid service address, 6-digit PIN code, and booking time");
  }
  const coverage = await Pincode.findOne({ where: { pincode, is_serviceable: true, deleted_at: null } });
  if (!coverage) throw new ApiError(400, "Online services are not available at this PIN code yet.");
  if (startTime <= new Date()) throw new ApiError(400, "Booking time must be in the future");
  const endTime = new Date(startTime.getTime() + service.duration_mins * 60000);

  const booking = await Booking.create({
    user_id,
    service_id,
    address_line,
    pincode,
    slot_start: startTime,
    slot_end: endTime,
    amount: service.base_price,
    status: "pending",
    payment_method: "pay_after_service",
  });

  res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { user_id: req.user.id, deleted_at: null },
    include: ["service"] // Include the service details!
  });
  res.status(200).json({ success: true, data: bookings });
});
// For Professionals: Get unassigned jobs matching their category
export const getAvailableJobs = asyncHandler(async (req, res) => {
  // For now, let's just return all 'pending' bookings that have no professional assigned
  const jobs = await Booking.findAll({
    where: {
      status: "pending",
      professional_id: null,
      deleted_at: null,
      [Op.or]: [{ payment_method: "pay_after_service" }, { payment_status: "paid" }],
    },
    include: ["service"]
  });
  res.status(200).json({ success: true, data: jobs });
});

// For Professionals: Accept a job
export const acceptJob = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  
  // Find the professional profile of the logged-in user
  const professional = await Professional.findOne({ where: { user_id: req.user.id } });
  if (!professional) throw new ApiError(403, "You are not a registered professional");

  const booking = await Booking.findByPk(bookingId);
  if (!booking || booking.professional_id) throw new ApiError(400, "Job not available");

  booking.professional_id = professional.id;
  booking.status = "assigned";
  await booking.save();

  res.status(200).json({ success: true, data: booking });
});

// For Admin: Get ALL bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({ where: { deleted_at: null },
    include: ["service", "user"]
  });
  res.status(200).json({ success: true, data: bookings });
});
