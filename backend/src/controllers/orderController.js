const service = require("../services/orderService");

exports.create = async (req, res) => {
  try {
    const order = await service.createOrder(req.body);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await service.getOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const orders = await service.getCustomerOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to fetch customer orders",
      error: error.message,
    });
  }
};

exports.getByCourier = async (req, res) => {
  try {
    const orders = await service.getCourierOrders(req.params.courierId);
    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to fetch courier orders",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await service.changeOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (error) {
    console.error(error);

    const statusCode = error.message === "Order not found" ? 404 : 400;
    res.status(statusCode).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

exports.assignCourier = async (req, res) => {
  try {
    const order = await service.assignOrderToCourier(req.params.id, req.body.courier_id);
    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to assign courier",
      error: error.message,
    });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const order = await service.changeDeliveryStatus(
      req.params.id,
      req.body.courier_id,
      req.body.delivery_status
    );

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};
