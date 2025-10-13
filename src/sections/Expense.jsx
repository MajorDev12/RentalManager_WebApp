import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/ExpenseColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';


const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      amount: 0,
      notes: ''
    });

    useEffect(() => {
      getData({
          endpoint: 'Expense',
          setData: setExpenses,
          setLoading,
          setError
      });

    }, []);


    const columns = getColumns({
        endpoint: "Expense",
        activeRow,
        setActiveRow,
        setSelectedId,
        setIsEditMode,
        setDeleteModalOpen,
        setFormData,
        setOriginalData,
        setShowModal,
        expenses,
    });



    const handleCloseModal = () => {
      setFormError('');
      setIsEditMode(false);
      setFormData({});
      setShowModal(false);
    };


    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };




    
     const validateForm = () => {
        const { name, amount, notes} = formData;
        if (!name || !amount) {
          return "Please fill in all required fields.";
        }
        return '';
      };
    
    
    
    
    const handleFormSubmit = (e) => {
      addData({
        e,
        validateForm,
        formData,
        endpoint: 'Expense',
        setFormError,
        setLoadingBtn,
        setFormData,
        setShowModal,
        setData: setExpenses,
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
        endpoint: 'Expense',
        setFormError,
        setLoadingBtn,
        setFormData,
        setShowModal,
        setIsEditMode,
        setData: setExpenses,
        setLoading,
      });
    };
    




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
          <Table data={expenses} columns={columns} loading={loading}  error={error}/>
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
            onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
            errorMessage={formError}
            title={isEditMode ? "Update Expense" : "Add Expense"}
            loadingBtn={loadingBtn}
            isEditMode={isEditMode}
          >
            <Input
              type="text"
              name="name"
              placeholder="Enter Expense Name"
              value={formData.name || ''}
              labelName="Expense Name"
              onChange={handleInputChange}
            />
            <Input
              type="text"
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
  
            </Modal>

      </section>
    </>
  )
}

export default Expense;