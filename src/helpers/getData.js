export const getData = async ({
  execute,
  request,
  setData,
  setLoading,
  setError,
}) => {
  try {
    const res = await execute(request);

    if (!res) return;

    // RAW ARRAY RESPONSE
    if (Array.isArray(res)) {
      setData(res);
      setError?.(false);
      return;
    }

    // WRAPPED API RESPONSE
    if (res.success) {
      let data;

      // ARRAY
      if (Array.isArray(res.data)) {
        data = res.data;
      }

      // PAGINATED
      else if (Array.isArray(res.data?.items)) {
        data = res.data.items;
      }

      // NORMAL OBJECT
      else {
        data = res.data;
      }

      setData(data);
      setError?.(false);
    } else {
      setError?.(true);
    }
  } catch (error) {
    console.error("getData error:", error);
    setError?.(true);
  } finally {
    setLoading?.(false);
  }
};
