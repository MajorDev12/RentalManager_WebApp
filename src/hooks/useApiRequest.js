import { useState, useCallback } from "react";

export function useApiRequest() {
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (request) => {
    setApiLoading(true);
    setError(null);

    try {
      const res = await request();

      if (!res) return null;

      if (!res.success) {
        setError(res.message || "Request failed");
        return res;
      }

      return res;
    } catch (err) {
      const message = err?.message || "Unexpected error";
      setError(message);
      throw err;
    } finally {
      setApiLoading(false);
    }
  }, []);

  return { execute, apiLoading, error };
}
