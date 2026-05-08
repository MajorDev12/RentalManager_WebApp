import { useState, useEffect } from "react";
import { useApiQuery } from "./useApiQuery";

export function useDataTable(serviceFn, initialQuery) {
  const [query, setQuery] = useState(initialQuery);

  const { data, loading, error, totalPages, pageNumber, pageSize, refetch } =
    useApiQuery(serviceFn, query);

  // search helper
  const setSearch = (value) => {
    setQuery((prev) => ({
      ...prev,
      searchTerm: value,
      pageNumber: 1,
    }));
  };

  // sort helper
  const setSort = (column) => {
    setQuery((prev) => ({
      ...prev,
      sortBy: column,
      isDescending: prev.sortBy === column ? !prev.isDescending : false,
      pageNumber: 1,
    }));
  };

  // pagination helper
  const setPage = (page) => {
    setQuery((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  return {
    data,
    loading,
    error,

    query,
    setQuery,

    setSearch,
    setSort,
    setPage,

    totalPages,
    pageNumber,
    pageSize,

    refetch,
  };
}
