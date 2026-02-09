import React, { useState, useEffect, useMemo } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import PrimaryButton from '../../components/ui/PrimaryButton';
import Table from '../../components/ui/Table';
import { getColumns } from "./transactionColumn";
import Modal from '../../components/ui/Modal';
import DeleteModal from '../../components/ui/DeleteModal';  
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { getDate } from '../../helpers/getDate';
import { getData } from '../../helpers/getData';
import { addData } from '../../helpers/addData';
import { handleDelete } from '../../helpers/deleteData';
import { months } from '../../includes/months';
import { years } from '../../includes/years';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { propertyService } from "../properties/propertyService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { utilityService } from "../utilities/utilityService";
import { tenantService } from "../tenants/tenantService";
import { transactionService } from './transactionService';
import { useApiRequest } from '../../hooks/useApiRequest';



const Transaction = () => {
  const { execute, apiLoading } = useApiRequest();  
  const [activeRow, setActiveRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoader, isTransactionsLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [select, setSelect] = useState('');
  const [activeTenant, setActiveTenant] = useState(null);
  const [property, setProperty] = useState([]);
  const [addInvoiceModal, setAddInvoiceModal] = useState(false);
  const [rentInvoiceModal, setRentInvoiceModal] = useState(false);
  const [recurringBillsModal, setRecurringBillsModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [units, setUnits] = useState([]);
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [utillityBill, setUtillityBill] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [invoiceFormData, setInvoiceFormData] = useState({
    propertyId: '',
    userId: '',
    utilityBillId: '', 
    monthFor: '',
    yearFor: '',
  });
  const [tenants, setTenants] = useState([]);
  const [rentInvoiceData, setRentInvoiceData] = useState({
    rentInvoice_property: 0
  });
  const [invoiceItems, setInvoiceItems] = useState([
  {
    transactionCategoryId: 0,
    transactionCategoryCode: "",
    utilityBillId: 0,
    invoiceAmount: 0
  }
  ]);

  const [invoiceData, setInvoiceData] = useState({
    tenantId: 0,
    userId: 0,
    invoiceMonth: parseInt(getDate("month")),
    invoiceYear: parseInt(getDate("year")),
    notes: "",
    combine: true
  });
  const [addPaymentData, setAddPaymentData] = useState({
    payment_tenantId: 0,
    amount: 0,
    paymentMethod: 0,
    notes: '',
  });
  const [recurringBillsData, setRecurringBillsData] = useState({ recurringBills_propertyId: 0, });
  const [actionOptions, setActionOptions] = useState({
    addInvoice: '',
    bulkRentInvoice: '',
    bulkPayment: '',
    bulkReccuringUtilities: '',
    monthFor: '',
    yearFor: '',
    notes: '',
    actions: ''
  });





  useEffect(() => {
    fetchTransactions();
  }, []);





        // useEffect(() => {
        //   if (invoiceData.tenantId) {
        //     getData({
        //       endpoint: `Tenants/${invoiceData.tenantId}`,
        //       setData: setActiveTenant,
        //       setLoading,
        //       setError
        //     });
            
        //     return;
        //   }


        // }, [invoiceData.tenantId]);



  useEffect(() => {
    if (actionOptions.actions == "addInvoice") {
      fetchTenants();

      if(invoiceData && invoiceData.tenantId){
        fetchUtilitiesByTenant();
      }
      return;
    }else if(actionOptions.actions == "addPayment"){
      fetchTenants();
      fetchPaymentMethods();
      return;
    }else if(actionOptions.actions == "rentInvoice"){
      fetchProperties();
    }else if(actionOptions.actions == "addRecurringUtilities"){
      fetchProperties();
    }


  }, [actionOptions.actions]);

  

  useEffect(() => {
    if (invoiceData && invoiceData.userId) {
      fetchTransactionCategories();
      fetchUtilitiesByTenant();
    }
  }, [addInvoiceModal && invoiceData]);


  const fetchTransactions = async () => {
      await getData({
      execute,
      request: () => transactionService.getAll(),
      setData: setTransactions,
      setLoading: isTransactionsLoader,
      });
  };

  const fetchTenants = async () => {
    await getData({
    execute,
    request: () => tenantService.getAll(),
    setData: setTenants,
    setLoading,
    });
  };

  const refreshTableData = () =>{
    fetchTransactions();
    handleCloseModal();
  }

  const fetchProperties = async () => {
    await getData({
    execute,
    request: () => propertyService.getAll(),
    setData: setProperties,
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

  const fetchTransactionCategories = async () => {
    await getData({
    execute,
    request: () => systemCodeItemService.getTransacionCategories(),
    setData: setTransactionCategories,
    setLoading,
    });
  };

  const fetchUtilitiesByTenant = async () => {
    await getData({
    execute,
    request: () => utilityService.getByTenantId(invoiceData.tenantId),
    setData: setUtillityBill,
    setLoading,
    });
  };








  const handleEdit = (rowId) => {
    const item = transactions.find(p => p.id === rowId);
    if (!item) return;
    setIsEditMode(true);
    // setFormData(item);
    // setOriginalData(item);
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



  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSelect(value);

    const addInvoiceFields = ["userId", "tenantId", "invoiceMonth", "invoiceYear"];
    const addPaymentFields = ["payment_tenantId", "paymentMethod"];
    const rentInvoiceField = ["rentInvoice_property"];
    const recurringBillFields = ["recurringBills_propertyId"];


    if(addInvoiceFields.includes(name)){
      if (name === "userId") {
        const selectedTenant = tenants.find(t => t.user?.id == value);

        setInvoiceData(prev => ({
          ...prev,
          userId: value,
          tenantId: selectedTenant?.id ?? 0
        }));
        return;
      }
    }else if(addPaymentFields.includes(name)){

      setAddPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }else if(rentInvoiceField.includes(name)){
      setRentInvoiceData(prev => ({
        ...prev,
        [name]: value
      }));
    }else if(recurringBillFields.includes(name)){
      setRecurringBillsData(prev => ({
        ...prev,
        [name]: value
      }));
    }

  };


  const handleSelectOptions = (e) => {
    const { name, value } = e.target;
      setSelect(value);

      const addInvoiceFields = ["addInvoice"];
      const addPaymentFields = ["addPayment"];
      const rentInvoiceFields = ["rentInvoice"];
      const recurringBillFields = ["addRecurringUtilities"];

      if(addInvoiceFields.includes(value)){
        setAddInvoiceModal(true);
        setActionOptions(prev => ({
          ...prev,
          [name]: value
        }));
      }else if(addPaymentFields.includes(value)){
        setAddPaymentModal(true);
        setActionOptions(prev => ({
          ...prev,
          [name]: value
        }));
      }else if(rentInvoiceFields.includes(value)){
        setRentInvoiceModal(true);
        setActionOptions(prev => ({
          ...prev,
          [name]: value
        }));
      }else if(recurringBillFields.includes(value)){
        setRecurringBillsModal(true);
        setActionOptions(prev => ({
          ...prev,
          [name]: value
        }));
      }
  };


  const handleCloseModal = () => {
    handleInvoiceCloseModal();
    handlePaymentCloseModal();
    handleRentInvoiceCloseModal();
    handleRecurringBillsCloseModal();
  };



  const handleInvoiceCloseModal = () => {
    setFormError('');
    setInvoiceData({invoiceMonth: parseInt(getDate("month")), invoiceYear: parseInt(getDate("year")) });
    setInvoiceItems([
    {
      transactionCategoryId: 0,
      transactionCategoryCode: "",
      utilityBillId: 0,
      invoiceAmount: 0
    }
    ]);
    setAddInvoiceModal(false);
    setActionOptions({actions: ""});
  };



  const handlePaymentCloseModal = () => {
    setFormError('');
    setAddPaymentModal(false);
    setActionOptions({actions: ""});
  };



  const handleRentInvoiceCloseModal = () => {
    setFormError('');
    setRentInvoiceData({rentInvoice_property: 0});
    setRentInvoiceModal(false);
    setActionOptions({actions: ""});
  };
  
  
  const handleRecurringBillsCloseModal = () => {
    setFormError('');
    setRecurringBillsData({recurringBills_propertyId: 0});
    setRecurringBillsModal(false);
    setActionOptions({actions: ""});
  };



  const handleInputChange = (field, value) => {

    const addPaymentFields = ["amount", "notes"];
    if(addPaymentFields.includes(field)){
      setAddPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };



  const validateInvoiceForm = () => {
  
        var { userId, invoiceMonth, invoiceYear } = invoiceData;
  
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
  
          if (!item.transactionCategoryId) {
            return `Item #${i + 1}: Please select a category.`;
          }

          if (
            item.transactionCategoryCode === "utility" &&
            (!item.utilityBillId || item.utilityBillId <= 0)
          ) {
            return `Item #${i + 1}: Please select a utility type.`;
          }

  
          if (!item.invoiceAmount || item.invoiceAmount <= 0) {
            return `Item #${i + 1}: Please enter a valid amount.`;
          }
          
  
        }
  
        // Valid ✓
        return false;
    };


  const validatePaymentForm = () => {
    var { payment_tenantId, paymentMethod, amount, notes } = addPaymentData;

    if (!payment_tenantId || !amount || !paymentMethod) {
      return "Please fill in all required fields.";
    }

    if (isNaN(amount) || isNaN(paymentMethod)) {
      return "Amount and paymentMethod must be a number.";
    }

    return false;

  }


  const validateRentInvoiceForm = () => {
    var { rentInvoice_property } = rentInvoiceData;

    if (!rentInvoice_property) {
      return "Please choose a Property first.";
    }

    return false;

  }


  const validateRecurringBillsForm = () => {
    var { recurringBills_propertyId } = recurringBillsData;

    if (!recurringBills_propertyId) {
      return "Please choose a Property first.";
    }

    return false;

  }



  const handleInvoiceFormSubmit = async (e) => {
    const payload = {
      userId: invoiceData.userId,
      monthFor: invoiceData.invoiceMonth,  // mapped here
      yearFor: invoiceData.invoiceYear,    // mapped here
      notes: invoiceData.notes,
      combine: invoiceData.combine,
      item: invoiceItems.map(i => ({
        transactionCategoryId: i.transactionCategoryId,
        UtilityBillId:
          i.transactionCategoryCode === "Utility"
            ? i.utilityBillId
            : null,
        amount: i.invoiceAmount
      }))

    };

    await handleFormSubmit({
      e,
      validateForm: validateInvoiceForm,
      execute,
      request: () => transactionService.addInvoice(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setInvoiceItems([
    {
      transactionCategoryId: 0,
      transactionCategoryCode: "",
      utilityBillId: 0,
      invoiceAmount: 0
    }
    ]),
      onSuccess: () => refreshTableData(),
    });

  };


  const handlePaymentFormSubmit = async (e) => {
    const payload = {
      tenantId: addPaymentData.payment_tenantId,
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
      resetForm: () => setAddPaymentData({
        payment_tenantId: 0,
        amount: 0,
        paymentMethod: 0,
        notes: ','
      }),
      onSuccess: () => refreshTableData(),
    });

  };


  const handleRentInvoiceFormSubmit = async (e) => {
    const payload = {
      propertyId: rentInvoiceData.rentInvoice_property,
    };
    
    await handleFormSubmit({
      e,
      validateForm: validateRentInvoiceForm,
      execute,
      request: () => transactionService.generateRentInvoices(payload.propertyId),
      setFormError,
      setLoadingBtn,
      resetForm: () => setRentInvoiceData({ rentInvoice_property: 0 }),
      onSuccess: () => refreshTableData(),
    });

  };



  const handlerecurringBillsFormSubmit = async (e) => {
    const payload = {
      propertyId: recurringBillsData.recurringBills_propertyId,
    };

    await handleFormSubmit({
      e,
      validateForm: validateRecurringBillsForm,
      execute,
      request: () => transactionService.generateUtilityInvoices(payload.propertyId),
      setFormError,
      setLoadingBtn,
      resetForm: () => setRecurringBillsData({ recurringBills_propertyId: 0, }),
      onSuccess: () => refreshTableData(),
    });
  };


    

  
  const handleAddItem = () => {
    setInvoiceItems(prev => [
      ...prev,
      {
        transactionCategoryId: 0,
        transactionCategoryCode: "",
        utilityBillId: 0,
        invoiceAmount: 0
      }
    ]);
  };


  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setInvoiceItems(prev => {
      const updated = [...prev];

      if (field === "transactionCategoryId") {
        const category = transactionCategories.find(
          c => c.id === Number(value)
        );

        updated[index] = {
          ...updated[index],
          transactionCategoryId: Number(value),
          transactionCategoryCode: category?.item ?? "",
          utilityBillId:
            category?.item === "utility"
              ? updated[index].utilityBillId
              : 0
        };
      } else {
        updated[index][field] = value;
      }

      return updated;
    });
  };


  return (
    <>
    <BreadCrumb  greetings="" />
    <section id="Section">
      <div className="header">
          <h3>List of all Transactions</h3>
          <div className="row">
            <Select
              name="actions"
              value={actionOptions.actions || ''}
              onChange={handleSelectOptions}
              options={[
                { value: "addInvoice", label: "Add Invoice" },
                { value: "addPayment", label: "Add Payment" },
                { value: "rentInvoice", label: "Generate Rent Invoices" },
                { value: "addRecurringUtilities", label: "Generate Recurring bills Invoices" },
              ]}
              text='-- Actions --'
            />
          </div>
        </div>

      <div className="TableContainer">
          <Table data={transactions} columns={columns} loading={transactionsLoader}  error={error}/>
        </div>


        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Unit"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Transaction',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setTransactions,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />



      {/* ADD INVOICE */}
      <Modal
        isOpen={addInvoiceModal}
        onClose={handleInvoiceCloseModal}
        onSubmit={handleInvoiceFormSubmit}
        errorMessage={formError}
        title={"Add Invoice"}
        loadingBtn={loadingBtn}
      >
        <div className="col">

          {/* ================= HEADER ================= */}
          <div className="row">
            <Select
              name="userId"
              labelName="Tenant"
              value={invoiceData?.userId ?? ""}
              onChange={handleSelect}
              options={tenants.map(t => ({
                value: t.user?.id ?? "",
                label: t.fullName
              }))}
            />

            <Select
              name="invoiceMonth"
              labelName="Month For"
              value={invoiceData?.invoiceMonth ?? parseInt(getDate("month"))}
              onChange={handleSelect}
              options={months.map(m => ({
                value: m.value,
                label: m.name
              }))}
            />

            <Select
              name="invoiceYear"
              labelName="Year For"
              value={invoiceData?.invoiceYear ?? parseInt(getDate("year"))}
              onChange={handleSelect}
              options={years.map(y => ({
                value: y.id,
                label: y.name
              }))}
            />
          </div>

          {/* ================= ITEMS ================= */}
          <div className="items" style={{ marginTop: "30px" }}>
            {Array.isArray(invoiceItems) && invoiceItems.length > 0 ? (
              invoiceItems.map((item, index) => (
                <div
                  key={index}
                  className="row"
                  style={{ alignItems: "center" }}
                >

                  {/* ===== CATEGORY ===== */}
                  <Select
                    name="transactionCategoryId"
                    labelName="Category"
                    value={item?.transactionCategoryId ?? ""}
                    onChange={(e) =>
                      handleItemChange(index, "transactionCategoryId", e.target.value)
                    }
                    options={transactionCategories.map(c => ({
                      value: c.id,
                      label: c.item
                    }))}
                  />

                  {/* ===== UTILITY (ONLY IF CATEGORY = UTILITY) ===== */}
                  {item?.transactionCategoryCode.toLowerCase() === "utility" && (
                    <Select
                      name="utilityBillId"
                      labelName="Utility Type"
                      value={item?.utilityBillId ?? ""}
                      onChange={(e) =>
                        handleItemChange(index, "utilityBillId", e.target.value)
                      }
                      options={
                        error
                          ? [{ value: "", label: "Error Fetching Utilities", disabled: true }]
                          : loading
                          ? [{ value: "", label: "Loading Utilities...", disabled: true }]
                          : Array.isArray(utillityBill)
                          ? utillityBill.map(u => ({
                              value: u.id,
                              label: u.name
                            }))
                          : [{ value: "", label: "No Utilities Found", disabled: true }]
                      }
                    />
                  )}

                  {/* ===== AMOUNT ===== */}
                  <Input
                    type="number"
                    labelName="Amount"
                    name="invoiceAmount"
                    value={item?.invoiceAmount ?? 0}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                  />

                  {/* ===== REMOVE ===== */}
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
            ) : (
              <div
                className="row"
                style={{ justifyContent: "center", opacity: 0.6 }}
              >
                No invoice items added
              </div>
            )}
          </div>

          {/* ================= ADD ITEM ================= */}
          <button
            type="button"
            onClick={handleAddItem}
            className="add-btn"
          >
            <FaPlusCircle className="plusIcon" /> Add Item
          </button>

        </div>
      </Modal>




      {/* ADD PAYMENT */}
      <Modal
          isOpen={addPaymentModal}
          onClose={handlePaymentCloseModal}
          onSubmit={handlePaymentFormSubmit}
          errorMessage={formError}
          title={"Add Payment"}
          loadingBtn={loadingBtn}
        >

          <Select
            name="payment_tenantId"
            labelName="Tenant"
            value={addPaymentData.payment_tenantId || ''}
            onChange={handleSelect}
            options={tenants.map(p => ({ value: p.id, label: p.fullName }))}
          />

      
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
            options={
                error
                    ? [{ value: '', label: 'Error Fetching Payment Methods', disabled: true }]
                    : loading
                    ? [{ value: '', label: 'Loading Payment Methods...', disabled: true }]
                    : paymentMethods.map(p => ({ value: p.id, label: p.item }))
                }
          />

          <Textarea
            type="text"
            name="notes"
            placeholder="Enter description"
            value={addPaymentData.notes || ''}
            labelName="Notes"
            onChange={handleInputChange}
          />

      </Modal>


      
      {/* GENERATE RENT INVOICES */}
      <Modal
        isOpen={rentInvoiceModal}
        onClose={handleRentInvoiceCloseModal}
        onSubmit={handleRentInvoiceFormSubmit}
        errorMessage={formError}
        title={"Generate Rent Invoices"}
        loadingBtn={loadingBtn}
      >

        <Select
          name="rentInvoice_property"
          labelName="Properties"
          value={rentInvoiceData.rentInvoice_property || 0}
          onChange={handleSelect}
          options={properties.map(p => ({ value: p.id, label: p.name }))}
        />

      </Modal>


      {/* GENERATE RECURRINGBILLS INVOICES */}
      <Modal
        isOpen={recurringBillsModal}
        onClose={handleRecurringBillsCloseModal}
        onSubmit={handlerecurringBillsFormSubmit}
        errorMessage={formError}
        title={"Generate Utility Bills Invoices"}
        loadingBtn={loadingBtn}
      >

        <Select
          name="recurringBills_propertyId"
          labelName="Properties"
          value={recurringBillsData.recurringBills_propertyId || 0}
          onChange={handleSelect}
          options={properties.map(p => ({ value: p.id, label: p.name }))}
        />

      </Modal>
          
    </section>
  </>
  )
}

export default Transaction