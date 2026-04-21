const pool = require("../config/db");

const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products ORDER BY id");
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

const createProduct = async (product) => {
  const { name, description, price, stock, category_id } = product;

  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, category_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, price, stock, category_id]
  );

  return result.rows[0];
};

const updateProduct = async (id, product) => {
  const { name, description, price, stock, category_id } = product;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, description=$2, price=$3, stock=$4, category_id=$5
     WHERE id=$6
     RETURNING *`,
    [name, description, price, stock, category_id, id]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};