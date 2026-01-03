import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getColumns } from "../columns/transactionColumn";
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';  
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { getDate } from '../helpers/getDate';
import { getData } from '../helpers/getData';
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';
import { months } from '../includes/months';
import { years } from '../includes/years';



const Transaction = () => {
    const [activeRow, setActiveRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
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
      { utillityBillName: '', invoiceAmount: 0 }
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


    const [recurringBillsData, setRecurringBillsData] = useState({
      recurringBills_propertyId: 0,
    });
    


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
      getData({
          endpoint: 'Transaction',
          setData: setTransactions,
          setLoading,
          setError
      });
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
        getData({
          endpoint: `Tenants`,
          setData: setTenants,
          setLoading,
          setError
        });

        if(invoiceData && invoiceData.tenantId){
          getData({
            endpoint: `UtilityBill/By-TenantId/${invoiceData.tenantId}`,
            setData: setUtillityBill,
            setLoading,
            setError
          });
        }
        return;
      }else if(actionOptions.actions == "addPayment"){
        getData({
          endpoint: `Tenants`,
          setData: setTenants,
          setLoading,
          setError
        });

        getData({
          endpoint: `SystemCodeItem/BY-NAME/PAYMENTMETHOD`,
          setData: setPaymentMethods,
          setLoading,
          setError
        });
        return;
      }else if(actionOptions.actions == "rentInvoice"){
        getData({
          endpoint: `Properties`,
          setData: setProperties,
          setLoading,
          setError
        });
      }else if(actionOptions.actions == "addRecurringUtilities"){
        getData({
          endpoint: `Properties`,
          setData: setProperties,
          setLoading,
          setError
        });
      }


    }, [actionOptions.actions]);

    

    useEffect(() => {
      if (invoiceData && invoiceData.tenantId) {
        getData({
          endpoint: 'SystemCodeItem/BY-NAME/TRANSACTIONTYPE',
          setData: setTransactionType,
          setLoading,
          setError
        });

        getData({
          endpoint: `UtilityBill/By-TenantId/${invoiceData.tenantId}`,
          setData: setUtillityBill,
          setLoading,
          setError
        });

      }
    }, [addInvoiceModal && invoiceData]);




    const columns = getColumns({
      endpoint: "Transaction",
      activeRow,
      setActiveRow,
      setSelectedId,
      setDeleteModalOpen,
      setInvoiceFormData,
      setShowModal,
      transactions,
    });



    const handleSelect = (e) => {
      const { name, value } = e.target;
      setSelect(value);

      const addInvoiceFields = ["tenantId", "invoiceMonth", "invoiceYear"];
      const addPaymentFields = ["payment_tenantId", "paymentMethod"];
      const rentInvoiceField = ["rentInvoice_property"];
      const recurringBillFields = ["recurringBills_propertyId"];


      if(addInvoiceFields.includes(name)){
        setInvoiceData(prev => ({
          ...prev,
          [name]: value
        }));
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
 




    const handleInvoiceCloseModal = () => {
      setFormError('');
      setInvoiceData({invoiceMonth: parseInt(getDate("month")), invoiceYear: parseInt(getDate("year")) });
      setInvoiceItems([{utillityBillName: '', invoiceAmount: 0}]);
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
    
          if(activeTenant){
            userId = activeTenant.user.id;
          }
          console.log(invoiceData);
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



    const handleInvoiceFormSubmit = (e) => {
      const payload = {
        userId: invoiceData.tenantId,
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
      setFormData: setInvoiceData,
      setShowModal: setAddInvoiceModal,
      refreshDataUrl: "Transaction",
      setData: setTransactions,
      getdata: true,
      setLoading: setLoading,
    });
    };


    const handlePaymentFormSubmit = (e) => {
      const payload = {
        tenantId: addPaymentData.payment_tenantId,
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
        setFormData: setAddPaymentData,
        setShowModal: setAddPaymentModal,
        refreshDataUrl: "Transaction",
        setData: setTransactions,
        getdata: true,
        setLoading: setLoading,
      });
    };


    const handleRentInvoiceFormSubmit = (e) => {
      const payload = {
        propertyId: rentInvoiceData.rentInvoice_property,
      };

      addData({
        e,
        validateForm: validateRentInvoiceForm,
        formData: payload,
        endpoint: `Transaction/GenerateRentInvoices/${rentInvoiceData.rentInvoice_property}`,
        setFormError,
        setLoadingBtn,
        setFormData: setRentInvoiceData,
        setShowModal: handleRentInvoiceCloseModal,
        setData: setTransactions,
        getdata: false,
        setLoading: setLoading,
      });
    };



    const handlerecurringBillsFormSubmit = (e) => {
      const payload = {
        propertyId: recurringBillsData.recurringBills_propertyId,
      };

      addData({
        e,
        validateForm: validateRecurringBillsForm,
        formData: payload,
        endpoint: `Transaction/GenerateUtilityBillInvoices/${recurringBillsData.recurringBills_propertyId}`,
        setFormError,
        setLoadingBtn,
        setFormData: setRecurringBillsData,
        setShowModal: handleRecurringBillsCloseModal,
        refreshDataUrl: "Transaction",
        setData: setTransactions,
        getdata: true,
        setLoading: setLoading,
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
          <Table data={transactions} columns={columns} loading={loading}  error={error}/>
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
        onClose={() => handleInvoiceCloseModal(false)}
        onSubmit={handleInvoiceFormSubmit}
        errorMessage={formError}
        title={"Add Invoice"}
        loadingBtn={loadingBtn}
      >
        
        <div className="col">
          <div className="row">
            <Select
              name="tenantId"
              labelName="Tenant"
              value={invoiceData.tenantId || ''}
              onChange={handleSelect}
              options={
                tenants.map(p => ({
                  value: p.user?.id ?? '',
                  label: p.fullName
                }))
              }

            />


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
        
        

          <div className="items" style={{ marginTop: "30px"}}>
            {invoiceItems.map((item, index) => (
              <div key={index} className="row" style={{ alignItems: "center" }}>

                <Select
                  name="utillityBillName"
                  labelName="Item Type"
                  value={item.utillityBillName ?? ''}
                  disabled={!invoiceData.tenantId}
                  onChange={(e) =>
                    handleItemChange(index, "utillityBillName", e.target.value)
                  }
                  options={
                    error
                        ? [{ value: '', label: 'Error Fetching Items', disabled: true }]
                        : loading
                        ? [{ value: '', label: 'Loading Items...', disabled: true }]
                        : utillityBill.map(p => ({ value: p.id, label: p.name }))
                    }
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
          </div>


          <button
            type="button"
            onClick={handleAddItem}
            className="add-btn"
          >
            <FaPlusCircle className='plusIcon' /> Add Item
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