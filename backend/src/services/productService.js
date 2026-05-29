const repo = require("../repositories/productRepository");

const getProducts = async () => {
  return await repo.getAllProducts();
};

const getProduct = async (id) => {
  const product = await repo.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const addProduct = async (data) => {
  if (!data.name || Number(data.price) <= 0 || Number(data.stock) < 0) {
    throw new Error("Invalid product data");
  }

  return await repo.createProduct({
    ...data,
    image_url: data.image_url ? String(data.image_url).trim() : null,
  });
};

const editProduct = async (id, data) => {
  if (!data.name || Number(data.price) <= 0 || Number(data.stock) < 0) {
    throw new Error("Invalid product data");
  }

  const product = await repo.updateProduct(id, {
    ...data,
    image_url: data.image_url ? String(data.image_url).trim() : null,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const removeProduct = async (id) => {
  return await repo.deleteProduct(id);
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
};
