import { useState } from "react";

export const useQueryFilter = (initialState) => {
  const [query, setQuery] = useState({
    searchTerm: "",
    pageNumber: 1,
    pageSize: 10,
    sortBy: "id",
    isDescending: false,
    ...initialState,
  });

  return { query, setQuery };
};
