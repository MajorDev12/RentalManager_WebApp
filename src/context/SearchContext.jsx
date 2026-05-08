import { createContext, useContext, useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  const location = useLocation();

  // Reset search on route change
  useEffect(() => {
    setSearch("");
  }, [location.pathname]);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
