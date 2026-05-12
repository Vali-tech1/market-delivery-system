import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import ProductForm from "../components/ProductForm";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (product) => {
  setEditingProduct(product);
};

  const cartTotal = cart.reduce((total, product) => {
  return total + Number(product.price);
}, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (product) => {
    const newProduct = await addProduct(product);
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClearCart = () => {
  setCart([]);
};

const handleUpdateProduct = async () => {
  const updatedProduct = await updateProduct(editingProduct.id, editingProduct);

  setProducts(
    products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    )
  );

  setEditingProduct(null);
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cart Items: {cart.length}</h2>
      <h3>Total: €{cartTotal.toFixed(2)}</h3>
      <button onClick={handleClearCart}>
  Clear Cart
</button>

{editingProduct && (
  <div style={{ marginBottom: "30px" }}>
    <h2>Edit Product</h2>

    <input
      value={editingProduct.name}
      onChange={(e) =>
        setEditingProduct({ ...editingProduct, name: e.target.value })
      }
      placeholder="Name"
    />

    <input
      value={editingProduct.description}
      onChange={(e) =>
        setEditingProduct({ ...editingProduct, description: e.target.value })
      }
      placeholder="Description"
    />

    <input
      type="number"
      value={editingProduct.price}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          price: Number(e.target.value),
        })
      }
      placeholder="Price"
    />

    <input
      type="number"
      value={editingProduct.stock}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          stock: Number(e.target.value),
        })
      }
      placeholder="Stock"
    />

    <button onClick={handleUpdateProduct}>Save Changes</button>

    <button onClick={() => setEditingProduct(null)}>Cancel</button>
  </div>
)}

      <h1>Products</h1>

      <ProductForm onAddProduct={handleAddProduct} />
      <SearchBar search={search} setSearch={setSearch} />

      <div className="products-grid">
        {filteredProducts.map((product) => (
      <ProductCard
  key={product.id}
  product={product}
  onDelete={handleDeleteProduct}
  onAddToCart={handleAddToCart}
  onEdit={handleEditProduct}
/>
        ))}
      </div>
    </div>
  );
}

export default Products;