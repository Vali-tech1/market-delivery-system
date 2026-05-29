const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

const seedPath = path.resolve(__dirname, "../database/sample-products.sql");

const applySeed = async () => {
  const sql = fs.readFileSync(seedPath, "utf8");
  await pool.query(sql);
  console.log("Sample products seed applied successfully.");
};

applySeed()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
