const service = require("../services/productService");

const getAll = async (req, res) => {
  const data = await service.getProducts();
  res.json(data);
};

const getById = async (req, res) => {
  const data = await service.getProduct(req.params.id);
  res.json(data);
};

const create = async (req, res) => {
  try {
    const data = await service.addProduct(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const data = await service.editProduct(req.params.id, req.body);
  res.json(data);
};

const remove = async (req, res) => {
  await service.removeProduct(req.params.id);
  res.json({ message: "Deleted successfully" });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};