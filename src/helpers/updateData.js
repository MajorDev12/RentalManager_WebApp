import { fetchData } from './fetchData';
import { toast } from 'react-toastify';
import { getData } from './getData';

export const updateData = async ({
  e,
  validateForm,
  formData,
  originalData,
  endpoint,
  setFormError,
  setLoadingBtn,
  setFormData,
  setShowModal,
  setIsEditMode,
  setData,
  setLoading,
}) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    setFormError(validationError);
    setTimeout(() => setFormError(''), 3000);
    return;
  }

  const isSame = JSON.stringify(formData) === JSON.stringify(originalData);
  if (isSame) {
    setFormError("No changes detected.");
    setTimeout(() => setFormError(''), 3000);
    return;
  }

  setLoadingBtn(true);

  try {
    const response = await fetchData(`${endpoint}/${formData.id}`, 'PUT', formData);

    if (response.success) {
      toast.success(response.message || "Successfully updated.");
      setFormError('');
      setFormData({});
      setShowModal(false);
      setIsEditMode(false);

      // Refresh data
      getData({
        endpoint,
        setData,
        setLoading,
      });
    } else {
      setFormError(response.message || "Failed to update data.");
      toast.error(response.message || "Update failed.");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while updating.");
  } finally {
    setLoadingBtn(false);
    if (setLoading) setLoading(false);
  }
};
