const service = require("../services/productService");

const getAll = async (req, res) => {
  try {
    const data = await service.getProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await service.getProduct(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
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
  try {
    const data = await service.editProduct(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    const status = err.message === "Product not found" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.removeProduct(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
