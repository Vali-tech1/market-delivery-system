import { useState } from "react";

export const categoryLabels = {
  1: "Drinks",
  2: "Groceries",
  3: "Sweets",
  4: "Bakery",
  5: "Dairy",
  6: "Fruits & Veg",
  7: "Household",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=900&q=80",
];

const getFallbackImage = (id) => fallbackImages[Number(id || 0) % fallbackImages.length];

function ProductCard({ product, onDelete, onAddToCart, onEdit, canManage = false, canBuy = true }) {
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);
  const stock = Number(product.stock);
  const price = Number(product.price);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 10;
  const imageSrc = !imageFailed && product.image_url ? product.image_url : getFallbackImage(product.id);

  const increase = () => setQuantity((current) => Math.min(current + 1, Math.max(stock, 1)));
  const decrease = () => setQuantity((current) => Math.max(current - 1, 1));

  return (
    <article className={`product-card ${isOutOfStock ? "product-card-disabled" : ""}`}>
      <div className="product-image">
        <img src={imageSrc} alt={product.name} onError={() => setImageFailed(true)} />
        <span className="category-badge">{categoryLabels[product.category_id] || "Market"}</span>
        {isLowStock && <span className="deal-badge">Low stock</span>}
        {isOutOfStock && <span className="deal-badge sold-out">Sold out</span>}
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span className={isLowStock || isOutOfStock ? "stock-low" : "stock-ok"}>
            {isOutOfStock ? "Out of stock" : `${stock} available`}
          </span>
          <span>Fast delivery</span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-footer">
          <strong>EUR {price.toFixed(2)}</strong>
          {canBuy && (
            <div className="quantity-stepper" aria-label={`Quantity for ${product.name}`}>
              <button type="button" onClick={decrease} disabled={quantity === 1 || isOutOfStock}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={increase} disabled={isOutOfStock || quantity >= stock}>
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        {canBuy && (
          <button
            className="button button-primary"
            type="button"
            onClick={() => onAddToCart(product, quantity)}
            disabled={isOutOfStock}
          >
            Add to cart
          </button>
        )}
        {canManage && (
          <>
            <button className="button button-soft" type="button" onClick={() => onEdit(product)}>
              Edit
            </button>
            <button className="button button-danger" type="button" onClick={() => onDelete(product.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
