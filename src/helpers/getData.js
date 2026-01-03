
export const getData = async ({
  endpoint,
  setData,
  setLoading,
  setError
}) => {
  try {
    const response = await fetchData(endpoint, 'GET', formData);

    if (response.success) {
      setData(response.data);
    } else {
      setError(true);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading?.(false);
  }
};
