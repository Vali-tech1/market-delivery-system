function ProductCard({ product, onDelete, onAddToCart, onEdit }) {
  return (
    <div className="product-card"
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "10px",
        width: "250px",
      }}
    >
      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <p>
        <strong>Price:</strong> €{product.price}
      </p>

      <p>
        <strong>Stock:</strong> {product.stock}
      </p>

    <button
  onClick={() => onAddToCart(product)}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Add to Cart
</button>

      <button
        onClick={() => onDelete(product.id)}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>

      <button
  onClick={() => onEdit(product)}
  style={{
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Edit
</button>
    </div>
  );
}

export default ProductCard;