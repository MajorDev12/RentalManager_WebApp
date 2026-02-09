import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./UnitTypeColumn";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { getData } from '../../helpers/getData';
import { addData } from '../../helpers/addData';
import { updateData } from '../../helpers/updateData';
import { handleDelete } from '../../helpers/deleteData';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { unitTypeService } from "./unitTypeService";
import { propertyService } from "../properties/propertyService";
import { useApiRequest } from '../../hooks/useApiRequest';


const UnitType = () => {
  const { execute, apiLoading } = useApiRequest();
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState('');
  const [unitTypes, setUnitTypes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertiesLoader, isPropertiesLoader] = useState([]);
  const EMPTY_FORM = {
    propertyId: '',
    name: '',
    notes: ''
  }
  const [formData, setFormData] = useState(EMPTY_FORM);


   const handleSelect = (e) => {
    const { name, value } = e.target;
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
    fetchUnitTypes();
    fetchProperties();
  }, []);


  const refreshTableData = () =>{
    fetchUnitTypes();
    handleCloseModal();
  }

  const fetchProperties = async () => {
    await getData({
    execute,
    request: () => propertyService.getAll(),
    setData: setProperties,
    setLoading: isPropertiesLoader,
    });
  };
    

  const fetchUnitTypes = async () => {
      await getData({
      execute,
      request: () => unitTypeService.getAll(),
      setData: setUnitTypes,
      setLoading,
      });
  };

    


  const handleEdit = (rowId) => {
        const item = unitTypes.find(p => p.id === rowId);
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



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };




 const validateModalForm = () => {
    const { name, notes, propertyId} = formData;
    if (!name || !propertyId) {
      return "Please fill in all required fields.";
    }
    if(!validateTextInput(name, true)){
      return "UnitType name cannot be empty";
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
  
  
  const addUnitTypeHandler = async (e) => {

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => unitTypeService.add(formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };
  
  
  const updateUnitTypeHandler = async (e) => {

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => unitTypeService.update(selectedId, formData),
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
          <h3>List of all Unit Types</h3>
          <PrimaryButton
            name="Add New"
            onClick={() => setShowModal(true) }
          />
        </div>

        <div className="TableContainer">
          <Table data={unitTypes} columns={columns} loading={loading}  error={error}/>
        </div>


        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Unit"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'UnitType',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setUnitTypes,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />





      <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={isEditMode ? updateUnitTypeHandler : addUnitTypeHandler}
          errorMessage={formError}
          title={isEditMode ? "Update UnitType" : "Add UnitType"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ''}
            onChange={handleSelect}
            options={propertiesLoader
                ? [{ value: '', label: 'Loading properties...' }]
                : error
                ? [{ value: '', label: 'Error loading properties' }]
                : !properties || properties.length === 0
                ? [{ value: '', label: 'No properties found' }]
                : properties.map(p => ({
                    value: p.id,
                    label: p.name
                  }))}
          />
          <Input
            type="text"
            name="name"
            placeholder="Enter Unit Type Name"
            value={formData.name || ''}
            labelName="UnitType Name"
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
    </div>
  </>
  )
}

export default UnitType