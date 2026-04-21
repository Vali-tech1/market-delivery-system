const repo = require("../repositories/productRepository");

const getProducts = async () => {
  return await repo.getAllProducts();
};

const getProduct = async (id) => {
  return await repo.getProductById(id);
};

const addProduct = async (data) => {
  if (!data.name || data.price <= 0) {
    throw new Error("Invalid product data");
  }

  return await repo.createProduct(data);
};

const editProduct = async (id, data) => {
  return await repo.updateProduct(id, data);
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