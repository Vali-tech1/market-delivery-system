const API_URL = "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

export const getProducts = async () => {
  return await request("/products");
};

export const loginUser = async (credentials) => {
  return await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (payload) => {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getCouriers = async () => {
  return await request("/auth/couriers");
};

export const addProduct = async (product) => {
  return await request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
};

export const deleteProduct = async (id) => {
  return await request(`/products/${id}`, {
    method: "DELETE",
  });
};

export const updateProduct = async (id, product) => {
  return await request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
};

export const getOrders = async () => {
  return await request("/orders");
};

export const getCustomerOrders = async (userId) => {
  return await request(`/orders/customer/${userId}`);
};

export const getCourierOrders = async (courierId) => {
  return await request(`/orders/courier/${courierId}`);
};

export const createOrder = async (order) => {
  return await request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

export const updateOrderStatus = async (id, status) => {
  return await request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const assignOrderCourier = async (id, courierId) => {
  return await request(`/orders/${id}/assign-courier`, {
    method: "PATCH",
    body: JSON.stringify({ courier_id: courierId }),
  });
};

export const updateDeliveryStatus = async (id, courierId, deliveryStatus) => {
  return await request(`/orders/${id}/delivery-status`, {
    method: "PATCH",
    body: JSON.stringify({
      courier_id: courierId,
      delivery_status: deliveryStatus,
    }),
  });
};
