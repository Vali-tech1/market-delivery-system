import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard, { categoryLabels } from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import ProductForm from "../components/ProductForm";
import OfferBanner from "../components/OfferBanner";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../services/api";

function Products({ cart, setCart }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const cartTotal = useMemo(() => {
    return cart.reduce((total, product) => total + Number(product.price), 0);
  }, [cart]);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => Number(product.category_id)).filter(Boolean))];
    return [
      { value: "All", label: "All" },
      ...unique.map((id) => ({ value: String(id), label: categoryLabels[id] || `Category ${id}` })),
    ];
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products
      .filter((product) => Number(product.stock) > 0)
      .sort((a, b) => Number(b.stock) - Number(a.stock))
      .slice(0, 4);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 10).slice(0, 4);
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setToast({ type: "error", title: "Products unavailable", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.description || ""}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || Number(product.category_id) === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleAddProduct = async (product) => {
    setIsSaving(true);
    try {
      const newProduct = await addProduct(product);
      setProducts((current) => [...current, newProduct]);
      setToast({ type: "success", title: "Product added", message: `${newProduct.name} is now in stock.` });
    } catch (error) {
      setToast({ type: "error", title: "Could not add product", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setToast({ type: "success", title: "Product deleted" });
    } catch (error) {
      setToast({ type: "error", title: "Could not delete product", message: error.message });
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    if (!isCustomer) {
      setToast({ type: "error", title: "Customer action", message: "Only customers can add products to cart." });
      return;
    }

    const items = Array.from({ length: quantity }, () => product);
    setCart((current) => [...current, ...items]);
    setToast({ type: "success", title: "Added to cart", message: `${quantity} x ${product.name}` });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedProduct = await updateProduct(editingProduct.id, {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        category_id: Number(editingProduct.category_id),
        image_url: editingProduct.image_url || "",
      });

      setProducts((current) =>
        current.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      setEditingProduct(null);
      setToast({ type: "success", title: "Product updated", message: updatedProduct.name });
    } catch (error) {
      setToast({ type: "error", title: "Could not update product", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="market-hero">
        <div>
          <span className="eyebrow">{isAdmin ? "Admin catalog" : "Fresh delivery"}</span>
          <h1>{isAdmin ? "Manage every shelf with confidence" : "Groceries delivered fast, fresh, and easy"}</h1>
          <p>
            {isAdmin
              ? "Add products, update images, track stock, and keep the storefront ready for customers."
              : "Shop market essentials, bakery favorites, dairy, snacks, produce, and household goods in one polished basket."}
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#products">
              Shop products
            </a>
            {isCustomer && <Link className="button button-ghost" to="/my-orders">Track orders</Link>}
          </div>
        </div>

        <div className="hero-card">
          <span className="eyebrow">Basket</span>
          <strong>{cart.length} items</strong>
          <p>EUR {cartTotal.toFixed(2)}</p>
          <div className="delivery-note">Estimated delivery: 30-45 min</div>
        </div>
      </section>

      <OfferBanner />

      {featuredProducts.length > 0 && (
        <section className="store-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>Popular right now</h2>
            </div>
            <span>{featuredProducts.length} picks</span>
          </div>
          <div className="featured-strip">
            {featuredProducts.map((product) => (
              <button
                className="featured-item"
                key={product.id}
                type="button"
                onClick={() => setSearch(product.name)}
              >
                <span>{product.name}</span>
                <strong>EUR {Number(product.price).toFixed(2)}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      {isAdmin && (
        <section className="content-grid">
          <ProductForm onAddProduct={handleAddProduct} isSubmitting={isSaving} />

          {editingProduct && (
            <form className="product-form edit-panel" onSubmit={handleUpdateProduct}>
              <div>
                <span className="eyebrow">Editing</span>
                <h2>{editingProduct.name}</h2>
              </div>

              <div className="form-grid">
                <label>
                  Product name
                  <input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Description
                  <input
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Image URL
                  <input
                    value={editingProduct.image_url || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="button-row">
                <button className="button button-primary" type="submit" disabled={isSaving}>
                  Save changes
                </button>
                <button className="button button-soft" type="button" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="store-section" id="products">
        <div className="section-header">
          <div>
            <span className="eyebrow">Browse</span>
            <h2>Market shelves</h2>
          </div>
          {lowStockProducts.length > 0 && <span>{lowStockProducts.length} low-stock items</span>}
        </div>

        <div className="category-pills">
          {categories.map((category) => (
            <button
              className={selectedCategory === category.value ? "category-pill active" : "category-pill"}
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <section className="toolbar">
          <SearchBar search={search} setSearch={setSearch} />

          <label>
            Category
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <button className="button button-soft" type="button" onClick={() => setCart([])} disabled={cart.length === 0}>
            Clear cart
          </button>
        </section>

        {isLoading ? (
          <LoadingState message="Loading fresh products..." />
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No products found" message="Try another search term or category." />
        ) : (
          <section className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onAddToCart={handleAddToCart}
                onEdit={setEditingProduct}
                canManage={isAdmin}
                canBuy={isCustomer}
              />
            ))}
          </section>
        )}
      </section>
    </>
  );
}

export default Products;
