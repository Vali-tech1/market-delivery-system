function SearchBar({ search, setSearch }) {
  return (
    <label className="search-field">
      <span>Search</span>
      <input
        type="text"
        placeholder="Search by product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </label>
  );
}

export default SearchBar;
