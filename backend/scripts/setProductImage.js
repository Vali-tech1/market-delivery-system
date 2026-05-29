const pool = require("../src/config/db");

const [, , productName, imageUrl] = process.argv;

const setProductImage = async () => {
  if (!productName || !imageUrl) {
    console.error("Usage: node scripts/setProductImage.js <product-name> <image-url>");
    process.exit(1);
  }

  const result = await pool.query(
    `UPDATE products
     SET image_url = $1
     WHERE LOWER(name) = LOWER($2)
        OR LOWER(name) LIKE LOWER($3)
     RETURNING id, name, image_url`,
    [imageUrl, productName, `%${productName}%`]
  );

  if (result.rowCount === 0) {
    console.error(`No product found matching: ${productName}`);
    process.exit(1);
  }

  console.log("Updated product image:");
  console.log(result.rows);
};

setProductImage()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
