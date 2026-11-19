import { createHmac, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { body } from "express-validator";
import { Booking } from "../../models/index.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const router = Router();
const RAZORPAY_API = "https://api.razorpay.com/v1";

function razorpayConfig() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || !RAZORPAY_WEBHOOK_SECRET) {
    throw new ApiError(503, "Online payments are not configured yet. Please choose pay after service or contact support.");
  }
  return { keyId: RAZORPAY_KEY_ID, keySecret: RAZORPAY_KEY_SECRET, webhookSecret: RAZORPAY_WEBHOOK_SECRET };
}

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(left || "", "hex");
  const rightBuffer = Buffer.from(right || "", "hex");
  return leftBuffer.length === rightBuffer.length && leftBuffer.length > 0 && timingSafeEqual(leftBuffer, rightBuffer);
}

function amountInPaise(amount) {
  const paise = Math.round(Number(amount) * 100);
  if (!Number.isSafeInteger(paise) || paise < 100) throw new ApiError(400, "The booking amount is invalid for online payment.");
  return paise;
}

async function razorpayRequest(path, { method = "GET", body, keyId, keySecret } = {}) {
  const credentials = keyId && keySecret ? { keyId, keySecret } : razorpayConfig();
  let response;
  try {
    response = await fetch(`${RAZORPAY_API}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString("base64")}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(12000),
    });
  } catch (error) {
    console.error("Razorpay API request failed:", error.message);
    throw new ApiError(502, "Payment service is temporarily unavailable. Please try again.");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Razorpay API rejected a request:", result.error?.code || response.status);
    throw new ApiError(502, "Payment could not be started. Please try again or choose pay after service.");
  }
  return result;
}

router.get("/config", (_req, res) => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = process.env;
  res.json({ success: true, data: { enabled: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && RAZORPAY_WEBHOOK_SECRET) } });
});

router.post("/bookings/:id/order", requireAuth, requireRole("customer"), asyncHandler(async (req, res) => {
  const { keyId, keySecret } = razorpayConfig();
  const booking = await Booking.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (booking.payment_status === "paid") throw new ApiError(409, "This booking has already been paid.");
  if (["cancelled", "completed", "refunded"].includes(booking.status)) throw new ApiError(400, "This booking is no longer eligible for payment.");

  const order = await razorpayRequest("/orders", {
    method: "POST",
    keyId,
    keySecret,
    body: {
      amount: amountInPaise(booking.amount),
      currency: "INR",
      receipt: `manyata_${booking.id}_${Date.now()}`,
      notes: { booking_id: String(booking.id), user_id: String(req.user.id) },
    },
  });
  await booking.update({ payment_method: "razorpay", gateway_order_id: order.id });
  res.status(201).json({ success: true, data: { bookingId: booking.id, orderId: order.id, amount: order.amount, currency: order.currency, keyId } });
}));

router.post("/bookings/:id/verify", requireAuth, requireRole("customer"), [
  body("razorpay_order_id").isString().trim().notEmpty().isLength({ max: 64 }),
  body("razorpay_payment_id").isString().trim().notEmpty().isLength({ max: 64 }),
  body("razorpay_signature").isString().trim().isHexadecimal().isLength({ min: 64, max: 64 }),
], validate, asyncHandler(async (req, res) => {
  const { keySecret } = razorpayConfig();
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
  const booking = await Booking.findOne({ where: { id: req.params.id, user_id: req.user.id, gateway_order_id: orderId } });
  if (!booking) throw new ApiError(400, "Payment does not match this booking.");
  if (booking.payment_status === "paid" && booking.gateway_payment_id === paymentId) {
    return res.json({ success: true, data: { paid: true, bookingId: booking.id } });
  }

  const expectedSignature = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  if (!constantTimeEqual(expectedSignature, signature)) throw new ApiError(400, "Payment verification failed. Please contact support before retrying.");

  const payment = await razorpayRequest(`/payments/${encodeURIComponent(paymentId)}`, { keyId: process.env.RAZORPAY_KEY_ID, keySecret });
  if (payment.order_id !== orderId || Number(payment.amount) !== amountInPaise(booking.amount) || payment.currency !== "INR") {
    throw new ApiError(400, "Payment details do not match the booking.");
  }
  if (payment.status !== "captured") {
    throw new ApiError(409, "Payment is not captured yet. Please wait a moment and refresh your bookings.");
  }

  await booking.update({ payment_status: "paid", payment_method: "razorpay", gateway_payment_id: paymentId });
  res.json({ success: true, data: { paid: true, bookingId: booking.id } });
}));

router.post("/bookings/:id/refund", requireAuth, requireRole("admin"), asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (booking.payment_method !== "razorpay" || !booking.gateway_payment_id) throw new ApiError(400, "This booking does not have a Razorpay payment to refund.");
  if (booking.payment_status !== "paid" || booking.gateway_refund_id) throw new ApiError(409, "This payment is already refunded or has a refund in progress.");

  const refund = await razorpayRequest(`/payments/${encodeURIComponent(booking.gateway_payment_id)}/refund`, {
    method: "POST",
    body: { amount: amountInPaise(booking.amount), notes: { booking_id: String(booking.id) } },
  });
  if (refund.status === "failed") throw new ApiError(502, "Razorpay could not process this refund. Please check the payment dashboard.");
  await booking.update({ gateway_refund_id: refund.id, ...(refund.status === "processed" ? { payment_status: "refunded", status: "refunded" } : {}) });
  res.json({ success: true, data: { refundId: refund.id, status: refund.status, bookingId: booking.id } });
}));

export const paymentWebhookHandler = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.get("x-razorpay-signature") || "";
  if (!secret || !Buffer.isBuffer(req.body)) return res.status(503).json({ success: false });
  const expected = createHmac("sha256", secret).update(req.body).digest("hex");
  if (!constantTimeEqual(expected, signature)) return res.status(400).json({ success: false });

  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({ success: false });
  }

  const payment = event.payload?.payment?.entity;
  if (["payment.captured", "order.paid"].includes(event.event) && payment?.order_id && payment?.id) {
    const booking = await Booking.findOne({ where: { gateway_order_id: payment.order_id, payment_method: "razorpay" } });
    if (booking && Number(payment.amount) === amountInPaise(booking.amount) && payment.currency === "INR" && payment.status === "captured") {
      await booking.update({ payment_status: "paid", gateway_payment_id: payment.id });
    }
  }
  const refund = event.payload?.refund?.entity;
  if (event.event === "refund.processed" && refund?.id && refund?.payment_id) {
    const booking = await Booking.findOne({ where: { gateway_payment_id: refund.payment_id, gateway_refund_id: refund.id, payment_method: "razorpay" } });
    if (booking) await booking.update({ payment_status: "refunded", status: "refunded" });
  }
  if (event.event === "refund.failed" && refund?.id && refund?.payment_id) {
    const booking = await Booking.findOne({ where: { gateway_payment_id: refund.payment_id, gateway_refund_id: refund.id, payment_method: "razorpay" } });
    if (booking) await booking.update({ gateway_refund_id: null });
  }
  res.json({ success: true, received: true });
};

export default router;
