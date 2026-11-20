import { ApiError } from "../../utils/ApiError.js";

export const ADMIN_SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings" },
  { key: "services", label: "Services & categories" },
  { key: "professionals", label: "Partners" },
  { key: "service-areas", label: "Service areas" },
  { key: "customers", label: "Customers" },
  { key: "contact", label: "Contact inbox" },
  { key: "tickets", label: "Support tickets" },
  { key: "newsletter", label: "Newsletter" },
];

export const ADMIN_PERMISSION_KEYS = ADMIN_SECTIONS.map(({ key }) => key);

export function requireAdminConsole(req, _res, next) {
  if (req.user?.role === "admin") return next();
  if (req.user?.role !== "employee") return next(new ApiError(403, "You do not have permission to access this resource."));

  const section = req.path.split("/").filter(Boolean)[0];
  if (section === "profiles" || section === "team") return next(new ApiError(403, "Only the owner can manage staff access and view the full profile directory."));
  const permission = section === "categories" ? "services" : ["cities", "pincodes"].includes(section) ? "service-areas" : section;
  if (!ADMIN_PERMISSION_KEYS.includes(permission) || !Array.isArray(req.user.admin_permissions) || !req.user.admin_permissions.includes(permission)) {
    return next(new ApiError(403, "Your owner has not granted access to this section."));
  }
  return next();
}
