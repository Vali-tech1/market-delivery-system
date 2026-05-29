import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setToast({ type: "error", title: "Password too short", message: "Use at least 6 characters." });
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register(formData);
      navigate(user.role === "courier" ? "/courier" : "/", { replace: true });
    } catch (error) {
      setToast({ type: "error", title: "Registration failed", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="auth-layout">
        <div className="auth-panel">
          <span className="eyebrow">Create account</span>
          <h1>Register</h1>
          <p>Choose customer for shopping or courier for delivery operations. Admin accounts are created separately.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </label>

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

            <label>
              Role
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="courier">Courier</option>
              </select>
            </label>

            <button className="button button-primary full-width" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-link">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
