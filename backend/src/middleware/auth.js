import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "You are not logged in. Please log in to get access.");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Your login has expired. Please log in again.");
  }

  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser || !currentUser.is_active || currentUser.deleted_at) {
    throw new ApiError(401, "The user belonging to this token no longer exists.");
  }

  req.user = currentUser;
  next();
});
