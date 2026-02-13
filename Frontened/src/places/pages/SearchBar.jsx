// SearchBar.js (New component)
import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, onClearSearch }) => {
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (event) => {
    event.preventDefault();
   
    if (searchQuery.trim() === "") {
      onClearSearch();
      return;
    }
    onSearch(searchType, searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      onClearSearch();
    }
  };

  return (
    <form onSubmit={searchHandler} className="search-bar">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-select"
      >
        <option value="title">Title</option>
        <option value="city">City</option>
      </select>
      <input
        type="text"
        placeholder="Search places..."
        value={searchQuery}
        onChange={handleInputChange}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};
export default SearchBar;
