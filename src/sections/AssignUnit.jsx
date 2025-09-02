import React, { useState, useEffect } from 'react';
import "../css/assignUnit.css"
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Select from '../components/Select';
import Input from '../components/Input';
import { addData } from '../helpers/addData';
import { getData } from '../helpers/getData';


const AssignUnit = () => {
    const [select, setSelect] = useState('');
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [showPaymentInputs, setShowPaymentInputs] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [tenantStatus, setTenantStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        tenantId: 0,
        unitId: 0,
        status: 0,
        paymentMethodId: 0,
        depositAmount: 0,
        amountPaid: 0,
        paymentDate: ''
    });



    useEffect(() => {
        getData({
            endpoint: 'Tenant',
            setData: setTenants,
            setLoading,
            setError
        });

        getData({
            endpoint: 'systemCodeItem/BY-NAME/TENANTSTATUS',
            setData: setTenantStatus,
            setLoading,
            setError
        });


    }, []);

    

    useEffect(() => {
        if (!formData.tenantId) {
            setUnits([]);
            return;
        }

        // Find the tenant using the most recent tenants list
        const tenant = tenants.find(t => t.id === parseInt(formData.tenantId));
        const propertyId = tenant?.user?.propertyId;

        if (!propertyId) {
            setUnits([]);
            return;
        }

        getData({
            endpoint: `Unit/By-Property/${propertyId}`,
            setData: setUnits,
            setLoading,
            setError
        });

    }, [formData.tenantId]);



    useEffect(() => {
        if (!formData.status || !tenantStatus.length === 0) {
            setShowPaymentInputs(false);
            return;
        }

        // Find the selected status object
        const selectedStatus = tenantStatus.find(t => t.id === parseInt(formData.status));

        if (selectedStatus?.item.toLowerCase() === "active") {
            setShowPaymentInputs(true);
            getData({
                endpoint: 'systemCodeItem/BY-NAME/PAYMENTMETHOD',
                setData: setPaymentMethods,
                setLoading,
                setError
            });
        } else {
            setShowPaymentInputs(false);
        }

    }, [formData.status, tenantStatus]);


    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    

    const handleSelect = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'tenantId') updated.unitId = 0;
            return updated;
        });
    };



    const validateForm = () => {
      var {tenantId, unitId } = formData;
    
      if (!tenantId || !unitId || tenantId <= 0 || unitId <= 0) {
        return "Please fill in all required fields.";
      }

    
      return '';
    };



    const handleFormSubmit = (e) => {
        e.preventDefault();
         addData({
        e,
        validateForm,
        formData,
        endpoint: 'Tenant/AssignUnit',
        setFormError,
        setLoadingBtn,
        setFormData,
        setShowModal,
        setData: setTenants,
        getdata: false,
        setLoading,
      });
    };



  return (
    <>
    <BreadCrumb  greetings="" />
    <div id="Section">
        <div className="header">
            <h3>Assign House to Tenant</h3>
        </div>

        <div className="AssignContainer">
            <form onSubmit={handleFormSubmit}>

                <div className="row">
                    <Select
                        name="tenantId"
                        labelName="FullNames"
                        value={formData.tenantId || 0}
                        onChange={handleSelect}
                        options={
                        error
                            ? [{ value: '', label: 'Error Fetching Tenants', disabled: true }]
                            : loading
                            ? [{ value: '', label: 'Loading Tenants...', disabled: true }]
                            : tenants.map(p => ({ value: p.id, label: p.fullName }))
                        }
                    />

                    <Select
                        name="unitId"
                        labelName="Units Available"
                        value={formData.unitId || 0}
                        onChange={handleSelect}
                        options={
                            formData.tenantId
                            ? units && units.filter(u => u.status?.toLowerCase() === "vacant").length > 0
                                ? units
                                    .filter(u => u.status?.toLowerCase() === "vacant")
                                    .map(u => ({ value: u.id, label: u.name }))
                                : [{ value: '', label: 'No vacant units available', disabled: true }]
                            : [{ value: '', label: 'Choose Tenant First', disabled: true }]
                        }

                    />

                    <Select
                        name="status"
                        labelName="Status"
                        value={formData.status || 0}
                        onChange={handleSelect}
                        options={
                        error
                            ? [{ value: 0, label: "Error Fetching Status", disabled: true }]
                            : loading
                            ? [{ value: 0, label: "Loading Status...", disabled: true }]
                            : tenantStatus.map(p => ({ value: p.id, label: p.item }))
                        }
                    />
                </div>
                


                    {showPaymentInputs && (
                        <div className="row">

                            <Select
                                name="paymentMethodId"
                                labelName="Payment Method"
                                value={formData.paymentMethodId || 0}
                                onChange={handleSelect}
                                options={
                                error
                                    ? [{ value: 0, label: "Error Fetching Payment Methods", disabled: true }]
                                    : loading
                                    ? [{ value: 0, label: "Loading Payment Methods...", disabled: true }]
                                    : paymentMethods.map(p => ({ value: p.id, label: p.item }))
                                }
                            />
                            


                            <Input
                                type="number"
                                name="depositAmount"
                                placeholder="Enter Deposit Amount"
                                labelName="Deposit Amount"
                                value={formData.depositAmount || ''}
                                onChange={handleInputChange}
                            />

                            <Input
                                type="number"
                                name="amountPaid"
                                placeholder="Enter Amount Paid"
                                value={formData.amountPaid || ''}
                                labelName="Rent"
                                onChange={handleInputChange}
                            />
                                
                    
                            <Input
                                type="date"
                                name="paymentDate"
                                labelName="Payment Date"
                                value={formData.paymentDate || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

              


                {formError && <p className='errorMessage'>{formError}</p>}

                <PrimaryButton
                    name="Assign"
                    type="submit"
                    loading={loadingBtn}
                />

            </form>

        </div>

            
    </div>
  </>
  )
}

export default AssignUnit