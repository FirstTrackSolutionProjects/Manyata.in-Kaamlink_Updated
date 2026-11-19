import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Op } from "sequelize";
import { RefreshToken, User } from "../../models/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { sendPasswordResetEmail } from "../../utils/mailer.js";

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email: email.trim().toLowerCase(), role: "customer", is_active: true, deleted_at: null } });
  if (!user) return;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.update({ password_reset_token_hash: hashToken(token), password_reset_expires_at: expiresAt });
  try {
    await sendPasswordResetEmail({ to: user.email, name: user.full_name, token });
  } catch (error) {
    await user.update({ password_reset_token_hash: null, password_reset_expires_at: null });
    throw error;
  }
}

export async function resetPassword({ token, password }) {
  const user = await User.findOne({
    where: { password_reset_token_hash: hashToken(token), role: "customer", is_active: true, deleted_at: null },
  });
  if (!user || !user.password_reset_expires_at || new Date(user.password_reset_expires_at).getTime() <= Date.now()) {
    throw new ApiError(400, "This reset link is invalid or expired. Request a new one.");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [updatedCount] = await User.update(
    { password_hash, password_reset_token_hash: null, password_reset_expires_at: null },
    { where: { id: user.id, password_reset_token_hash: hashToken(token), password_reset_expires_at: { [Op.gt]: new Date() }, is_active: true, deleted_at: null } },
  );
  if (!updatedCount) throw new ApiError(400, "This reset link is invalid or expired. Request a new one.");
  await RefreshToken.update({ revoked: true }, { where: { user_id: user.id, revoked: false } });
}

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

export async function loginWithGoogle({ credential }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new ApiError(503, "Google sign-in is not configured yet.");
  if (typeof credential !== "string" || credential.length > 10_000) throw new ApiError(400, "Google sign-in could not be verified.");

  let googleProfile;
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Google rejected the ID token.");
    googleProfile = await response.json();
  } catch {
    throw new ApiError(401, "Google sign-in could not be verified. Please try again.");
  }

  if (googleProfile.aud !== clientId || !["accounts.google.com", "https://accounts.google.com"].includes(googleProfile.iss) || googleProfile.email_verified !== "true" || !googleProfile.email || !googleProfile.sub) {
    throw new ApiError(401, "Google sign-in could not be verified.");
  }

  const email = googleProfile.email.trim().toLowerCase();
  let user = await User.findOne({ where: { email } });
  if (user) {
    if (user.role !== "customer") throw new ApiError(403, "Google sign-in is available for customer accounts only.");
    if (!user.is_active || user.deleted_at) throw new ApiError(403, "This account is unavailable. Please contact support.");
    if (user.auth_provider !== "google" || !user.is_verified) await user.update({ auth_provider: "google", is_verified: true });
  } else {
    try {
      user = await User.create({ full_name: (googleProfile.name || email.split("@")[0]).slice(0, 120), email, auth_provider: "google", is_verified: true, role: "customer" });
    } catch (error) {
      if (error.name !== "SequelizeUniqueConstraintError") throw error;
      user = await User.findOne({ where: { email } });
      if (!user || user.role !== "customer" || !user.is_active || user.deleted_at) throw new ApiError(403, "This account is unavailable. Please contact support.");
    }
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
