import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./UnitChargeColumn";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { getData } from '../../helpers/getData';
import { handleDelete } from '../../helpers/deleteData';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { propertyService } from "../properties/propertyService";
import { utilityService } from "./utilityService";
import { useApiRequest } from '../../hooks/useApiRequest';


const UnitCharge = () => {
  const { execute, apiLoading } = useApiRequest();
    const [activeRow, setActiveRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [charges, setCharges] = useState([]);
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
    const [propertiesLoader, isPropertiesLoader] = useState(true);
    const EMPTY_FORM = {
      propertyId: '',
      name: '',
      amount: '',
      isReccurring: false
    }
    const [formData, setFormData] = useState(EMPTY_FORM);

    const tableData = useMemo(() => charges ?? [], [charges]);


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
      setFormData(EMPTY_FORM);
      setShowModal(false);
    };



    useEffect(() => {
      fetchUtilities();
      fetchProperties();
    }, []);


    const fetchProperties = async () => {
      await getData({
      execute,
      request: () => propertyService.getAll(),
      setData: setProperties,
      setLoading: isPropertiesLoader,
      });
    };
    
    const fetchUtilities = async () => {
        await getData({
        execute,
        request: () => utilityService.getAll(),
        setData: setCharges,
        setLoading,
        });
    };




    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };




    const refreshTableData = () =>{
      fetchUtilities();
      handleCloseModal();
    }




    const validateModalForm = () => {
        const { name, amount, propertyId, isReccurring} = formData;
        if (!name || !amount || !propertyId) {
          return "Please fill in all required fields.";
        }
        if(!validateTextInput(name, true)){
          return "Charge Name cannot be empty";
        }
        if(amount == isNaN){
          return "Please enter a Amount";
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


    const addUtilityHandler = async (e) => {

      await handleFormSubmit({
        e,
        validateForm: validateModalForm,
        execute,
        request: () => utilityService.add(formData),
        setFormError,
        setLoadingBtn,
        resetForm: () => setFormData(EMPTY_FORM),
        onSuccess: () => refreshTableData(),
      });
    };


    const updateUtilityHandler = async (e) => {

      await handleFormSubmit({
        e,
        validateForm: validateModalForm,
        execute,
        request: () => utilityService.update(selectedId, formData),
        setFormError,
        setLoadingBtn,
        resetForm: () => setFormData(EMPTY_FORM),
        onSuccess: () => refreshTableData(),
      });
    };

    const handleEdit = (rowId) => {
      const item = charges.find(p => p.id === rowId);
      if (!item) return;
      
      setFormData(item);
      setSelectedId(item.id);
      setOriginalData(item);
      setIsEditMode(true);
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


  return (
    <>
    <BreadCrumb />
    <div id="Section">
      <div className="header">
          <h3>List of all Unit Charges</h3>
          <PrimaryButton
            name="Add New"
            onClick={() => setShowModal(true) }
          />
        </div>

      <div className="TableContainer">
          <Table data={tableData} columns={columns} loading={loading}  error={error}/>
        </div>


        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Property"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'UtilityBill',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setCharges,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />





      <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={isEditMode ? updateUtilityHandler : addUtilityHandler}
          errorMessage={formError}
          title={isEditMode ? "Update Charge" : "Add Charge"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ''}
            onChange={handleSelect}
            options={
              propertiesLoader
                ? [{ value: '', label: 'Loading properties...' }]
                : error
                ? [{ value: '', label: 'Error loading properties' }]
                : !properties || properties.length === 0
                ? [{ value: '', label: 'No properties found' }]
                : properties.map(p => ({
                    value: p.id,
                    label: p.name
                  }))
            }
          />

          <Input
            type="text"
            name="name"
            placeholder="Enter Charge Name"
            value={formData.name || ''}
            labelName="Charge Name"
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="amount"
            placeholder="Enter Charge Amount"
            value={formData.amount || ''}
            labelName="Amount"
            onChange={handleInputChange}
          />
        </Modal>
    </div>
  </>
  )
}

export default UnitCharge