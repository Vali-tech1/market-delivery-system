import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeliveryMap from "../components/DeliveryMap";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/api";

function Checkout({ cart, setCart }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    notes: "",
    delivery_latitude: "",
    delivery_longitude: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [toast, setToast] = useState(null);

  const groupedCart = useMemo(() => {
    return Object.values(
      cart.reduce((acc, product) => {
        if (!acc[product.id]) {
          acc[product.id] = { ...product, quantity: 1 };
        } else {
          acc[product.id].quantity += 1;
        }

        return acc;
      }, {})
    );
  }, [cart]);

  const total = groupedCart.reduce((sum, product) => {
    return sum + Number(product.price) * Number(product.quantity);
  }, 0);

  const handleLocationSelect = ({ latitude, longitude }) => {
    setFormData((current) => ({
      ...current,
      delivery_latitude: latitude,
      delivery_longitude: longitude,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setToast({ type: "error", title: "Location unavailable", message: "Your browser does not support geolocation." });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSelect({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setToast({ type: "success", title: "Location selected", message: "Your current location was pinned on the map." });
        setIsLocating(false);
      },
      () => {
        setToast({
          type: "error",
          title: "Location permission denied",
          message: "You can still click the map or enter the address manually.",
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setToast({ type: "error", title: "Cart is empty", message: "Add products before checkout." });
      return;
    }

    if (!formData.address.trim() || !formData.phone.trim()) {
      setToast({ type: "error", title: "Missing delivery details", message: "Address and phone are required." });
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        user_id: user.id,
        total_amount: total,
        address: formData.address.trim(),
        delivery_address: formData.address.trim(),
        delivery_latitude: formData.delivery_latitude || null,
        delivery_longitude: formData.delivery_longitude || null,
        phone: formData.phone.trim(),
        items: groupedCart.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
          unit_price: Number(product.price),
          subtotal: Number(product.price) * product.quantity,
        })),
      });

      setOrderPlaced(true);
      setCart([]);
      setToast({ type: "success", title: "Order placed", message: "Stock was updated successfully." });
    } catch (error) {
      setToast({ type: "error", title: "Order failed", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <EmptyState
          title="Order placed successfully"
          message="Thank you for your order. The admin team can now manage its status."
          action={
            <Link className="button button-primary" to="/">
              Continue shopping
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="page-heading">
        <span className="eyebrow">Checkout</span>
        <h1>Confirm delivery</h1>
        <p>Add your delivery details and review the basket one last time before placing the order.</p>
      </section>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <section className="product-form">
          <div>
            <span className="eyebrow">Delivery</span>
            <h2>Customer information</h2>
            <p className="panel-copy">We use these details only to complete this delivery.</p>
          </div>

          <div className="form-grid single">
            <label>
              Delivery address
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street, building, apartment"
                required
              />
            </label>
            <label>
              Phone number
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="049..."
                required
              />
            </label>
            <label>
              Delivery notes
              <input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional instructions"
              />
            </label>
          </div>

          <div className="map-section">
            <div className="map-section-header">
              <div>
                <span className="eyebrow">Delivery location</span>
                <h2>Pin your drop-off point</h2>
                <p className="panel-copy">Use your current location or click the map to place the delivery pin.</p>
              </div>
              <button className="button button-soft" type="button" onClick={handleUseCurrentLocation} disabled={isLocating}>
                {isLocating ? "Locating..." : "Use Current Location"}
              </button>
            </div>

            <DeliveryMap
              latitude={formData.delivery_latitude}
              longitude={formData.delivery_longitude}
              onSelect={handleLocationSelect}
            />

            {formData.delivery_latitude && formData.delivery_longitude ? (
              <p className="coordinate-note">
                Selected: {Number(formData.delivery_latitude).toFixed(5)}, {Number(formData.delivery_longitude).toFixed(5)}
              </p>
            ) : (
              <p className="coordinate-note">No pin selected yet. Manual address is still accepted.</p>
            )}
          </div>
        </section>

        <aside className="summary-panel">
          <span className="eyebrow">Order summary</span>

          {groupedCart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            groupedCart.map((product) => (
              <div className="summary-row checkout-item-row" key={product.id}>
                <span>
                  {product.name} x {product.quantity}
                </span>
                <strong>EUR {(Number(product.price) * product.quantity).toFixed(2)}</strong>
              </div>
            ))
          )}

          <div className="summary-row total">
            <span>Total</span>
            <strong>EUR {total.toFixed(2)}</strong>
          </div>

          <button className="button button-primary full-width" type="submit" disabled={isSubmitting || cart.length === 0}>
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </>
  );
}

export default Checkout;
