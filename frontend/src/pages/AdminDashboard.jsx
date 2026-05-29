import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import Toast from "../components/Toast";
import { getProducts, getOrders } from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productData, orderData] = await Promise.all([getProducts(), getOrders()]);
        setProducts(productData);
        setOrders(orderData);
      } catch (error) {
        setToast({ type: "error", title: "Dashboard unavailable", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const inventoryValue = products.reduce((sum, product) => {
      return sum + Number(product.price) * Number(product.stock);
    }, 0);
    const lowStockProducts = products.filter((product) => Number(product.stock) <= 10);
    const pendingOrders = orders.filter((order) => order.status === "pending");
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const revenue = deliveredOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

    return {
      inventoryValue,
      lowStockProducts,
      pendingOrders,
      deliveredOrders,
      revenue,
    };
  }, [products, orders]);

  if (isLoading) {
    return <LoadingState message="Preparing dashboard..." />;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Operations overview</h1>
          <p>Monitor products, stock value, low inventory, cart activity, and active orders.</p>
        </div>
        <Link className="button button-primary" to="/admin/orders">
          Manage orders
        </Link>
      </section>

      <section className="metrics-grid">
        <article className="metric-card accent-blue">
          <span>Total products</span>
          <strong>{products.length}</strong>
        </article>
        <article className="metric-card accent-amber">
          <span>Inventory value</span>
          <strong>EUR {metrics.inventoryValue.toFixed(2)}</strong>
        </article>
        <article className="metric-card accent-purple">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </article>
        <article className="metric-card accent-slate">
          <span>Pending orders</span>
          <strong>{metrics.pendingOrders.length}</strong>
        </article>
        <article className="metric-card accent-green">
          <span>Delivered orders</span>
          <strong>{metrics.deliveredOrders.length}</strong>
        </article>
        <article className="metric-card accent-red">
          <span>Low stock</span>
          <strong>{metrics.lowStockProducts.length}</strong>
        </article>
        <article className="metric-card accent-blue">
          <span>Revenue</span>
          <strong>EUR {metrics.revenue.toFixed(2)}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Inventory alerts</span>
              <h2>Low stock products</h2>
            </div>
          </div>

          {metrics.lowStockProducts.length === 0 ? (
            <EmptyState title="Stock looks healthy" message="No products are below the alert threshold." />
          ) : (
            <div className="table-list">
              {metrics.lowStockProducts.map((product) => (
                <div className="table-row" key={product.id}>
                  <span>{product.name}</span>
                  <strong>{product.stock} left</strong>
                  <small>EUR {Number(product.price).toFixed(2)}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Recent activity</span>
              <h2>Latest orders</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <EmptyState title="No orders yet" message="New checkout orders will appear here." />
          ) : (
            <div className="table-list">
              {orders.slice(0, 5).map((order) => (
                <div className="table-row" key={order.id}>
                  <span>Order #{order.id}</span>
                  <strong>EUR {Number(order.total_amount).toFixed(2)}</strong>
                  <small>{order.status.replaceAll("_", " ")}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;
