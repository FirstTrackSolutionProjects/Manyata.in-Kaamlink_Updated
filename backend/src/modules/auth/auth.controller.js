import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  const result = await authService.signupUser({ full_name, email, phone, password });
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.status(200).json({ success: true, data: result });
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshUserSession(req.body.refreshToken);
  res.status(200).json({ success: true, data: result });
});

export const bootstrapSession = asyncHandler(async (req, res) => {
  const result = await authService.bootstrapUserSession(req.user);
  res.status(200).json({ success: true, data: result });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.body.refreshToken);
  res.status(200).json({ success: true, data: { loggedOut: true } });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: {
      id: req.user.id,
      full_name: req.user.full_name,
      email: req.user.email,
      role: req.user.role,
    } },
  });
});
