import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getCourierOrders } from "../services/api";

function CourierDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getCourierOrders(user.id);
        setOrders(data);
      } catch (error) {
        setToast({ type: "error", title: "Courier data unavailable", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user.id]);

  const metrics = useMemo(() => {
    return {
      assigned: orders.length,
      active: orders.filter((order) => order.delivery_status !== "delivered").length,
      delivered: orders.filter((order) => order.delivery_status === "delivered" || order.status === "delivered").length,
    };
  }, [orders]);

  if (isLoading) {
    return <LoadingState message="Loading courier dashboard..." />;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">Courier dashboard</span>
          <h1>Delivery workspace</h1>
          <p>Review assigned orders and keep delivery progress updated.</p>
        </div>
        <Link className="button button-primary" to="/courier/orders">
          View deliveries
        </Link>
      </section>

      <section className="metrics-grid">
        <article className="metric-card accent-blue">
          <span>Assigned</span>
          <strong>{metrics.assigned}</strong>
        </article>
        <article className="metric-card accent-amber">
          <span>Active</span>
          <strong>{metrics.active}</strong>
        </article>
        <article className="metric-card accent-green">
          <span>Delivered</span>
          <strong>{metrics.delivered}</strong>
        </article>
      </section>
    </>
  );
}

export default CourierDashboard;
