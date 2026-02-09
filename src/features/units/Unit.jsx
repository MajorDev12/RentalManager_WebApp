import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./UnitColumns";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { getData } from '../../helpers/getData';
import { handleDelete } from '../../helpers/deleteData';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { propertyService } from "../properties/propertyService";
import { unitTypeService } from "../unitTypes/unitTypeService";
import { unitService } from "./unitService";
import { useApiRequest } from '../../hooks/useApiRequest';


const Unit = () => {
  const { execute, apiLoading } = useApiRequest();  
  const [activeRow, setActiveRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedPropertyId, setPropertySelectedId] = useState(null);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState('');
  const [properties, setProperties] = useState([]);
  const [propertyLoader, isPropertiesLoader] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const EMPTY_FORM = {
    propertyId: '',
    name: '',
    unitTypeId: '',
    amount: 0
  }
  const [formData, setFormData] = useState(EMPTY_FORM);

  const tableData = useMemo(() => units ?? [], [units]);



  useEffect(() => {
    fetchUnits();
    fetchProperties();

    if (!formData.propertyId) {
      setUnitTypes([]);
      return;
    }

    fetchUnitTypesByProperty();

  }, [formData.propertyId]);


  const fetchProperties = async () => {
    await getData({
    execute,
    request: () => propertyService.getAll(),
    setData: setProperties,
    setLoading: isPropertiesLoader,
    });
  };
  
  const fetchUnits = async () => {
      await getData({
      execute,
      request: () => unitService.getAll(),
      setData: setUnits,
      setLoading,
      });
  };

  const fetchUnitTypesByProperty = async () => {
      await getData({
      execute,
      request: () => unitTypeService.byProperty(selectedPropertyId),
      setData: setUnitTypes,
      setLoading,
      });
  };

  const refreshTableData = () =>{
    fetchUnits();
    handleCloseModal();
  }



  const handleEdit = (rowId) => {
    const item = units.find(p => p.id === rowId);
    if (!item) return;
    setFormData(item);
    setSelectedId(item.id);
    setPropertySelectedId(item.propertyId);
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



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handlePropertySelect = (e) => {
    const { name, value } = e.target;
    setPropertySelectedId(value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleUnitTypeSelect = (e) => {
    const { name, value } = e.target;
    setSelectedUnitTypeId(value);
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




  const validateModalForm = () => {
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
      request: () => unitService.add(formData),
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
      request: () => unitService.update(selectedId, formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };



  return (
    <>
    <BreadCrumb  greetings="" />
    <div id="Section">
      <div className="header">
          <h3>List of all Houses</h3>
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
          title="Delete Unit"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Unit',
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
        title={isEditMode ? "Update Unit" : "Add Unit"}
        loadingBtn={loadingBtn}
        isEditMode={isEditMode}
      >
        <Select
          name="propertyId"
          labelName="Property Name"
          value={formData.propertyId || ''}
          onChange={handlePropertySelect}
          options={
            properties
            ? properties && properties.length > 0
              ? properties.map(p => ({ value: p.id, label: p.name }))
              : [{ value: '', label: 'No Available Properties', disabled: true }]
            : []
          }
        />
        <Input
          type="text"
          name="name"
          placeholder="Enter House Name"
          value={formData.name || ''}
          labelName="House Name"
          onChange={handleInputChange}
        />

        <Select
          name="unitTypeId"
          labelName="Unit Type"
          value={formData.unitTypeId || ''}
          onChange={handleUnitTypeSelect}
          disabled={!formData.propertyId}
          options={
            formData.propertyId
            ? unitTypes && unitTypes.length > 0
              ? unitTypes.map(p => ({ value: p.id, label: p.name }))
              : [{ value: '', label: 'No Available UnitTypes', disabled: true }]
            : []
          }
          text={formData.propertyId ? "Select Unit Types" : "Choose Property First"}
          placeholder=""
        />

        <Input
          type="text"
          name="amount"
          placeholder="Enter Rent Amount"
          value={formData.amount || ''}
          labelName="Rent Amount"
          onChange={handleInputChange}
        />
      </Modal>
    </div>
  </>
  )
}

export default Unit