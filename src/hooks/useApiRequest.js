import { useState } from "react";

export function useApiRequest() {
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async ({ request }) => {
    setApiLoading(true);
    setError(null);

    try {
      const res = await request();

      if (!res) {
        return null;
      }

      if (!res.success) {
        setError(res.message || "Request failed");
      }

      return res;
    } catch (err) {
      setError(err?.message || "Unexpected error");
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  return { execute, apiLoading, error };
}

