import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

const groupCart = (cart) => {
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
};

const flattenCart = (items) => {
  return items.flatMap((item) => Array.from({ length: item.quantity }, () => {
    const { quantity, ...product } = item;
    return product;
  }));
};

function Cart({ cart, setCart }) {
  const items = groupCart(cart);
  const total = items.reduce((sum, product) => sum + Number(product.price) * product.quantity, 0);

  const updateQuantity = (productId, nextQuantity) => {
    const updatedItems = items
      .map((item) => (item.id === productId ? { ...item, quantity: Math.max(nextQuantity, 0) } : item))
      .filter((item) => item.quantity > 0);

    setCart(flattenCart(updatedItems));
  };

  return (
    <>
      <section className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">Your cart</span>
          <h1>Review delivery items</h1>
          <p>Adjust quantities, check subtotals, and continue to a polished checkout.</p>
        </div>
        {cart.length > 0 && (
          <button className="button button-soft" type="button" onClick={() => setCart([])}>
            Clear cart
          </button>
        )}
      </section>

      {cart.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Add products from the storefront to begin an order."
          action={
            <Link className="button button-primary" to="/">
              Browse products
            </Link>
          }
        />
      ) : (
        <section className="checkout-layout">
          <div className="cart-list">
            {items.map((product) => (
              <article className="cart-item cart-line" key={product.id}>
                <img
                  className="cart-thumb"
                  src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
                  alt={product.name}
                />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <small>EUR {Number(product.price).toFixed(2)} each</small>
                </div>
                <div className="quantity-stepper">
                  <button type="button" onClick={() => updateQuantity(product.id, product.quantity - 1)}>
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                    disabled={product.quantity >= Number(product.stock)}
                  >
                    +
                  </button>
                </div>
                <strong>EUR {(Number(product.price) * product.quantity).toFixed(2)}</strong>
                <button className="button button-soft" type="button" onClick={() => updateQuantity(product.id, 0)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="summary-panel">
            <span className="eyebrow">Order summary</span>
            <div className="summary-row">
              <span>Unique items</span>
              <strong>{items.length}</strong>
            </div>
            <div className="summary-row">
              <span>Total quantity</span>
              <strong>{cart.length}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>EUR {total.toFixed(2)}</strong>
            </div>

            <Link className="button button-primary full-width" to="/checkout">
              Proceed to checkout
            </Link>
            <Link className="button button-soft full-width" to="/">
              Continue shopping
            </Link>
          </aside>
        </section>
      )}
    </>
  );
}

export default Cart;
