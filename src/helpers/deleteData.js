import { fetchData } from './fetchData';
import { toast } from 'react-toastify';
import { getData } from './getData';

export const handleDelete = async ({
  e,
  id,
  endpoint,
  setLoadingBtn,
  setDeleteModalOpen,
  setData,
  setLoading,
}) => {
  e.preventDefault();
  setLoadingBtn(true);

  try {
    const response = await fetchData(`${endpoint}/${id}`, 'DELETE');

    if (response.success) {
      toast.success(response.message || 'Item deleted successfully');
      getData({
        endpoint,
        setData,
        setLoading,
      });
    } else {
      toast.error(response.message || 'Failed to delete item');
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while deleting');
  } finally {
    setLoadingBtn(false);
    setDeleteModalOpen(false);
  }
};
