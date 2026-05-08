import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useUrlSync(query, setQuery) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL → State (initial load)
  useEffect(() => {
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const isDescending = searchParams.get("isDescending");

    setQuery((prev) => ({
      ...prev,
      pageNumber: page ? Number(page) : prev.pageNumber,
      searchTerm: search ?? "",
      sortBy: sortBy ?? "",
      isDescending: isDescending === "true",
    }));
  }, []);

  // State → URL
  useEffect(() => {
    const params = {};

    if (query.pageNumber) params.page = query.pageNumber;
    if (query.searchTerm) params.search = query.searchTerm;
    if (query.sortBy) params.sortBy = query.sortBy;
    if (query.isDescending !== undefined)
      params.isDescending = query.isDescending;

    setSearchParams(params, { replace: true });
  }, [query]);
}
