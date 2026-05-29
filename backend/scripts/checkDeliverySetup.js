const pool = require("../src/config/db");

const checkDeliverySetup = async () => {
  const columns = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = 'orders'
     ORDER BY ordinal_position`
  );

  const couriers = await pool.query(
    `SELECT id, full_name, email, role
     FROM users
     WHERE role = 'courier'
     ORDER BY id`
  );

  const orders = await pool.query(
    `SELECT id, status, delivery_address, delivery_latitude, delivery_longitude
     FROM orders
     ORDER BY id DESC
     LIMIT 5`
  );

  console.log(JSON.stringify({
    columns: columns.rows.map((row) => row.column_name),
    couriers: couriers.rows,
    recentOrders: orders.rows,
  }, null, 2));
};

checkDeliverySetup()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
