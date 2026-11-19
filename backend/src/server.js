import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { sequelize, testConnection } from "./config/sequelize.js";
import "./models/index.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";
import contactRoutes from "./modules/contact/contact.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import serviceRoutes from "./modules/services/service.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import newsletterRoutes from "./modules/newsletter/newsletter.routes.js";
import supportRoutes from "./modules/support/support.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import paymentRoutes, { paymentWebhookHandler } from "./modules/payments/payment.routes.js";


const app = express();
// Hostinger sends requests through one reverse proxy and supplies X-Forwarded-* headers.
// Trust only that proxy hop so rate limiting can use the real client IP.
app.set("trust proxy", 1);
if (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET.length < 32 || process.env.JWT_ACCESS_SECRET.startsWith("YOUR_")) {
  throw new Error("Set JWT_ACCESS_SECRET to a private random value of at least 32 characters.");
}
if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET === process.env.JWT_ACCESS_SECRET) {
  throw new Error("Set JWT_REFRESH_SECRET to a separate private random value of at least 32 characters.");
}

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("This website is not allowed to access the Manyata API."));
  },
}));
// Razorpay signs the exact request bytes, so preserve the raw body before JSON parsing.
app.post("/api/payments/webhook", express.raw({ type: "application/json", limit: "1mb" }), paymentWebhookHandler);
app.use(express.json({ limit: "2mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use("/api", limiter);

app.get("/", (req, res) => {
  res.send("Manyata API is running");
});

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: "API + MySQL healthy" });
  } catch (err) {
    console.error("MySQL health check failed:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed." });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/contact", contactRoutes);
 app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);



app.use(errorHandler);

const isRunningInLambda = Boolean(
    process.env["AWS_LAMBDA_FUNCTION_NAME"] ||
    process.env["LAMBDA_TASK_ROOT"] ||
    process.env["AWS_EXECUTION_ENV"]
);

const PORT = process.env.PORT || 5000;

export const handler = serverless(app);

if (!isRunningInLambda){
  (async () => {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Manyata API listening on http://localhost:${PORT}`);
    });
  })();
}
