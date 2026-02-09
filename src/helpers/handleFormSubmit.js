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

  // 1️⃣ Validate
  const error = validateForm();
  if (error) {
    setFormError?.(error);
    setTimeout(() => setFormError(""), 4000);
    return;
  }

  setFormError?.("");
  setLoadingBtn?.(true);

  try {
    const res = await execute({ request });

    if (!res?.success) {
      const message =  res?.message || "Request failed";

      toast.error(message);
      return;
    }

    // 3️⃣ Success
    toast.success(res.message || "Success");

    resetForm?.();
    onSuccess?.(res.data);

  } catch (err) {
    console.error(err);
    toast.error(err.message || "Network error");
  } finally {
    setLoadingBtn?.(false);
  }
};

