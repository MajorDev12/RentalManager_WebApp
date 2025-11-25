import React, { useState, useEffect, act } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/TenantColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { validateEmail } from '../helpers/validateEmail'; 
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';
import { getDate } from '../helpers/getDate';
import { months } from '../includes/months';
import { years } from '../includes/years';


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
    const [assignStatusModal, setAssignStatusModal] = useState(false);
    const [assignUnitModal, setAssignUnitModal] = useState(false);
    const [addPaymentModal, setAddPaymentModal] = useState(false);
    const [addInvoiceModal, setAddInvoiceModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [formError, setFormError] = useState('');
    const [showPaymentInputs, setShowPaymentInputs] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [select, setSelect] = useState('');
    const [properties, setProperties] = useState([]);
    const [transactionType, setTransactionType] = useState([]);
    const [utillityBill, setUtillityBill] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState([
      { utillityBillName: '', invoiceAmount: 0 }
    ]);

    const [invoiceData, setInvoiceData] = useState({
      userId: 0,
      invoiceMonth: parseInt(getDate("month")),
      invoiceYear: parseInt(getDate("year")),
      notes: "",
      combine: true
    });


    const [genders, setGender] = useState([]);
    const [units, setUnit] = useState([]);
    const navigate = useNavigate();
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

    const [assignStatusData, setAssignStatusData] = useState({
      tenantId: 0,
      tenantStatus: 0,
    });


    const [addPaymentData, setAddPaymentData] = useState({
      tenantId: 0,
      amount: 0,
      paymentMethod: 0,
      notes: '',
    });




    useEffect(() => {
      getData({
            endpoint: 'Tenant',
            setData: setTenants,
            setLoading,
            setError
        });

    }, []);




    // add unitId to formData
    useEffect(() => {
      if (activeTenant) {
        setAssignUnitFormData(prev => ({
          ...prev,
          tenantId: activeTenant.id,
          unitId: activeTenant.unitId
        }));

        setInvoiceData(prev => ({
          ...prev,
          tenantId: activeTenant.id,
        }));
      }
    }, [activeTenant]);


    // Get AppPayment Data
    useEffect(() => {
      if (addPaymentModal && selectedId) {

        getData({
          endpoint: 'SystemCodeItem/By-Name/PAYMENTMETHOD',
          setData: setPaymentMethods,
          setLoading,
          setError
        });

      }
    }, [addPaymentModal]);


    // Get AddInvoice Data
    useEffect(() => {
      if (addInvoiceModal && selectedId) {
        getData({
          endpoint: 'SystemCodeItem/BY-NAME/TRANSACTIONTYPE',
          setData: setTransactionType,
          setLoading,
          setError
        });

        getData({
          endpoint: `UtilityBill/By-TenantId/${selectedId}`,
          setData: setUtillityBill,
          setLoading,
          setError
        });

      }
    }, [addInvoiceModal]);


    // Get TenantStatus Data
    useEffect(() => {
      if (assignStatusModal && selectedId) {

        getData({
          endpoint: 'SystemCodeItem/By-Name/TENANTSTATUS',
          setData: setTenantStatus,
          setLoading,
          setError
        });

      }
    }, [assignStatusModal]);
    


    // Get Add Tenant Data
    useEffect(() => {
      if(showModal){
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
  
      }

    }, [showModal]);


    // Get AssignUnit Data
    useEffect(() => {
      if(assignUnitModal){
        getData({
        endpoint: 'SystemCodeItem/By-Name/TENANTSTATUS',
        setData: setTenantStatus,
        setLoading,
        setError
      });
  
        
      getData({
        endpoint: 'Unit',
        setData: setUnit,
        setLoading,
        setError
      });

      getData({
        endpoint: 'SystemCodeItem/By-Name/PAYMENTMETHOD',
        setData: setPaymentMethods,
        setLoading,
        setError
      });
      }
    }, [assignUnitModal]);
    



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
    setAddPaymentModal,
    setAssignStatusModal,
    setAddInvoiceModal,
    tenants
  });



  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSelect(value);

    const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId'];
    const assignUnitFields = ['tenantId', 'unitId', 'status', 'paymentMethodId', 'depositAmount', 'amountPaid', 'paymentDate'];
    const addPaymentFields = ['paymentMethod'];
    const addInvoiceFields = ["userId", "invoiceMonth", "invoiceYear", "combine", "notes"];
    const addStatusField = ["tenantStatus"];

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
    }else if(addPaymentFields.includes(name)){
      setAddPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }else if(addStatusField.includes(name)){
      setAssignStatusData(prev => ({
        ...prev,
        [name]: value
      }));
    }else if(addInvoiceFields.includes(name)){
      setInvoiceData(prev => ({
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


  const handleInputChange = (name, value) => {
    // Fields that belong inside the `user` object
  const userFields = ['propertyId', 'genderId', 'firstName', 'lastName', 'emailAddress', 'mobileNumber', 'alternativeNumber', 'nationalId'];
  const assignUnitFields = ['tenantId', 'unitId', 'status', 'paymentMethodId', 'depositAmount', 'amountPaid', 'paymentDate'];
  const addPaymentData = ['amount', 'notes'];

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
    } else if (addPaymentData.includes(name)) {
      setAddPaymentData(prev => ({
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




  const handleInvoiceCloseModal = () => {
    setFormError('');
    setInvoiceData({invoiceMonth: parseInt(getDate("month")), invoiceYear: parseInt(getDate("year")) });
    setInvoiceItems([{utillityBillName: '', invoiceAmount: 0}]);
    setAddInvoiceModal(false);
  };


  

  const handleCloseModal = () => {
    setFormError('');
    setInvoiceData({});
    setAddInvoiceModal(false);
  };



    const validateInvoiceForm = () => {

      var { userId, invoiceMonth, invoiceYear } = invoiceData;

      if(activeTenant){
        userId = activeTenant.user.id;
      }

      // Validate main required fields
      if (!userId || !invoiceMonth || !invoiceYear) {
      return "Please fill all required fields.";
      }

      
      // Validate invoice items
      if (!invoiceItems || invoiceItems.length === 0) {
      return "Please add at least one invoice item.";
      }

      for (let i = 0; i < invoiceItems.length; i++) {
        const item = invoiceItems[i];

        if (!item.utillityBillName || utillityBillName.length <= 0) {
          return `Item #${i + 1}: Please select a utility bill.`;
        }

        if (!item.invoiceAmount || item.invoiceAmount <= 0) {
          return `Item #${i + 1}: Please enter a valid amount.`;
        }
        

      }

      // Valid ✓
      return false;
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


  const validatePaymentForm = () => {
    var { tenantId, paymentMethod, amount, notes } = addPaymentData;

    if(selectedId)
      tenantId = selectedId;


    if (!tenantId || !amount || !paymentMethod) {
      return "Please fill in all required fields.";
    }

    if (isNaN(amount) || isNaN(paymentMethod)) {
      return "Amount and paymentMethod must be a number.";
    }

    return false;

  }


  const validateStatusForm = () => {
    var { tenantId, tenantStatus } = assignStatusData;

    if(selectedId)
      tenantId = selectedId;


    if (!tenantId || !tenantStatus) {
      return "Please fill in all required fields.";
    }

    if (isNaN(tenantId) || isNaN(tenantStatus)) {
      return "TenantStatus must be a number.";
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


    const handleInvoiceFormSubmit = (e) => {

      const payload = {
        userId: activeTenant.user.id,
        monthFor: invoiceData.invoiceMonth,  // mapped here
        yearFor: invoiceData.invoiceYear,    // mapped here
        notes: invoiceData.notes,
        combine: invoiceData.combine,
        item: invoiceItems.map(i => ({
          TransactionCategory: i.utillityBillName,
          Amount: i.invoiceAmount
        }))
      };

      addData({
      e,
      validateForm: validateInvoiceForm,
      formData: payload,
      endpoint: 'Transaction/AddInvoice',
      setFormError,
      setLoadingBtn,
      setFormData,
      setShowModal: setShowModal,
      setData: setTenants,
      getdata: true,
      setLoading,
    });
    };



    const handlePaymentFormSubmit = (e) => {

      const payload = {
        tenantId: selectedId,
        paymentMethodId: addPaymentData.paymentMethod,  // mapped here
        amount: addPaymentData.amount,    // mapped here
        notes: addPaymentData.notes,
      };

      addData({
        e,
        validateForm: validatePaymentForm,
        formData: payload,
        endpoint: 'Transaction/AddPayment',
        setFormError,
        setLoadingBtn,
        setFormData,
        setShowModal: setShowModal,
        setData: setTenants,
        getdata: true,
        setLoading,
      });
    };


    const handleStatusFormSubmit = (e) => {

      const payload = {
        tenantId: assignStatusData.tenantId,
        status: assignStatusData.tenantStatus,
      };

      addData({
        e,
        validateForm: validateStatusForm,
        formData: payload,
        endpoint: 'Transaction/AddPayment',
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


  const handleRowClick = () => {
      navigate(`/Tenants/Tenant`);
  };


  const handleAddItem = () => {
    setInvoiceItems(prev => [
      ...prev,
      { utillityBillName: '', invoiceAmount: 0 }
    ]);
  };


  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setInvoiceItems(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };





  return (
    <>
    <BreadCrumb  greetings="" />
    <div id="Section">
      <div className="header">
        <h3>List of all Tenants</h3>
        <div className="row">
          <PrimaryButton
            name="Add Tenant"
            onClick={() => setShowModal(true) }
          />
        </div>
      </div>

      <div className="TableContainer">
          <Table data={tenants} onclickItem={handleRowClick} columns={columns} loading={loading}  error={error}/>
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



            {/* ADD PAYMENT */}
        <Modal
          isOpen={addPaymentModal}
          onClose={() => setAddPaymentModal(false)}
          onSubmit={handlePaymentFormSubmit}
          errorMessage={formError}
          title={"Add Payment"}
          loadingBtn={loadingBtn}
        >

          <Input
            type="number"
            labelName="Amount"
            placeholder="Enter amount Paid" 
            name="amount" 
            onChange={handleInputChange}
            value={addPaymentData.amount || ''} 
          />


          <Select
            name="paymentMethod"
            labelName="payment Method"
            value={addPaymentData.paymentMethod || 0}
            onChange={handleSelect}
            options={paymentMethods.map(p => ({ value: p.id, label: p.item }))}
          />

          <Textarea
            type="text"
            name="notes"
            placeholder="Enter description"
            value={addPaymentData.notes || ''}
            labelName="Notes"
            onChange={handleInputChange}
          />

          <Input
            type="hidden"
            name="tenantId" 
            value={selectedId || 0} 
          />
        </Modal>


    {/* ADD INVOICE */}
        <Modal
          isOpen={addInvoiceModal}
          onClose={() => handleInvoiceCloseModal(false)}
          onSubmit={handleInvoiceFormSubmit}
          errorMessage={formError}
          title={"Add Invoice"}
          loadingBtn={loadingBtn}
        >
          
          <div className="col">
            <div className="row">
              <Select
                name="invoiceMonth"
                labelName="Month For"
                value={invoiceData.invoiceMonth || parseInt(getDate("month"))}
                onChange={handleSelect}
                options={months.map(p => ({ value: p.value, label: p.name }))}

              />

              <Select
                name="invoiceYear"
                labelName="Year For"
                value={invoiceData.invoiceYear || parseInt(getDate("year"))}
                onChange={handleSelect}
                options={years.map(p => ({ value: p.id, label: p.name }))}
              />
            </div>
          </div>
          

        <div className="col">

          {invoiceItems.map((item, index) => (
            <div key={index} className="row" style={{ alignItems: "center" }}>

              <Select
                name="utillityBillName"
                labelName="Item Type"
                value={item.utillityBillName ?? ''}
                onChange={(e) =>
                  handleItemChange(index, "utillityBillName", e.target.value)
                }
                options={utillityBill.map(p => ({
                  value: p.name,
                  label: p.name
                }))}
              />

              <Input
                type="number"
                labelName="Amount"
                name="invoiceAmount"
                value={item.invoiceAmount ?? 0}
                onChange={(name, value) =>
                  handleItemChange(index, name, value)
                }
              />

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="delete-btn"
                >
                  <RiDeleteBin6Line />
                </button>
              )}
            </div>
          ))}

          
          <button
            type="button"
            onClick={handleAddItem}
            className="add-btn"
          >
            <FaPlusCircle className='plusIcon' /> Add Item
          </button>

        </div>

        <Input
            type="hidden" 
            name="userId" 
            value={activeTenant?.user.id || 0} 
          />


          
        </Modal>


       {/* ASSIGN STATUS MODAL */}
        <Modal
          isOpen={assignStatusModal}
          onClose={() => setAssignStatusModal(false)}
          onSubmit={handleStatusFormSubmit}
          errorMessage={formError}
          title={"Change Tenant Status"}
          loadingBtn={loadingBtn}
        >
          <Input
            type="hidden" 
            name="tenantId" 
            value={assignStatusData.tenantId || activeTenant?.id || 0} 
          />

          <div className="row">
          
            <Select
              name="tenantStatus"
              labelName="Tenant Status"
              value={assignStatusData.tenantStatus || activeTenant?.tenantStatus || 0}
              disabled={activeTenant?.tenantStatus.toLowerCase() != "active"}
              onChange={handleSelect}
              options={tenantStatus
                .map(p => ({ value: p.id, label: p.item, disabled: p.item === activeTenant?.tenantStatus}))
              }
            />

  
          </div>




        </Modal>



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
                disabled={activeTenant?.tenantStatus.toLowerCase() == "active"}
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