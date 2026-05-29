const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

const migrationPath = path.resolve(__dirname, "../database/order-location-migration.sql");

const applyMigration = async () => {
  const sql = fs.readFileSync(migrationPath, "utf8");
  await pool.query(sql);
  console.log("Order location migration applied successfully.");
};

applyMigration()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
