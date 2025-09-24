import React, { useState, useEffect, act } from 'react';
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
    const [tenants, setTenants] = useState([]);
    const [tenantStatus, setTenantStatus] = useState([]);
    const [activeTenant, setActiveTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assignUnitModal, setAssignUnitModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [formError, setFormError] = useState('');
    const [showPaymentInputs, setShowPaymentInputs] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [select, setSelect] = useState('');
    const [properties, setProperties] = useState([]);
    const [genders, setGender] = useState([]);
    const [units, setUnit] = useState([]);
    const [formData, setFormData] = useState({
      user: {
        propertyId: 0,
        firstName: '',
        lastName: '',
        emailAddress: '',
        mobileNumber: '',
        alternativeNumber: '',
        nationalId: 0,
        profilePhotoUrl: '',
        genderId: 0,
      },
      unitId: 0
    });

    const [assignUnitFormData, setAssignUnitFormData] = useState({
      tenantId: 0,
      unitId: 0,
      status: 0,
      paymentMethodId: 0,
      depositAmount: 0,
      amountPaid: 0,
      paymentDate: new Date(),
    });


    // add unitId to formData
    useEffect(() => {
      if (activeTenant) {
        setAssignUnitFormData(prev => ({
          ...prev,
          tenantId: activeTenant.id,
          unitId: activeTenant.unitId
        }));
      }
    }, [activeTenant]);
    


    useEffect(() => {
      getData({
          endpoint: 'Tenant',
          setData: setTenants,
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


      getData({
        endpoint: 'SystemCodeItem/By-Name/TENANTSTATUS',
        setData: setTenantStatus,
        setLoading,
        setError
      });

      getData({
        endpoint: 'SystemCodeItem/By-Name/PAYMENTMETHOD',
        setData: setPaymentMethods,
        setLoading,
        setError
      });


      getData({
        endpoint: 'Unit',
        setData: setUnit,
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
    setAssignUnitModal,
    setFormData,
    setActiveTenant: setActiveTenant,
    setOriginalData,
    setShowModal,
    tenants
  });



  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSelect(value);

    // Fields that belong inside the `user` object
    const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId'];
    const assignUnitFields = ['tenantId', 'unitId', 'status', 'paymentMethodId', 'depositAmount', 'amountPaid', 'paymentDate'];

    if (assignUnitFields.includes(name)) {
      setAssignUnitFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === "status") {
        const selectedStatus = tenantStatus.find(s => s.id.toString() === value)?.item?.toLowerCase();
        setShowPaymentInputs(selectedStatus === "active");
      }
      
    } else if (userFields.includes(name)) {
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
  const assignUnitFields = ['tenantId', 'unitId', 'status', 'paymentMethodId', 'depositAmount', 'amountPaid', 'paymentDate'];


    if (userFields.includes(name)) {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }));
    } else if (assignUnitFields.includes(name)) {
      setAssignUnitFormData(prev => ({
        ...prev,
        [name]: value
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

    if (nationalId === undefined || nationalId === 0) {
      nationalId = null;
    }

    if (isNaN(nationalId)) {
      return "National ID must be a number.";
    }

    return '';
  };


  const validateAssignForm = () => {
    var { tenantId,  unitId, status, paymentMethodId, depositAmount, amountPaid, paymentDate } = assignUnitFormData;

    if (!tenantId || !unitId || !status) {
      return "Please fill in all required fields.";
    }

    if(tenantStatus.find(s => s.id === status)?.item?.toLowerCase() === "active") {
      if (!paymentMethodId || !depositAmount || !amountPaid || !paymentDate) {
        return "Please fill in all payment fields for active tenants.";
      }
      if (isNaN(depositAmount) || isNaN(amountPaid)) {
        return "Deposit Amount and Amount Paid must be numbers.";
      }
    }

    return false;

  }


  
  const handleAssignUnitFormSubmit = (e) => {
    addData({
      e,
      validateForm: validateAssignForm,   // ✅ match expected name
      formData: assignUnitFormData,  
      endpoint: 'Tenant/AssignUnit',
      setFormError,
      setLoadingBtn,
      setFormData,
      setShowModal: setAssignUnitModal,
      setData: setTenants,
      refreshDataUrl: 'Tenant',
      getdata: true,
      setLoading,
    });
  };


  const handleFormSubmit = (e) => {
      addData({
      e,
      validateForm: validateForm,
      formData: formData,
      endpoint: 'Tenant',
      setFormError,
      setLoadingBtn,
      setFormData,
      setShowModal: setShowModal,
      setData: setTenants,
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
      endpoint: 'Tenant',
      setFormError,
      setLoadingBtn,
      setFormData,
      setShowModal,
      setIsEditMode,
      setData: setTenants,
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
          <Table data={tenants} columns={columns} loading={loading}  error={error}/>
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
            setData: setTenants,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />

            {/* ASSIGN UNIT MODAL */}
        <Modal
          isOpen={assignUnitModal}
          onClose={() => setAssignUnitModal(false)}
          onSubmit={handleAssignUnitFormSubmit}
          errorMessage={formError}
          title={"Assign Unit"}
          loadingBtn={loadingBtn}
        >
          <Input
            type="hidden" 
            name="tenantId" 
            value={assignUnitFormData.tenantId || activeTenant?.id || 0} 
          />
          <div className="column">
            <div className="row">
              <Select
                name="unitId"
                labelName="Choose Unit"
                value={assignUnitFormData.unitId || activeTenant?.unitId || ''} 
                onChange={handleSelect}
                disabled={!!activeTenant?.unitId} // ✅ disabled if tenant already has a unit
                options={
                  activeTenant?.unitId
                    ? [{ value: activeTenant.unitId, label: units.find(u => u.id === activeTenant.unitId)?.name || "Assigned Unit" }]
                    : error
                      ? [{ value: '', label: 'Something went wrong!!!', disabled: true }]
                      : loading
                        ? [{ value: '', label: 'Loading Units...', disabled: true }]
                        : (units || [])
                            .filter(
                              u =>
                                u.propertyId === parseInt(activeTenant?.user?.propertyId) &&
                                u.status?.toLowerCase() !== "active"
                            )
                            .map(p => ({ value: p.id, label: p.name }))
                }
              />


              <Select
                name="status"
                labelName="Tenant Status"
                value={assignUnitFormData.status || activeTenant?.tenantStatus || 0}
                onChange={handleSelect}
                options={tenantStatus
                  .map(p => ({ value: p.id, label: p.item, disabled: p.item === activeTenant?.tenantStatus}))
                }
              />

                {showPaymentInputs && (
                  <Select
                      name="paymentMethodId"
                      labelName="Payment Method"
                      value={assignUnitFormData.paymentMethodId || 0}
                      onChange={handleSelect}
                      options={
                      error
                          ? [{ value: 0, label: "Error Fetching Payment Methods", disabled: true }]
                          : loading
                          ? [{ value: 0, label: "Loading Payment Methods...", disabled: true }]
                          : paymentMethods.map(p => ({ value: p.id, label: p.item }))
                      }
                    />
                )}

            </div>


              {showPaymentInputs && (
                <div className="row">
                    
                    <Input
                        type="number"
                        name="depositAmount"
                        placeholder="Enter Deposit Amount"
                        labelName="Deposit Amount"
                        value={assignUnitFormData.depositAmount || ''}
                        onChange={handleInputChange}
                    />

                    <Input
                        type="number"
                        name="amountPaid"
                        placeholder="Enter Amount Paid"
                        value={assignUnitFormData.amountPaid || ''}
                        labelName="Rent"
                        onChange={handleInputChange}
                    />
                        
            
                    <Input
                      type="date"
                      name="paymentDate"
                      labelName="Payment Date"
                      value={
                        assignUnitFormData.paymentDate ||
                        new Date().toISOString().split("T")[0] // 👈 formats correctly
                      }
                      onChange={handleInputChange}
                    />


                </div>
            )}

          </div>


        </Modal>


            {/* TENANT MODAL */}
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
            value={formData.user?.propertyId || 0}
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
            value={formData.user?.nationalId || ''}
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