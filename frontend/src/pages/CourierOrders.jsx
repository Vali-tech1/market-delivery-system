import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ReadonlyDeliveryMap from "../components/ReadonlyDeliveryMap";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getCourierOrders, updateDeliveryStatus } from "../services/api";

const deliveryOptions = [
  { value: "picked_up", label: "Picked up" },
  { value: "on_the_way", label: "On the way" },
  { value: "delivered", label: "Delivered" },
];

function CourierOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getCourierOrders(user.id);
        setOrders(data);
      } catch (error) {
        setToast({ type: "error", title: "Deliveries unavailable", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user.id]);

  const handleDeliveryStatus = async (orderId, deliveryStatus) => {
    setUpdatingId(orderId);

    try {
      const updatedOrder = await updateDeliveryStatus(orderId, user.id, deliveryStatus);
      setOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      setToast({ type: "success", title: "Delivery updated", message: `Order #${orderId} is ${deliveryStatus.replaceAll("_", " ")}.` });
    } catch (error) {
      setToast({ type: "error", title: "Update failed", message: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading assigned deliveries..." />;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading">
        <span className="eyebrow">Assigned deliveries</span>
        <h1>Courier orders</h1>
        <p>Update delivery progress from pickup through completion.</p>
      </section>

      {orders.length === 0 ? (
        <EmptyState title="No assigned deliveries" message="Admin-assigned orders will appear here after the migration is applied." />
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-main">
                <div>
                  <span className="eyebrow">Order #{order.id}</span>
                  <h2>EUR {Number(order.total_amount).toFixed(2)}</h2>
                </div>
                <StatusBadge status={order.delivery_status || order.status} />
              </div>

              <div className="order-details">
                <span>{order.customer_name || "Customer"}</span>
                <span>{order.delivery_address || order.address}</span>
                <span>{order.phone}</span>
              </div>

              {order.delivery_latitude && order.delivery_longitude ? (
                <div className="courier-map-panel">
                  <ReadonlyDeliveryMap latitude={order.delivery_latitude} longitude={order.delivery_longitude} />
                  <a
                    className="button button-primary full-width"
                    href={`https://www.google.com/maps?q=${order.delivery_latitude},${order.delivery_longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              ) : (
                <div className="manual-address-note">
                  No map pin saved for this order. Use the manual address: {order.delivery_address || order.address}
                </div>
              )}

              <label>
                Delivery status
                <select
                  value={order.delivery_status === "assigned" ? "picked_up" : order.delivery_status || "picked_up"}
                  onChange={(e) => handleDeliveryStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                >
                  {deliveryOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default CourierOrders;
