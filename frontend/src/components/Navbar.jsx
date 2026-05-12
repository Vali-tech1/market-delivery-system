function Navbar() {
  return (
    <nav className="navbar">
      <h2>Market Delivery System</h2>

      <div className="nav-links">
        <a href="/">Products</a>
        <a href="/cart">Cart</a>
        <a href="/admin">Admin</a>
      </div>
    </nav>
  );
}

export default Navbar;