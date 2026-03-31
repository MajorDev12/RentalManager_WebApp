import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./VacantColumns";
import { getData } from '../../helpers/getData';
import { unitService } from "./unitService";
import { useApiRequest } from '../../hooks/useApiRequest';


const Vacants = () => {
  const { execute, apiLoading } = useApiRequest();  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);

  const tableData = useMemo(() => units ?? [], [units]);



  useEffect(() => {
    fetchUnits();

  }, []);


  
  const fetchUnits = async () => {
      await getData({
      execute,
      request: () => unitService.getVacants(),
      setData: setUnits,
      setLoading: setLoading,
      setError: setError
      });
  };





  const columns = getColumns();






  return (
    <>
    <BreadCrumb  greetings="" />
    <div id="Section">
      <div className="header">
          <h3>List of all Houses</h3>
          <PrimaryButton
            name="Add New"
            onClick={() => setShowModal(true) }
          />
        </div>

      <div className="TableContainer">
          <Table data={tableData} columns={columns} loading={loading}  error={error}/>
        </div>

    </div>
  </>
  )
}

export default Vacants