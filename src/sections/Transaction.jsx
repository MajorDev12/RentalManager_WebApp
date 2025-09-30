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



const Transaction = () => {
    const [activeRow, setActiveRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
    const [formData, setFormData] = useState({
      propertyId: 0,
      userId: 0,
      unitId: 0,
      amount: 0,
      transactionTypeId: 0,
      transactionCategoryId: 0,
      monthFor: 0,
      yearFor: 0,
      paymentMethodId: 0,
      notes: ''
    });

    const years = [];
    for (let year = 2020; year <= 2030; year++) {
        years.push({ value: year, label: year.toString() });
    }


   const handleSelect = (e) => {
    const { name, value } = e.target;
      setSelect(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
 

    const handleBulkCloseModal = () => {
      setFormError('');
      setIsEditMode(false);
      setFormData({});
      setShowBulkModal(false);
    }


    const handleCloseModal = () => {
      setFormError('');
      setIsEditMode(false);
      setFormData({});
      setShowModal(false);
    };



    useEffect(() => {
      getData({
          endpoint: 'Transaction',
          setData: setTransactions,
          setLoading,
          setError
      });


      getData({
          endpoint: 'Tenant',
          setData: setTenants,
          setLoading,
          setError
      });

      getData({
          endpoint: 'SystemCodeItem/BY-NAME/TRANSACTIONTYPE',
          setData: setTransactionTypes,
          setLoading,
          setError
      });

      getData({
          endpoint: 'SystemCodeItem/BY-NAME/TRANSACTIONCATEGORY',
          setData: setTransactionCategories,
          setLoading,
          setError
      });

      getData({
          endpoint: 'SystemCodeItem/BY-NAME/PAYMENTMETHOD',
          setData: setPaymentMethods,
          setLoading,
          setError
      });

    }, []);


    useEffect(() => {
      if (!formData.propertyId || formData.propertyId <= 0) {
          setUnits([]);
          return;
      }

      getData({
          endpoint: `Unit/By-Property/${formData.propertyId}`,
          setData: setUnits,
          setLoading,
          setError
      });

    }, [formData.propertyId]);




    useEffect(() => {
      if(formData.userId){

        var tenant = tenants.find(u => u.user.id == formData.userId);

        getData({
            endpoint: `Properties/${tenant.user.propertyId}`,
            setData: setProperty,
            setLoading,
            setError
        });

        getData({
          endpoint: `Unit/${tenant.unitId}`,
          setData: setUnits,
          setLoading,
          setError
        });


      }else{
        getData({
            endpoint: `Properties`,
            setData: setProperties,
            setLoading,
            setError
        });

      }

    }, [formData.userId]);



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



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };





  const validateForm = () => {
      const { propertyId, unitId, amount, transactionCategoryId, transactionTypeId, paymentMethodId, monthFor, yearFor, notes } = formData;
      if (!propertyId || !amount || !transactionCategoryId || !transactionTypeId || !monthFor || !yearFor) {
        return "Please fill in all required fields.";
      }
      if(!validateTextInput(notes, true)){
        return "Notes cannot be empty";
      }

      if(isNaN(amount)){
        return "Enter a valid amount";
      }

      if(isNaN(propertyId) || isNaN(unitId) || isNaN(transactionCategoryId) || isNaN(transactionTypeId) || isNaN(paymentMethodId) || isNaN(monthFor) || isNaN(yearFor)){
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
    setFormData,
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
            <PrimaryButton
              name="Add Rent"
              onClick={() => setShowModal(true) }
            />
          <PrimaryButton
              name="Add Bulk"
              onClick={() => setShowBulkModal(true) }
            />
            <PrimaryButton
              name="Add Utility"
              onClick={() => setShowBulkModal(true) }
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




      {/* BULK MODAL */}
      <Modal
        isOpen={showBulkModal}
        onClose={handleBulkCloseModal}
        onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
        errorMessage={formError}
        title={isEditMode ? "Update Bulk" : "Add Bulk"}
        loadingBtn={loadingBtn}
        isEditMode={isEditMode}
      >
        <Select
          name="userId"
          labelName="Tenant"
          value={formData.userId || ''}
          onChange={handleSelect}
          options={tenants.map(t => ({ value: t.user.id, label: t.fullName }))}
        />
      </Modal>



      <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
          errorMessage={formError}
          title={isEditMode ? "Update Transaction" : "Add Transaction"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="userId"
            labelName="Tenant"
            value={formData.userId || ''}
            onChange={handleSelect}
            options={tenants.map(t => ({ value: t.user.id, label: t.fullName }))}
          />

          <Select
            name="propertyId"
            labelName="Property Name"
            value={property.id || formData.propertyId || ''}
            disabled={formData.userId}
            onChange={handleSelect}
            options={
              properties && properties.length > 0
              ? properties.map(p => ({ value: p.id, label: p.name }))
              : [{ value: '', label: 'No Available Units', disabled: true }]
            }
          />
          <Select
            name="unitId"
            labelName="Unit"
            value={formData.unitId || ''}
            onChange={handleSelect}
            options={
              units && units.length > 1
                ? units.map(p => ({ value: p.id, label: p.name }))
                : units && units.length == 1
                ? { value: units.id, label: units.name, disabled: true }
                : [{ value: '', label: 'No Available Units', disabled: true }]
            }
            text={formData.propertyId ? "Select Unit" : "Choose Property First"}
          />

          <Input
            type="text"
            name="amount"
            placeholder="Enter Amount"
            value={formData.amount || ''}
            labelName="Amount Paid"
            onChange={handleInputChange}
          />
          <Select
            name="transactionTypeId"
            labelName="Type"
            value={formData.transactionTypeId || ''}
            onChange={handleSelect}
            options={
              transactionTypes && transactionTypes.length > 0
                ? transactionTypes.map(p => ({ value: p.id, label: p.item }))
                : [{ value: '', label: 'No Available transaction types', disabled: true }]
            }
          />
          <Select
            name="transactionCategoryId"
            labelName="Category"
            value={formData.transactionCategoryId || ''}
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
            value={formData.monthFor || ''}
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
            value={formData.yearFor || ''}
            onChange={handleSelect}
            options={
              years && years.length > 0
                ? years.map(y => ({ value: y.value, label: y.label }))
                : [{ value: '', label: 'No Available Years', disabled: true }]
            }
          />
          <Select
            name="paymentMethodId"
            labelName="Payment Method"
            value={formData.paymentMethodId || ''}
            onChange={handleSelect}
            options={
              paymentMethods && paymentMethods.length > 0
                ? paymentMethods.map(pm => ({ value: pm.id, label: pm.item }))
                : [{ value: '', label: 'No Available Payment Methods', disabled: true }]
            }
          />
          <TextArea
            name="notes"
            labelName="Notes"
            placeholder="Enter a description"
            value={formData.notes || ''}
            onChange={handleInputChange}
          />
          </Modal>
          
    </section>
  </>
  )
}

export default Transaction