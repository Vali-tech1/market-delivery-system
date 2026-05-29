import { useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: 1,
  image_url: "",
};

function ProductForm({ onAddProduct, isSubmitting = false }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const product = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_id: Number(formData.category_id),
      image_url: formData.image_url.trim(),
    };

    if (!product.name || product.price <= 0 || product.stock < 0) {
      setError("Enter a name, a positive price, and a stock value of 0 or more.");
      return;
    }

    await onAddProduct(product);
    setFormData(initialForm);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div>
        <span className="eyebrow">Inventory</span>
        <h2>Add product</h2>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <label>
          Product name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Description
          <input name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>
          Price
          <input name="price" type="number" min="0.01" step="0.01" value={formData.price} onChange={handleChange} required />
        </label>

        <label>
          Stock
          <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
        </label>

        <label>
          Category
          <select name="category_id" value={formData.category_id} onChange={handleChange}>
            <option value="1">Drinks</option>
            <option value="2">Groceries</option>
            <option value="3">Sweets</option>
            <option value="4">Bakery</option>
            <option value="5">Dairy</option>
            <option value="6">Fruits & Vegetables</option>
            <option value="7">Household</option>
          </select>
        </label>

        <label>
          Image URL
          <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
        </label>
      </div>

      <button className="button button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add product"}
      </button>
    </form>
  );
}

export default ProductForm;
