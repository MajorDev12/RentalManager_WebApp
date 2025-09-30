import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Table from '../components/Table';
import { getColumns } from "../columns/InvoiceColumn";
import { getData } from '../helpers/getData';


const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(null);
    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [showModal, setShowModal] = useState(null);

    useEffect(() => {
      getData({
          endpoint: 'Invoice',
          setData: setInvoices,
          setLoading,
          setError
      });

    }, []);


    const columns = getColumns({
        endpoint: "Invoice",
        activeRow,
        setActiveRow,
        setSelectedId,
        setIsEditMode,
        setDeleteModalOpen,
        setFormData,
        setOriginalData,
        setShowModal,
        invoices,
    });


  return (
    <>
        <BreadCrumb  greetings="" />
        <section id="Section">
        <div className="header">
            <h3>List of all Invoices</h3>
            </div>

        <div className="TableContainer">
            <Table data={invoices} columns={columns} loading={loading}  error={error}/>
            </div>

        </section>
    </>
  )
}

export default Invoice;