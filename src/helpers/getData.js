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

    if (res.success) {
      const data = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);

      setData(data);
    } else {
      setError(true);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading?.(false);
  }
};
