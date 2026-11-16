import { Router } from "express";
import { createBooking, getMyBookings, getAvailableJobs, acceptJob, getAllBookings } from "./booking.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";

const router = Router();

router.post("/", requireAuth, requireRole("customer"), createBooking);
router.get("/me", requireAuth, requireRole("customer"), getMyBookings);
router.get("/available", requireAuth, requireRole("professional"), getAvailableJobs);
router.patch("/:id/accept", requireAuth, requireRole("professional"), acceptJob);
router.get("/all", requireAuth, requireRole("admin"), getAllBookings);

export default router;
