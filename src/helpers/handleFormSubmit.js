import { toast } from "react-toastify";

export const handleFormSubmit = async ({
  e,
  validateForm,
  execute,
  request,          // () => apiCall(payload)
  onSuccess,
  setFormError,
  setLoadingBtn,
  resetForm,
}) => {
  e.preventDefault();

   // 🔒 1. Validate
  const error = validateForm();
  if (error) {
    setFormError?.(error);
    setTimeout(() => setFormError(""), 4000);
    return;
  }

  setFormError?.("");
  setLoadingBtn?.(true);


  try {
    const res = await execute({
      request,
    });

    if (!res) return; // execute already handled errors

    toast.success(res.message || "Success");

    resetForm?.();
    onSuccess?.(res.data);

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setLoadingBtn?.(false);
  }
};
