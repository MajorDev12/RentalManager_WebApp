import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Table from '../components/Table';
import { getColumns } from "../columns/InvoiceColumn";
import { getData } from '../helpers/getData';


const Invoice = () => {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(null);
    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
      getData({
          endpoint: 'Invoices',
          setData: setBalances,
          setLoading,
          setError
      });

    }, []);


    const columns = getColumns({
        endpoint: "Transaction",
        activeRow,
        setActiveRow,
        setSelectedId,
        setIsEditMode,
        setDeleteModalOpen,
        setFormData,
        setOriginalData,
        setShowModal,
        transactions,
    });


  return (
    <>
        <BreadCrumb  greetings="" />
        <section id="Section">
        <div className="header">
            <h3>List of all Invoices</h3>
            </div>

        <div className="TableContainer">
            <Table data={balances} columns={columns} loading={loading}  error={error}/>
            </div>

        </section>
    </>
  )
}

export default Invoice;