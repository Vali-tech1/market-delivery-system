const repo = require("../repositories/authRepository");
const { hashPassword, verifyPassword } = require("./passwordService");

const PUBLIC_ROLES = ["customer", "courier"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
  role: user.role,
});

const register = async ({ full_name, email, password, role = "customer" }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedRole = String(role || "customer").toLowerCase();

  if (!full_name || String(full_name).trim().length < 2) {
    throw new Error("Full name is required");
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error("A valid email is required");
  }

  if (!password || String(password).length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!PUBLIC_ROLES.includes(normalizedRole)) {
    throw new Error("Only customer and courier registration is allowed");
  }

  const existingUser = await repo.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await hashPassword(password);
  const user = await repo.createUser({
    full_name: String(full_name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedRole,
  });

  return normalizeUser(user);
};

const login = async ({ email, password }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail) || !password) {
    throw new Error("Email and password are required");
  }

  const user = await repo.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return normalizeUser(user);
};

const getCouriers = async () => {
  return await repo.getCouriers();
};

module.exports = {
  register,
  login,
  getCouriers,
};
