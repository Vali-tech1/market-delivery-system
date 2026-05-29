const repo = require("../repositories/orderRepository");

const ORDER_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "assigned_to_courier",
  "delivered",
  "cancelled",
];

const LEGACY_STATUS_MAP = {
  confirmed: "accepted",
  out_for_delivery: "assigned_to_courier",
};

const DELIVERY_STATUSES = ["picked_up", "on_the_way", "delivered"];

const normalizeStatus = (status) => {
  return LEGACY_STATUS_MAP[status] || status;
};

const createOrder = async (data) => {
  if (!data.user_id) {
    throw new Error("Customer user is required");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  if (!data.address || !data.phone) {
    throw new Error("Address and phone are required");
  }

  const latitude = data.delivery_latitude;
  const longitude = data.delivery_longitude;

  if (
    (latitude !== undefined && latitude !== null && Number.isNaN(Number(latitude))) ||
    (longitude !== undefined && longitude !== null && Number.isNaN(Number(longitude)))
  ) {
    throw new Error("Delivery coordinates must be valid numbers");
  }

  return await repo.createOrder({
    ...data,
    delivery_address: data.delivery_address || data.address,
    delivery_latitude: latitude === "" ? null : latitude,
    delivery_longitude: longitude === "" ? null : longitude,
  });
};

const getOrders = async () => {
  return await repo.getAllOrders();
};

const getCustomerOrders = async (userId) => {
  if (!userId) {
    throw new Error("Customer id is required");
  }

  return await repo.getOrdersByCustomer(userId);
};

const getCourierOrders = async (courierId) => {
  if (!courierId) {
    throw new Error("Courier id is required");
  }

  return await repo.getOrdersByCourier(courierId);
};

const changeOrderStatus = async (id, status) => {
  const normalizedStatus = normalizeStatus(status);

  if (!ORDER_STATUSES.includes(normalizedStatus)) {
    throw new Error("Invalid order status");
  }

  const order = await repo.updateOrderStatus(id, normalizedStatus);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const assignOrderToCourier = async (orderId, courierId) => {
  if (!courierId) {
    throw new Error("Courier is required");
  }

  const order = await repo.assignCourier(orderId, courierId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const changeDeliveryStatus = async (orderId, courierId, deliveryStatus) => {
  if (!DELIVERY_STATUSES.includes(deliveryStatus)) {
    throw new Error("Invalid delivery status");
  }

  const order = await repo.updateDeliveryStatus(orderId, courierId, deliveryStatus);

  if (!order) {
    throw new Error("Order not found for this courier");
  }

  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getCustomerOrders,
  getCourierOrders,
  changeOrderStatus,
  assignOrderToCourier,
  changeDeliveryStatus,
};
