import { fetchData } from '../helpers/fetchData';
import { getData } from '../helpers/getData';
import { toast } from 'react-toastify';

export const addData = async ({
  e,
  validateForm,
  formData,
  endpoint,
  setFormError,
  setLoadingBtn,
  setFormData,
  setShowModal,
  setData,
  setLoading,
}) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    setFormError(validationError);
    setTimeout(() => setFormError(''), 4000);
    return;
  }

  setLoadingBtn(true);

  try {
    const response = await fetchData(endpoint, 'POST', formData);

    if (response.success) {
      toast.success(response.message || 'Successfully submitted!');
      setFormError('');
      setFormData({});
      setShowModal(false);
    } else {
        setFormError('Failed to submit data.');
        toast.error(response.message || 'Failed to submit data.');
        return;
    }

    // Refresh data after successful add
    getData({
        endpoint: endpoint,
        setData,
        setLoading
      });

  } catch (error) {
    console.error(error);
    toast.error('An error occurred while submitting.');
  } finally {
    setLoadingBtn(false);
    if (setLoading) setLoading(false);
  }
};
