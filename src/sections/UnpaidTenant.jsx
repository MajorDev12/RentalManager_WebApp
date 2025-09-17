import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Table from '../components/Table';
import { getColumns } from "../columns/UnpaidTenantColumn";
import { getData } from '../helpers/getData';


const UnpaidTenant = () => {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      getData({
          endpoint: 'Transaction/UnpaidTenants',
          setData: setBalances,
          setLoading,
          setError
      });

    }, []);


  const columns = getColumns();

  return (
    <>
    <BreadCrumb  greetings="" />
    <section id="Section">
      <div className="header">
          <h3>List of all Balances</h3>
        </div>

      <div className="TableContainer">
          <Table data={balances} columns={columns} loading={loading}  error={error}/>
        </div>

    </section>
  </>
  )
}

export default UnpaidTenant;