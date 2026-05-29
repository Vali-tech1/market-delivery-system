import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getCustomerOrders } from "../services/api";

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getCustomerOrders(user.id);
        setOrders(data);
      } catch (error) {
        setToast({ type: "error", title: "Could not load orders", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user.id]);

  if (isLoading) {
    return <LoadingState message="Loading your orders..." />;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading">
        <span className="eyebrow">Customer orders</span>
        <h1>My orders</h1>
        <p>Track your order history and current delivery progress.</p>
      </section>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your checkout orders will appear here." />
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-main">
                <div>
                  <span className="eyebrow">Order #{order.id}</span>
                  <h2>EUR {Number(order.total_amount).toFixed(2)}</h2>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-details">
                <span>{order.delivery_address || order.address}</span>
                <span>{order.phone}</span>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div className="order-timeline">
                {["pending", "accepted", "preparing", "assigned_to_courier", "delivered"].map((status) => (
                  <span className={order.status === status ? "timeline-step active" : "timeline-step"} key={status}>
                    {status.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default MyOrders;
