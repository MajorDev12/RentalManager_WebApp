import { toast } from "react-toastify";

export const handleDelete = async ({
  e,
  execute,
  request,
  setLoadingBtn,
  setDeleteModalOpen,
  onSuccess,
}) => {
  e.preventDefault();

  setLoadingBtn?.(true);

  try {
    const res = await execute(request);

    if (!res?.success) {
      toast.error(res?.message || "Delete failed");
      return;
    }

    toast.success(res?.message || "Deleted successfully");

    onSuccess?.();
  } catch (error) {
    console.error(error);

    toast.error(error?.message || "Unexpected error occurred");
  } finally {
    setLoadingBtn?.(false);
    setDeleteModalOpen?.(false);
  }
};
