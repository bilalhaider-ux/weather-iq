import { motion } from "framer-motion";
import { useState } from "react";

export default function SearchBar({ onSearch, recentCities }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <motion.div
      className="search-wrapper"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search any city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <motion.button
            type="submit"
            className="search-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>
      </form>

      {/* Recent Cities */}
      <div className="recent-cities">
        <span className="recent-label">Recent:</span>
        {recentCities.map((city) => (
          <motion.button
            key={city}
            className="city-chip"
            onClick={() => onSearch(city)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {city}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
