import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/offers", label: "Offers" },
  ],
  customer: [
    { to: "/", label: "Products" },
    { to: "/cart", label: "Cart" },
    { to: "/checkout", label: "Checkout" },
    { to: "/my-orders", label: "My Orders" },
  ],
  courier: [
    { to: "/courier", label: "Courier Dashboard" },
    { to: "/courier/orders", label: "Assigned Deliveries" },
  ],
};

function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user ? linksByRole[user.role] || [] : [{ to: "/", label: "Products" }];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">M</span>
        <span>
          <strong>Market Delivery</strong>
          <small>{user ? `${user.full_name} - ${user.role}` : "Fresh orders, fast dispatch"}</small>
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
            {link.to === "/cart" && cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>
        ))}

        {user ? (
          <button className="nav-action" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
