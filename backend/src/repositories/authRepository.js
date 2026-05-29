const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, full_name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const createUser = async ({ full_name, email, password, role }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, created_at`,
    [full_name, email, password, role]
  );

  return result.rows[0];
};

const getCouriers = async () => {
  const result = await pool.query(
    `SELECT id, full_name, email, role
     FROM users
     WHERE role = 'courier'
     ORDER BY full_name`
  );

  return result.rows;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getCouriers,
};
