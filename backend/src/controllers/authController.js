const service = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await service.login(req.body);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getCouriers = async (req, res) => {
  try {
    const couriers = await service.getCouriers();
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCouriers,
};
