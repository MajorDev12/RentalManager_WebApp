import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./TenantColumn";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { validateEmail } from '../../helpers/validateEmail'; 
import { getData } from '../../helpers/getData';
import { addData } from '../../helpers/addData';
import { handleDelete } from '../../helpers/deleteData';
import { getDate } from '../../helpers/getDate';
import { months } from '../../includes/months';
import { years } from '../../includes/years';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { propertyService } from "../properties/propertyService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { unitService } from "../units/unitService";
import { utilityService } from "../utilities/utilityService";
import { tenantService } from "./tenantService";
import { transactionService } from "../transactions/transactionService";
import { useApiRequest } from '../../hooks/useApiRequest';
import "../../css/tenant.css";

const Tenant = () => {
  const { execute, apiLoading } = useApiRequest();  
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [tenantsLoader, isTenantsLoader] = useState(true);
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
  const [propertyLoader, isPropertiesLoader] = useState(false);
  const [transactionType, setTransactionType] = useState([]);
  const [utillityBill, setUtillityBill] = useState([]);
  const [genders, setGender] = useState([]);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const TENANTEMPTY_FORM = {
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
  };
  const ASSIGNTENANTEMPTY_FORM = {
    tenantId: 0,
    unitId: 0,
    status: 0,
    paymentMethodId: 0,
    depositAmount: 0,
    amountPaid: 0,
    paymentDate: new Date(),
  };
  const INVOICEITEMSEMPTY_FORM = [{ utillityBillName: '', invoiceAmount: 0 }];
  const INVOICEDATAEMPTY_FORM = {
    userId: 0,
    invoiceMonth: parseInt(getDate("month")),
    invoiceYear: parseInt(getDate("year")),
    notes: "",
    combine: true
  };
  const ADDPAYMENTEMPTY_FORM = {
    tenantId: 0,
    amount: 0,
    paymentMethod: 0,
    notes: '',
  }
  const ASSIGNSTATUSEMPTY_FORM = {
    tenantId: 0,
    tenantStatus: 0,
  }
  const [invoiceItems, setInvoiceItems] = useState([INVOICEITEMSEMPTY_FORM]);
  const [invoiceData, setInvoiceData] = useState(INVOICEDATAEMPTY_FORM);
  const [formData, setFormData] = useState(TENANTEMPTY_FORM);
  const [assignUnitFormData, setAssignUnitFormData] = useState(ASSIGNTENANTEMPTY_FORM);
  const [assignStatusData, setAssignStatusData] = useState(ASSIGNSTATUSEMPTY_FORM);
  const [addPaymentData, setAddPaymentData] = useState(ADDPAYMENTEMPTY_FORM);



  const tableData = useMemo(() => tenants ?? [], [tenants]);
  



  useEffect(() => {
    fetchTenants();
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
      fetchPaymentMethods();
    }
  }, [addPaymentModal]);


  // Get AddInvoice Data
  useEffect(() => {
    if (addInvoiceModal && selectedId) {
      fetchTransactionTypes();
      fetchUtilitiesByTenant();
    }
  }, [addInvoiceModal]);


  // Get TenantStatus Data
  useEffect(() => {
    if (assignStatusModal && selectedId) {
      fetchTenantStatus();
    }
  }, [assignStatusModal]);
  


  // Get Add Tenant Data
  useEffect(() => {
    if(showModal){
      fetchProperties();
      fetchGenders();
    }

  }, [showModal]);


  // Get AssignUnit Data
  useEffect(() => {
    if(assignUnitModal){
      fetchTenantStatus();
      fetchUnits();
      fetchPaymentMethods();
    }
  }, [assignUnitModal]);
  

  const fetchTenants = async () => {
    await getData({
    execute,
    request: () => tenantService.getAll(),
    setData: setTenants,
    setLoading: isTenantsLoader,
    });
  };

  const refreshTableData = () =>{
    fetchTenants();
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
  
  const fetchUnits = async () => {
    await getData({
    execute,
    request: () => unitService.getAll(),
    setData: setUnits,
    setLoading,
    });
  };

  const fetchPaymentMethods = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getPaymentMethods(),
    setData: setPaymentMethods,
    setLoading,
    });
  };

  const fetchTenantStatus = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getTenantStatus(),
    setData: setTenantStatus,
    setLoading,
    });
  };

  const fetchGenders = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getGenders(),
    setData: setGender,
    setLoading,
    });
  };

  const fetchTransactionTypes = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getTransacionTypes(),
    setData: setTransactionType,
    setLoading,
    });
  };

  const fetchUtilitiesByTenant = async () => {
    await getData({
    execute,
    request: () => utilityService.getByTenantId(selectedId),
    setData: setUtillityBill,
    setLoading,
    });
  };



  const handleEdit = (rowId) => {
    const item = tenants.find(p => p.id === rowId);
    if (!item) return;
    setFormData(item);
    setSelectedId(item.id);
    setOriginalData(item);
    setIsEditMode(true);
    setShowModal(true);
    setActiveRow(null);
  };

  const handleInvoice = (rowId, rowData) => {
    setSelectedId(rowId);
    setActiveTenant(rowData);
    setActiveRow(null);
    setAddInvoiceModal(true);
  };

  const handleAssignUnit = (rowId, rowData) => {
    setAssignUnitModal(true);
    setActiveRow(null);
    setActiveTenant(rowData);
    setSelectedId(rowId);
  };

  const handlePayment = (rowId) => {
    setSelectedId(rowId);
    setActiveRow(null);
    setAddPaymentModal(true);
  };

  const handleTenantStatus = (rowId, rowData) => {
    setSelectedId(rowId);
    setActiveTenant(rowData);
    setAssignStatusModal(true);
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
      addInvoice: handleInvoice,
      addPayment: handlePayment,
      tenantStatus: handleTenantStatus,
      assignUnit: handleAssignUnit
    }),
  [ activeRow ]);



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
    setAddInvoiceModal(false);
    setInvoiceItems(INVOICEITEMSEMPTY_FORM);
  };


  const handlePaymentCloseModal = () => {
    setFormError('');
    setAddPaymentModal(false);
    setAddPaymentData(ADDPAYMENTEMPTY_FORM);
  };

  const handleAssignStatusCloseModal = () => {
    setFormError('');
    setAssignStatusModal(false);
    setAssignStatusData(ASSIGNSTATUSEMPTY_FORM);
  };


  

  const handleCloseModal = () => {
    setFormError('');
    setShowModal(false);
    setFormData(TENANTEMPTY_FORM);
    setAssignUnitModal(false);
    setAssignUnitFormData(ASSIGNTENANTEMPTY_FORM);
    handleInvoiceCloseModal();
    handlePaymentCloseModal();
    handleAssignStatusCloseModal();
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

  const validateDeleteForm = () => {

    if (!selectedId) {
      return "User Id Is not selected.";
    }

    


    // Valid ✓
    return false;
  };


  const validateTenantForm = () => {
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
    else if(activeTenant?.id)
      tenantId = activeTenant?.id;


    if (!tenantId || tenantId == 0 || !tenantStatus || tenantStatus == 0) {
      return "Please fill in all required fields.";
    }

    if (isNaN(tenantId) || isNaN(tenantStatus)) {
      return "TenantStatus must be a number.";
    }

    return false;

  }
  
  const handleAssignUnitFormSubmit = async (e) => {
    await handleFormSubmit({
      e,
      validateForm: validateAssignForm,
      execute,
      request: () => tenantService.assignUnit(assignUnitFormData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setAssignUnitModal(ASSIGNTENANTEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };


  const addTenantHandler = async (e) => {
  
    await handleFormSubmit({
      e,
      validateForm: validateTenantForm,
      execute,
      request: () => tenantService.add(formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(TENANTEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };


  const updateTenantHandler = async (e) => {
  
    await handleFormSubmit({
      e,
      validateForm: validateTenantForm,
      execute,
      request: () => tenantService.update(selectedId, formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(TENANTEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };


  const handleInvoiceFormSubmit = async (e) => {

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

    await handleFormSubmit({
      e,
      validateForm: validateInvoiceForm,
      execute,
      request: () => transactionService.addInvoice(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setInvoiceData(INVOICEDATAEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };



  const handlePaymentFormSubmit = async (e) => {

    const payload = {
      tenantId: selectedId,
      paymentMethodId: addPaymentData.paymentMethod,  // mapped here
      amount: addPaymentData.amount,    // mapped here
      notes: addPaymentData.notes,
    };

    await handleFormSubmit({
      e,
      validateForm: validatePaymentForm,
      execute,
      request: () => transactionService.addPayment(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setAddPaymentData(ADDPAYMENTEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });

  };


  const handleStatusFormSubmit = async (e) => {

    const payload = {
      tenantId: assignStatusData.tenantId || activeTenant?.id,
      status: assignStatusData.tenantStatus,
    };

    await handleFormSubmit({
      e,
      validateForm: validateStatusForm,
      execute,
      request: () => tenantService.assignStatus(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setAssignStatusData(ASSIGNSTATUSEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };


  const handleTenantDelete = async (e) => {

    await handleFormSubmit({
      e,
      validateForm: validateDeleteForm,
      execute,
      request: () => tenantService.archive(selectedId),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(TENANTEMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
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
        <Table data={tableData} columns={columns} loading={tenantsLoader} error={error}/>
      </div>


      <DeleteModal
        isOpen={deleteModalOpen}i
        title="Delete Tenant"
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleTenantDelete}

        loadingBtn={loadingBtn}
      />


            {/* ADD PAYMENT */}
      <Modal
        isOpen={addPaymentModal}
        onClose={handleCloseModal}
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
        onClose={handleCloseModal}
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
        

      <div id='InvoiceItemsCont' className="col">

        {invoiceItems?.length > 0 && (
          invoiceItems.map((item, index) => (
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
          ))
          
          )}


        
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
        onClose={handleCloseModal}
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
            onChange={handleSelect}
            options={tenantStatus
              .map(p => ({ 
                value: p.id,
                label: p.item,
                disabled: p.item === activeTenant?.tenantStatus,
              }))
            }
          />


        </div>




      </Modal>



          {/* ASSIGN UNIT MODAL */}
      <Modal
        isOpen={assignUnitModal}
        onClose={handleCloseModal}
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
                            u => u.status?.toLowerCase() !== "occupied"
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
        onSubmit={isEditMode ? updateTenantHandler : addTenantHandler}
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