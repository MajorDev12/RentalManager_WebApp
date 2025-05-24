import { fetchData } from '../helpers/fetchData'; 
import { toast } from 'react-toastify';

export const getData = async ({
  endpoint,
  setData,
  setLoading,
  setError
}) => {
  try {
    const response = await fetchData(endpoint, 'GET');
    if (response.success){
        setData(response.data);
    }
    else{
        setError(true);
        //log error
    }
  } catch (error) {
    //log error
    setError(true);
  } finally {
    if (setLoading) setLoading(false);
  }
};
