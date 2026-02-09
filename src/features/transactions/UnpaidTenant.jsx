import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import Table from '../../components/ui/Table';
import { getColumns } from "./UnpaidTenantColumn";
import { getData } from '../../helpers/getData';
import { transactionService } from './transactionService';
import { useApiRequest } from '../../hooks/useApiRequest';


const UnpaidTenant = () => {
  const { execute, apiLoading } = useApiRequest(); 
  const [balances, setBalances] = useState([]);
  const [tableLoader, isTableLoader] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      unPaidTenants();
    }, []);

    const unPaidTenants = async () => {
        await getData({
        execute,
        request: () => transactionService.unPaidTenants(),
        setData: setBalances,
        setLoading: isTableLoader,
        });
    };


  const columns = getColumns();

  
  return (
    <>
    <BreadCrumb  greetings="" />
    <section id="Section">
      <div className="header">
          <h3>List of all Balances</h3>
        </div>

      <div className="TableContainer">
          <Table data={balances} columns={columns} loading={tableLoader}  error={error}/>
        </div>

    </section>
  </>
  )
}

export default UnpaidTenant;