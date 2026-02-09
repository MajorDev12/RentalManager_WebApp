import { toast } from "react-toastify";

export const showApiError = (res) =>
  toast.error(res?.errors?.[0] || res?.message || "Error");
