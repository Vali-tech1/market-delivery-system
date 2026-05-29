import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { assignOrderCourier, getCouriers, getOrders, updateOrderStatus } from "../services/api";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "assigned_to_courier", label: "Assigned to courier" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const normalizeStatus = (status) => {
  if (status === "confirmed") return "accepted";
  if (status === "out_for_delivery") return "assigned_to_courier";
  return status;
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [orderData, courierData] = await Promise.all([getOrders(), getCouriers()]);
        setOrders(orderData);
        setCouriers(courierData);
      } catch (error) {
        setToast({ type: "error", title: "Orders unavailable", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const replaceOrder = (updatedOrder) => {
    setOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  };

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);

    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      replaceOrder(updatedOrder);
      setToast({ type: "success", title: "Order updated", message: `Order #${orderId} is now ${status.replaceAll("_", " ")}.` });
    } catch (error) {
      setToast({ type: "error", title: "Could not update order", message: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCourierAssign = async (orderId, courierId) => {
    if (!courierId) return;

    setUpdatingId(orderId);

    try {
      const updatedOrder = await assignOrderCourier(orderId, courierId);
      replaceOrder(updatedOrder);
      setToast({ type: "success", title: "Courier assigned", message: `Order #${orderId} is ready for delivery.` });
    } catch (error) {
      setToast({ type: "error", title: "Could not assign courier", message: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading orders..." />;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">Admin orders</span>
          <h1>Manage order workflow</h1>
          <p>Accept, prepare, assign, deliver, or cancel customer orders.</p>
        </div>

        <label className="filter-control">
          Status
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All orders</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filteredOrders.length === 0 ? (
        <EmptyState title="No orders found" message="Try changing the status filter." />
      ) : (
        <section className="orders-list">
          {filteredOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-main">
                <div>
                  <span className="eyebrow">Order #{order.id}</span>
                  <h2>EUR {Number(order.total_amount).toFixed(2)}</h2>
                </div>
                <div className="status-stack">
                  <StatusBadge status={order.status} />
                  {order.delivery_status && <StatusBadge status={order.delivery_status} />}
                </div>
              </div>

              <div className="order-details">
                <span>{order.customer_name || `Customer #${order.user_id}`}</span>
                <span>{order.delivery_address || order.address}</span>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>

              <div className="order-controls">
                <label>
                  Order status
                  <select
                    value={normalizeStatus(order.status)}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Assign courier
                  <select
                    value={order.courier_id || ""}
                    onChange={(e) => handleCourierAssign(order.id, e.target.value)}
                    disabled={updatingId === order.id || couriers.length === 0}
                  >
                    <option value="">Select courier</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.full_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default AdminOrders;
