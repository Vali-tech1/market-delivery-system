function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        width: "300px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  );
}

export default SearchBar;