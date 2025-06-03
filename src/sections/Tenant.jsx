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
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [loadingTenants, setLoadingTenants] = useState(false);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [loadingGender, setLoadingGender] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [formError, setFormError] = useState('');
    const [select, setSelect] = useState('');
    const [properties, setProperties] = useState([]);
    const [genders, setGender] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenantStatus, setTenantStatus] = useState([]);
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
        userStatusId: '',
      },
      unitId: '',
      tenantStatusId: '',
    });



    useEffect(() => {
        getData({
            endpoint: 'Tenant',
            setData: setCharges,
            setLoading: setLoadingTenants,
            setError
        });

        getData({
          endpoint: 'Properties',
          setData: setProperties,
          setLoading: setLoadingProperties,
          setError
        });

        getData({
          endpoint: 'SystemCodeItem/BY-NAME/GENDER',
          setData: setGender,
          setLoading: setLoadingGender,
          setError
        });

        getData({
          endpoint: 'SystemCodeItem/BY-NAME/TENANTSTATUS',
          setData: setTenantStatus,
          setLoading: setLoadingStatus,
          setError
        });

    }, []);


    useEffect(() => {
      if (formData.user?.propertyId) {
        setUnits([]); // Clear current units while loading new ones
        getData({
          endpoint: `Unit/By-Property/${formData.user.propertyId}`,
          setData: setUnits,
          setLoading: setLoadingUnits,
          setError,
        });
      } else {
        setUnits([]);
      }
    }, [formData.user?.propertyId]);






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

  // Fields that belong inside the `user` object
  const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId', 'profilePhotoUrl', 'userStatusId'];

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



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };





 const validateForm = () => {
    const { propertyId, firstName, lastName, emailAddress, mobileNumber, alternativeNumber, nationalId, genderId, unitId, status} = formData;
    if (!propertyId || !firstName || !lastName || !mobileNumber) {
      return "Please fill in all required fields.";
    }
    if(!validateTextInput(firstName, true) || !validateTextInput(lastName, true)){
      return "Names cannot be empty";
    }
    if(!validateEmail(emailAddress)){
      return "Please enter a valid Email Address";
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
          <Table data={charges} columns={columns} loading={loadingTenants}  error={error}/>
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
            name="firstname"
            placeholder="Enter First Name"
            value={formData.user?.firstName || ''}
            labelName="First Name"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="lastname"
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
            type="tel"
            name="nationalId"
            placeholder="Enter national Id"
            value={formData.user?.nationalId || ''}
            labelName="national Id"
            onChange={handleInputChange}
          />
          
          <Select
            name="genderId"
            labelName="Gender"
            value={formData.user?.genderId || ''}
            onChange={handleSelect}
            options={genders.map(p => ({ value: p.id, label: p.item }))}
          />


          <Select
            name="unitId"
            labelName="Unit"
            value={formData.unitId || ''}
            onChange={handleSelect}
            options={
              formData.user?.propertyId
                ? units.map((u) => ({ value: u.id, label: u.name }))
                : [{ value: '', label: 'Choose property first', disabled: true }]
            }
          />


          <Select
            name="tenantStatusId"
            labelName="Status"
            value={formData.tenantStatusId || ''}
            onChange={handleSelect}
            options={tenantStatus.map(p => ({ value: p.id, label: p.item }))}
          />

          </Modal>
    </div>
  </>
  )
}

export default Tenant