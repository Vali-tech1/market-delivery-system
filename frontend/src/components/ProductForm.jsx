import { useState } from "react";

function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_id: Number(formData.category_id),
    };

    onAddProduct(product);

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h2>Add Product</h2>

      <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />

      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

      <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />

      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />

      <select name="category_id" value={formData.category_id} onChange={handleChange}>
        <option value="1">Pije</option>
        <option value="2">Ushqime</option>
        <option value="3">Embelsira</option>
      </select>

      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;