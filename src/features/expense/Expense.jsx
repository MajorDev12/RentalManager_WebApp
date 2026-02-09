import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./ExpenseColumn";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import CheckBox from '../../components/ui/CheckBox';
import Textarea from '../../components/ui/Textarea';
import { getData } from '../../helpers/getData';
import { addData } from '../../helpers/addData';
import { updateData } from '../../helpers/updateData';
import { handleDelete } from '../../helpers/deleteData';
import { propertyService } from "../properties/propertyService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { expenseService } from "./expenseService";
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { useApiRequest } from '../../hooks/useApiRequest';


const Expense = () => {
  const { execute, apiLoading } = useApiRequest(); 
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [tableloading, setTableLoading] = useState(true);
  const [propertyLoader, isPropertiesLoader] = useState(true);
  const [expenseCategoryLoader, setExpenseCategoryLoader] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [select, setSelect] = useState('');
  const [isEditMode, setIsEditMode] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [formError, setFormError] = useState('');
  const EMPTYEXPENSE_FORM = {
    name: '',
    amount: 0,
    notes: '',
    propertyId: 0,
    expenseCategoryId: 0
  }
  const [formData, setFormData] = useState(EMPTYEXPENSE_FORM);

  useEffect(() => {
    fetchExpenses();
  }, []);


  useEffect(() => {
    if(showModal){
      fetchProperties();
      fetchExpenseCategories();
    }

  }, [showModal]);


  const fetchProperties = async () => {
    await getData({
    execute,
    request: () => propertyService.getAll(),
    setData: setProperties,
    setLoading: isPropertiesLoader,
    });
  };

  const fetchExpenses = async () => {
    await getData({
    execute,
    request: () => expenseService.getAll(),
    setData: setExpenses,
    setLoading: setTableLoading,
    });
  };

  const fetchExpenseCategories = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getExpenseCategories(),
    setData: setExpenseCategories,
    setLoading: setExpenseCategoryLoader,
    });
  };

  const refreshTableData = () =>{
    fetchExpenses();
    handleCloseModal();
  }


  const handleEdit = (rowId) => {
    const item = expenses.find(p => p.id === rowId);
    if (!item) return;
    setIsEditMode(true);
    setFormData(item);
    setOriginalData(item);
    setShowModal(true);
    setActiveRow(null);
  };

  const handleDeleteClick = (rowId) => {
    setSelectedId(rowId);
    setDeleteModalOpen(true);
    setActiveRow(null);
  };

  const columns = useMemo(() => 
    getColumns({
      activeRow,
      setActiveRow,
      onEdit: handleEdit,
      onDelete: handleDeleteClick,
    }),
  [ activeRow ]);



  const handleCloseModal = () => {
    setFormError('');
    setIsEditMode(false);
    setFormData(EMPTYEXPENSE_FORM);
    setShowModal(false);
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSelect(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
  };



    
  const validateModalForm = () => {
    const { name, amount, propertyId, expenseCategoryId, notes} = formData;
    if (!name || !amount || !propertyId || !expenseCategoryId) {
      return "Please fill in all required fields.";
    }

    if (isNaN(amount)) {
      return "amount must be a number";
    }

    if(originalData != null && isEditMode){
      return validateChange(originalData, formData);
    }

    return '';
  };
    

  const validateChange = (originalData, updatedData) => {
    const isSame = JSON.stringify(updatedData) === JSON.stringify(originalData);
    if (isSame) return "No Changes Made";
    return '';
  };
    
    
    
  const addExpenseHandler = async (e) => {

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => expenseService.add(formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTYEXPENSE_FORM),
      onSuccess: () => refreshTableData(),
    });
  };
  
  
  
  const handleUpdateSubmit = async (e) => {

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => expenseService.update(originalData.id, formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTYEXPENSE_FORM),
      onSuccess: () => refreshTableData(),
    });
  };
  

  const propertyOptions = (() => {
    if (propertyLoader) {
      return [{ value: '', label: 'Loading...', disabled: true }];
    }

    if (!Array.isArray(properties) || properties.length === 0) {
      return [{ value: '', label: 'No Available Properties', disabled: true }];
    }

    return properties.map(p => ({
      value: p.id,
      label: p.name
    }));
  })();



  return (
    <>
      <BreadCrumb  greetings="" />
      <section id="Section">
        <div className="header">
          <h3>List of all Expenses</h3>
          <PrimaryButton
            name="Add New"
            onClick={() => setShowModal(true) }
          />
        </div>

        <div className="TableContainer">
          <Table data={expenses} columns={columns} loading={tableloading}  error={error}/>
        </div>


        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Expense"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Expense',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setExpenses,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />

        
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={isEditMode ? handleUpdateSubmit : addExpenseHandler}
          errorMessage={formError}
          title={isEditMode ? "Update Expense" : "Add Expense"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ''}
            onChange={handleSelect}
            options={propertyOptions}
          />

          <Select
            name="expenseCategoryId"
            labelName="Category"
            value={formData.expenseCategoryId || ''}
            onChange={handleSelect}
            options={expenseCategories.map(p => ({ value: p.id, label: p.item }))}
          />
          <Input
            type="text"
            name="name"
            placeholder="Enter Expense Name"
            value={formData.name || ''}
            labelName="Expense Name"
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="amount"
            placeholder="Enter Expense Amount"
            value={formData.amount || ''}
            labelName="Expense Amount"
            onChange={handleInputChange}
          />
          <Textarea
            type="text"
            name="notes"
            placeholder="Enter description"
            value={formData.notes || ''}
            labelName="Notes"
            onChange={handleInputChange}
          />

          <CheckBox
            name="notes"
            labelName="Reccurring"
            onChange={handleInputChange}
            value={formData.notes || ''}
          />

        </Modal>

      </section>
    </>
  )
}

export default Expense;