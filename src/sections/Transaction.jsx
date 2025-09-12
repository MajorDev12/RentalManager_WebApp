import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/transactionColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Select from '../components/Select';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';


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
    const [originalData, setOriginalData] = useState(null);
    const [formError, setFormError] = useState('');
    const [select, setSelect] = useState('');
    const [properties, setProperties] = useState([]);
    const [propertySet, isPropertySet] = useState(false);
    const [unitTypes, setUnitTypes] = useState([]);
    const [unitStatus, setUnitStatus] = useState([]);
    const [formData, setFormData] = useState({
        propertyId: '',
        name: '',
        unitTypeId: '',
        unitType: '',
        amount: 0
    });


    const handleSelect = (e) => {
    const { name, value } = e.target;
        setSelect(value);
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };
    



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



    const handleInputChange = (field, value) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
    };









    const validateForm = () => {
    const { name, unitTypeId, propertyId, amount} = formData;
    if (!name || !unitTypeId || !amount || !propertyId) {
        return "Please fill in all required fields.";
    }
    if(!validateTextInput(name, true)){
        return "Unit Name cannot be empty";
    }
    if(amount == isNaN){
        return "Please enter a valid Amount";
    }
    return '';
    };




const handleFormSubmit = (e) => {
        addData({
    e,
    validateForm,
    formData,
    endpoint: 'Unit',
    setFormError,
    setLoadingBtn,
    setFormData,
    setShowModal,
    setData: setCharges,
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
        endpoint: 'Unit',
        setFormError,
        setLoadingBtn,
        setFormData,
        setShowModal,
        setIsEditMode,
        setData: setCharges,
        setLoading,
    });
    };









    return(
        <>
            <BreadCrumb  greetings="" />
            <section id="section">
                <div className="header">
                    <h3>All Transactions</h3>
                    <PrimaryButton
                        name="Add New"
                        onClick={() => setShowModal(true) }
                    />
                </div>

                <div className="TableContainer">
                    <Table data={transactions} columns={columns} loading={loading}  error={error}/>
                </div>


            </section>
        </>
    )
}



export default Transaction;