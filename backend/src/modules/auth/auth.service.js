import bcrypt from "bcryptjs";
import { User } from "../../models/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  signAccessToken, 
  // signRefreshToken, 
} from "../../utils/jwt.js";

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
  const user = await User.findOne({ where: { email: email.trim().toLowerCase(), is_active: true } });
  
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return generateAuthResponse(user);
}

function generateAuthResponse(user) {
  const payload = { id: user.id, role: user.role };
  
  const accessToken = signAccessToken(payload);
  // const refreshToken = signRefreshToken(payload);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken: "",
  };
}
