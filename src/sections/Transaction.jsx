import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/transactionColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import TextArea from '../components/Textarea';
import Select from '../components/Select';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';
import { months } from '../includes/months';
import { years } from '../includes/years';



const Transaction = () => {
    const [activeRow, setActiveRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentBulkModal, setshowPaymentBulkModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [formError, setFormError] = useState('');
    const [select, setSelect] = useState('');
    const [property, setProperty] = useState([]);
    const [properties, setProperties] = useState([]);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [transactionCategories, setTransactionCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [invoiceFormData, setInvoiceFormData] = useState({
      propertyId: 0,
      userId: 0,
      utilityBillId: 0,
      monthFor: 0,
      yearFor: 0,
      notes: ''
    });


    const [actionOptions, setActionOptions] = useState({
      bulkRentInvoice: '',
      bulkPayment: '',
      bulkReccuringUtilities: '',
      monthFor: '',
      yearFor: '',
      notes: ''
    });



   const handleSelect = (e) => {
    const { name, value } = e.target;
      setSelect(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };


    const handleSelectOptions = (e) => {
      const { name, value } = e.target;
        setSelect(value);
        setInvoiceFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setShowBulkModal(true);
    };
 


    const handleCloseModal = () => {
      setFormError('');
      setIsEditMode(false);
      setInvoiceFormData({});
      setShowBulkModal(false);
    };



    useEffect(() => {
      getData({
          endpoint: 'Transaction',
          setData: setTransactions,
          setLoading,
          setError
      });
    }, []);


    useEffect(() => {
      if (!invoiceFormData.propertyId || invoiceFormData.propertyId <= 0) {
          setTenants([]);
          return;
      }

      getData({
          endpoint: `Tenants/ByProperty/${invoiceFormData.propertyId}`,
          setData: setTenants,
          setLoading,
          setError
      });

    }, [invoiceFormData.propertyId]);



    useEffect(() => {
      if (actionOptions.bulkRentInvoice) {
        getData({
          endpoint: `Properties`,
          setData: setProperties,
          setLoading,
          setError
        });
        return;
      }

      setProperties([]);

    }, [actionOptions]);

    




  const columns = getColumns({
    endpoint: "Transaction",
    activeRow,
    setActiveRow,
    setSelectedId,
    setIsEditMode,
    setDeleteModalOpen,
    setInvoiceFormData,
    setOriginalData,
    setShowModal,
    transactions,
  });



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };





  const validateForm = () => {
      const { propertyId, monthFor, yearFor, notes } = invoiceFormData;
      if (!propertyId || !monthFor || !yearFor) {
        return "Please fill in all required fields.";
      }
      if(!validateTextInput(notes, true)){
        return "Notes cannot be empty";
      }

      if(isNaN(propertyId) || isNaN(monthFor) || isNaN(yearFor)){
        return "Please enter valid values";
      }
      return '';
    };




const handleFormSubmit = (e) => {
     addData({
    e,
    validateForm,
    formData,
    endpoint: 'Transaction',
    setFormError,
    setLoadingBtn,
    setShowModal,
    setData: setTransactions,
    getdata: true,
    setLoading,
  });
  };



  const handleUpdateSubmit = (e) => {
    updateData({
      e,
      validateForm,
      formData,
      originalData,
      endpoint: 'Transaction',
      setFormError,
      setLoadingBtn,
      setFormData,
      setShowModal,
      setIsEditMode,
      setData: setTransactions,
      setLoading,
    });
  };



  return (
    <>
    <BreadCrumb  greetings="" />
    <section id="Section">
      <div className="header">
          <h3>List of all Transactions</h3>
          <div className="row">
            <Select
              name="propertyId"
              value={invoiceFormData.propertyId || ''}
              disabled={invoiceFormData.userId}
              onChange={handleSelectOptions}
              options={[
                { value: "addBulkInvoice", label: "Add Bulk Invoice" },
                { value: "addRecurringUtilities", label: "Add Recurring Utilities" },
                { value: "addExpense", label: "Add Expense" },
              ]}
              text='-- Actions --'
            />
          </div>
        </div>

      <div className="TableContainer">
          <Table data={transactions} columns={columns} loading={loading}  error={error}/>
        </div>


        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Unit"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Transaction',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setTransactions,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />




      {/* ADD BULK INVOICE MODAL */}
      <Modal
        isOpen={showBulkModal}
        onClose={handleCloseModal}
        onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
        errorMessage={formError}
        title={isEditMode ? "Update Invoice" : "Add Invoice"}
        loadingBtn={loadingBtn}
        isEditMode={isEditMode}
      >
        <Select
          name="propertyId"
          labelName="Property Name"
          value={invoiceFormData.propertyId || ''}
          disabled={invoiceFormData.userId}
          onChange={handleSelect}
          options={
            properties && properties.length > 0
            ? properties.map(p => ({ value: p.id, label: p.name }))
            : [{ value: '', label: 'No Available Properties', disabled: true }]
          }
        />
        <Select
          name="utilityBillId"
          labelName="Utillity Type"
          value={invoiceFormData.utilityBillId || ''}
          onChange={handleSelect}
          options={
            transactionCategories && transactionCategories.length > 0
              ? transactionCategories.map(p => ({ value: p.id, label: p.item }))
              : [{ value: '', label: 'No Available transaction categories', disabled: true }]
          }
        />
        <Select
            name="monthFor"
            labelName="Month For"
            value={invoiceFormData.monthFor || ''}
            onChange={handleSelect}
            options={
              months && months.length > 0
                ? months.map(m => ({ value: m.id, label: m.name }))
                : [{ value: '', label: 'No Available Months', disabled: true }]
            }
          />
          <Select
            name="yearFor"
            labelName="Year For"
            value={invoiceFormData.yearFor || ''}
            onChange={handleSelect}
            options={
              years && years.length > 0
                ? years.map(y => ({ value: y.value, label: y.name }))
                : [{ value: '', label: 'No Available Years', disabled: true }]
            }
          />
      </Modal>




          
    </section>
  </>
  )
}

export default Transaction