import { useEffect, useState } from "react";
import { useApiRequest } from "./useApiRequest";

export function useApiQuery(requestFn, query = {}) {
  const { execute } = useApiRequest();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await execute(() => requestFn(query));

      if (!res?.success) {
        setError(res?.message || "Failed to fetch data");
        setData([]);
        return;
      }

      const result = res?.data;

      setData(result?.items ?? []);
      setTotalRecords(result?.totalRecords ?? 0);
      setTotalPages(result?.totalPages ?? 0);
      setPageNumber(result?.pageNumber ?? query.pageNumber ?? 1);
      setPageSize(result?.pageSize ?? query.pageSize ?? 10);
    } catch (err) {
      setError(err?.message || "Unexpected error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    query.pageNumber,
    query.pageSize,
    query.searchTerm,
    query.sortBy,
    query.isDescending,
  ]);

  return {
    data,
    loading,
    error,

    totalRecords,
    totalPages,
    pageNumber,
    pageSize,

    refetch: () => fetchData(),
  };
}
