import { useState } from "react";
import { toast } from "react-toastify";

export function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async ({
    request,
    onSuccess,
    onError,
    successMessage,
    errorMessage,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await request();

      if (!res?.success) {
        const msg = res?.message || errorMessage || "Request failed";
        setError(msg);
        toast.error(msg);
        onError?.(res);
        return null;
      }

      if (successMessage) toast.success(successMessage);
      onSuccess?.(res);

      return res;
    } catch (err) {
      const msg = err?.message || "Unexpected error";
      setError(msg);
      toast.error(msg);
      onError?.(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
