const pool = require("../src/config/db");
const { hashPassword } = require("../src/services/passwordService");

const [, , email, password] = process.argv;

const resetAdminPassword = async () => {
  if (!email || !password) {
    console.error("Usage: node scripts/resetAdminPassword.js <admin-email> <new-password>");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `UPDATE users
     SET password = $1, role = 'admin'
     WHERE email = $2
     RETURNING id, full_name, email, role`,
    [hashedPassword, email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    console.error("No user found with that email.");
    process.exit(1);
  }

  console.log("Admin password reset successfully:");
  console.log(result.rows[0]);
};

resetAdminPassword()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
