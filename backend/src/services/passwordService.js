const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (password, storedPassword) => {
  if (!storedPassword) {
    return false;
  }

  return await bcrypt.compare(password, storedPassword);
};

module.exports = {
  hashPassword,
  verifyPassword,
};
