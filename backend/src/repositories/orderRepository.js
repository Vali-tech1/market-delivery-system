const pool = require("../config/db");

const getOrderColumns = async () => {
  const result = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = 'orders'`
  );

  return new Set(result.rows.map((row) => row.column_name));
};

const createOrder = async ({
  user_id,
  total_amount,
  address,
  phone,
  items,
  delivery_address,
  delivery_latitude,
  delivery_longitude,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const columns = await getOrderColumns();
    const hasLocationColumns =
      columns.has("delivery_address") &&
      columns.has("delivery_latitude") &&
      columns.has("delivery_longitude");

    const orderQuery = hasLocationColumns
      ? `INSERT INTO orders (
           user_id,
           total_amount,
           address,
           delivery_address,
           delivery_latitude,
           delivery_longitude,
           phone,
           status
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING *`
      : `INSERT INTO orders (user_id, total_amount, address, phone, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING *`;

    const orderValues = hasLocationColumns
      ? [
          user_id,
          total_amount,
          address,
          delivery_address || address,
          delivery_latitude || null,
          delivery_longitude || null,
          phone,
        ]
      : [user_id, total_amount, address, phone];

    const orderResult = await client.query(orderQuery, orderValues);

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.subtotal,
        ]
      );

      const stockResult = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1
         RETURNING id`,
        [item.quantity, item.product_id]
      );

      if (stockResult.rowCount === 0) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
    }

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllOrders = async () => {
  const result = await pool.query(
    `SELECT orders.*, users.full_name AS customer_name
     FROM orders
     LEFT JOIN users ON users.id = orders.user_id
     ORDER BY orders.id DESC`
  );
  return result.rows;
};

const getOrdersByCustomer = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM orders
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  );
  return result.rows;
};

const getOrdersByCourier = async (courierId) => {
  const columns = await getOrderColumns();

  if (!columns.has("courier_id")) {
    return [];
  }

  const result = await pool.query(
    `SELECT orders.*, users.full_name AS customer_name
     FROM orders
     LEFT JOIN users ON users.id = orders.user_id
     WHERE orders.courier_id = $1
     ORDER BY orders.id DESC`,
    [courierId]
  );

  return result.rows;
};

const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

const assignCourier = async (orderId, courierId) => {
  const columns = await getOrderColumns();

  if (!columns.has("courier_id")) {
    throw new Error("Courier assignment requires the role-system migration");
  }

  const hasDeliveryStatus = columns.has("delivery_status");

  const query = hasDeliveryStatus
    ? `UPDATE orders
       SET courier_id = $1, status = 'assigned_to_courier', delivery_status = 'assigned'
       WHERE id = $2
       RETURNING *`
    : `UPDATE orders
       SET courier_id = $1, status = 'assigned_to_courier'
       WHERE id = $2
       RETURNING *`;

  const result = await pool.query(query, [courierId, orderId]);
  return result.rows[0];
};

const updateDeliveryStatus = async (orderId, courierId, deliveryStatus) => {
  const columns = await getOrderColumns();

  if (!columns.has("delivery_status") || !columns.has("courier_id")) {
    throw new Error("Delivery status requires the role-system migration");
  }

  const orderStatus = deliveryStatus === "delivered" ? "delivered" : "assigned_to_courier";

  const result = await pool.query(
    `UPDATE orders
     SET delivery_status = $1, status = $2
     WHERE id = $3 AND courier_id = $4
     RETURNING *`,
    [deliveryStatus, orderStatus, orderId, courierId]
  );

  return result.rows[0];
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrdersByCourier,
  updateOrderStatus,
  assignCourier,
  updateDeliveryStatus,
};
