import bcrypt from "bcryptjs";
import { createHash, randomUUID } from "node:crypto";
import { RefreshToken, User } from "../../models/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function signupUser({ full_name, email, phone, password }) {
  email = email.trim().toLowerCase();
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, "Email already registered");

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    full_name,
    email,
    phone: phone || null,
    password_hash,
    role: "customer",
  });

  return generateAuthResponse(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email: email.trim().toLowerCase(), is_active: true, deleted_at: null } });
  
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return generateAuthResponse(user);
}

async function generateAuthResponse(user) {
  const payload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ ...payload, jti: randomUUID() });
  await RefreshToken.create({ user_id: user.id, token_hash: hashToken(refreshToken) });

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshUserSession(token) {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Your session expired. Please sign in again.");
  }

  const storedToken = await RefreshToken.findOne({
    where: { user_id: decoded.id, token_hash: hashToken(token), revoked: false },
  });
  if (!storedToken) throw new ApiError(401, "Your session expired. Please sign in again.");

  const [revokedCount] = await RefreshToken.update(
    { revoked: true },
    { where: { id: storedToken.id, revoked: false } }
  );
  if (!revokedCount) throw new ApiError(401, "Your session expired. Please sign in again.");

  const user = await User.findByPk(decoded.id);
  if (!user || !user.is_active || user.deleted_at) throw new ApiError(401, "This account is unavailable. Please contact support.");
  return generateAuthResponse(user);
}

export async function bootstrapUserSession(user) {
  return generateAuthResponse(user);
}

export async function logoutUser(token) {
  if (!token) return;
  await RefreshToken.update(
    { revoked: true },
    { where: { token_hash: hashToken(token), revoked: false } }
  );
}
