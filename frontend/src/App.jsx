import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import CourierDashboard from "./pages/CourierDashboard";
import CourierOrders from "./pages/CourierOrders";
import Offers from "./pages/Offers";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <div className="app-shell">
      <Navbar cartCount={cart.length} />

      <main className="page-shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin", "customer"]}>
                <Products cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["customer"]}>
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={["customer"]}>
                <Checkout cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute roles={["customer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard cart={cart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courier"
            element={
              <ProtectedRoute roles={["courier"]}>
                <CourierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courier/orders"
            element={
              <ProtectedRoute roles={["courier"]}>
                <CourierOrders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
