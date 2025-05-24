import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/UnitColumns";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Select from '../components/Select';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';


const UnitCharge = () => {
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
    const [unitTypes, setUnitTypes] = useState([]);
    const [unitStatus, setUnitStatus] = useState([]);
    const [formData, setFormData] = useState({
      propertyId: '',
      name: '',
      unitTypeId: '',
      unitType: '',
      status: ''
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
            endpoint: 'Unit',
            setData: setCharges,
            setLoading,
            setError
        });

        getData({
          endpoint: 'Properties',
          setData: setProperties,
          setLoading,
          setError
        });

        getData({
          endpoint: 'UnitType',
          setData: setUnitTypes,
          setLoading,
          setError
        });
      }, []);



const columns = getColumns({
  endpoint: "Unit",
  activeRow,
  setActiveRow,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setFormData,
  setOriginalData,
  setShowModal,
  charges,
});



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };









 const validateForm = () => {
    const { name, status, unitTypeId, propertyId} = formData;
    if (!name || !status || !unitTypeId || !propertyId) {
      return "Please fill in all required fields.";
    }
    if(!validateTextInput(name, true)){
      return "Unit Name cannot be empty";
    }
    if(unitTypeId == isNaN){
      return "Please enter a Amount";
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
          <Table data={charges} columns={columns} loading={loading}  error={error}/>
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
          onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
          errorMessage={formError}
          title={isEditMode ? "Update Unit" : "Add Unit"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ''}
            onChange={handleSelect}
            options={properties.map(p => ({ value: p.id, label: p.name }))}
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
            onChange={handleSelect}
            options={unitTypes.map(p => ({ value: p.id, label: p.name }))}
          />
          <Select
            name="status"
            labelName="Status"
            value={formData.status || ''}
            onChange={handleSelect}
            options={properties.map(p => ({ value: p.id, label: p.name }))}
          />
          </Modal>
    </div>
  </>
  )
}

export default UnitCharge