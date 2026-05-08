import { toast } from "react-toastify";

export const handleFormSubmit = async ({
  e,
  validateForm,
  execute,
  request,
  onSuccess,
  setFormError,
  setLoadingBtn,
  resetForm,
}) => {
  e.preventDefault();

  // Validate form
  const error = validateForm?.();

  if (error) {
    setFormError?.(error);

    setTimeout(() => {
      setFormError?.("");
    }, 4000);

    return;
  }

  setFormError?.("");
  setLoadingBtn?.(true);

  try {
    // ✅ Updated execute usage
    const res = await execute(request);

    if (!res?.success) {
      const message = res?.message || "Request failed";

      setFormError?.(message);
      toast.error(message);

      return;
    }

    // Success
    toast.success(res?.message || "Success");

    resetForm?.();

    onSuccess?.(res?.data);
  } catch (err) {
    console.error(err);

    const message = err?.message || "Network error";

    setFormError?.(message);
    toast.error(message);
  } finally {
    setLoadingBtn?.(false);
  }
};
