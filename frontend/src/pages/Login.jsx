import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(formData);
      const fallback = user.role === "admin" ? "/admin" : user.role === "courier" ? "/courier" : "/";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (error) {
      setToast({ type: "error", title: "Login failed", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="auth-layout">
        <div className="auth-panel">
          <span className="eyebrow">Welcome back</span>
          <h1>Login</h1>
          <p>Access products, orders, courier deliveries, or admin operations based on your role.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </label>

            <button className="button button-primary full-width" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-link">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;
