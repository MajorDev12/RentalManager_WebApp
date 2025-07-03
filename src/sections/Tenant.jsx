import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/TenantColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Select from '../components/Select';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { validateEmail } from '../helpers/validateEmail'; 
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';


const Tenant = () => {
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
    const [genders, setGender] = useState([]);
    const [formData, setFormData] = useState({
      user: {
        propertyId: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        mobileNumber: '',
        alternativeNumber: '',
        nationalId: '',
        profilePhotoUrl: '',
        genderId: '',
      }
    });



    useEffect(() => {
        getData({
            endpoint: 'Tenant',
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
          endpoint: 'SystemCodeItem/BY-NAME/GENDER',
          setData: setGender,
          setLoading,
          setError
        });
    }, []);



  const columns = getColumns({
    endpoint: "Tenant",
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



  const handleSelect = (e) => {
  const { name, value } = e.target;
  setSelect(value);

  // Fields that belong inside the `user` object
  const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId'];

    if (userFields.includes(name)) {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleInputChange = (name, value) => {
    // Fields that belong inside the `user` object
  const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId'];

    if (userFields.includes(name)) {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleCloseModal = () => {
    setFormError('');
    setIsEditMode(false);
    setFormData({});
    setShowModal(false);
  };





const validateForm = () => {
  var { propertyId, firstName, lastName, emailAddress, mobileNumber, alternativeNumber, nationalId, genderId } = formData.user;

  if (!propertyId || !firstName || !lastName || !mobileNumber) {
    return "Please fill in all required fields.";
  }

  if (!validateTextInput(firstName, true) || !validateTextInput(lastName, true)) {
    return "Names cannot be empty.";
  }

  if (!validateEmail(emailAddress)) {
    return "Please enter a valid Email Address.";
  }

  if (nationalId === undefined || nationalId === '') {
    nationalId = null;
  }

  if (isNaN(nationalId)) {
    return "National ID must be a number.";
  }

  return '';
};





const handleFormSubmit = (e) => {
     addData({
    e,
    validateForm,
    formData,
    endpoint: 'Tenant',
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
      endpoint: 'Tenant',
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
          <h3>List of all Tenants</h3>
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
          title="Delete Tenant"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Tenant',
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
          title={isEditMode ? "Update Tenant" : "Add Tenant"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.user?.propertyId || ''}
            onChange={handleSelect}
            options={properties.map(p => ({ value: p.id, label: p.name }))}
          />
          <Input
            type="text"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.user?.firstName || ''}
            labelName="First Name"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.user?.lastName || ''}
            labelName="Last Name"
            onChange={handleInputChange}
          />
          <Input
            type="email"
            name="emailAddress"
            placeholder="Enter Email Address"
            value={formData.user?.emailAddress || ''}
            labelName="Email Address"
            onChange={handleInputChange}
          />

          <Input
            type="tel"
            name="mobileNumber"
            placeholder="Enter Mobile Number"
            value={formData.user?.mobileNumber || ''}
            labelName="Mobile Number"
            onChange={handleInputChange}
          />
          <Input
            type="tel"
            name="alternativeNumber"
            placeholder="Enter Alternative Number"
            value={formData.user?.alternativeNumber || ''}
            labelName="Alternative Number"
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="nationalId"
            placeholder="Enter national Id"
            value={formData.user?.nationalId || null}
            labelName="National Id"
            onChange={handleInputChange}
          />
          
          <Select
            name="genderId"
            labelName="Gender"
            value={formData.user?.genderId || ''}
            onChange={handleSelect}
            options={genders.map(p => ({ value: p.id, label: p.item }))}
          />

          </Modal>
    </div>
  </>
  )
}

export default Tenant