import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { addData } from '../../helpers/addData';
import { getData } from '../../helpers/getData';
import { tenantService } from "../tenants/tenantService";
import { unitService } from "./unitService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { useApiRequest } from '../../hooks/useApiRequest';
import "../../css/assignUnit.css";
import "../../css/App.css";


const AssignUnit = () => {
    const { execute, apiLoading } = useApiRequest();  
    const [select, setSelect] = useState('');
    
    const [tenants, setTenants] = useState([]);
    const [tenantLoading, setTenantLoading] = useState(true);
    const [tenantError, setTenantError] = useState(null);
    
    const [tenantStatus, setTenantStatus] = useState([]);
    const [tenantStatusLoading, setTenantStatusLoading] = useState(true);
    const [tenantStatusError, setTenantStatusError] = useState(null);
    
    const [units, setUnits] = useState([]);
    const [unitLoading, setUnitLoading] = useState(true);
    const [unitError, setUnitError] = useState(null);

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodLoading, setPaymentMethodLoading] = useState(true);
    const [paymentMethodError, setPaymentMethodError] = useState(null);

    const [showPaymentInputs, setShowPaymentInputs] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState(null);
    const EMPTY_FORM = {
        tenantId: 0,
        unitId: 0,
        statusId: 0,
        paymentMethodId: 0,
        depositAmount: 0,
        amountPaid: 0,
        paymentDate: null
    };
    const [formData, setFormData] = useState(EMPTY_FORM);



    useEffect(() => {
        fetchTenants();
        fetchTenantStatus();
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

        fetchUnitsByPropertyId(propertyId);

    }, [formData.tenantId]);


    useEffect(() => {
        if (!formData.statusId || !tenantStatus.length === 0) {
            setShowPaymentInputs(false);
            return;
        }

        // Find the selected status object
        const selectedStatus = tenantStatus.find(t => t.id === parseInt(formData.statusId));

        if (selectedStatus?.item.toLowerCase() === "active") {
            setShowPaymentInputs(true);
            fetchPaymentMethods();
        } else {
            setShowPaymentInputs(false);
        }

    }, [formData.statusId, tenantStatus]);


    const fetchTenants = async () => {
        await getData({
        execute,
        request: () => tenantService.getAll(),
        setData: setTenants,
        setLoading: setTenantLoading,
        setError: setTenantError
        });
    };

    const fetchTenantStatus = async () => {
        await getData({
        execute,
        request: () => systemCodeItemService.getTenantStatus(),
        setData: setTenantStatus,
        setLoading: setTenantStatusLoading,
        setError: setTenantStatusError
        });
    };

    const fetchUnitsByPropertyId = async (propertyId) => {
        await getData({
        execute,
        request: () => unitService.getByPropertyId(propertyId),
        setData: setUnits,
        setLoading: setUnitLoading,
        setError: setUnitError
        });
    };

    const fetchPaymentMethods = async () => {
        await getData({
        execute,
        request: () => systemCodeItemService.getPaymentMethods(),
        setData: setPaymentMethods,
        setLoading: setPaymentMethodLoading,
        setError: setPaymentMethodError
        });
    };
    






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


    const validateAssignForm = () => {  
        let { tenantId, unitId, statusId } = formData;

        // Convert to integers
        tenantId = parseInt(tenantId, 10);
        unitId = parseInt(unitId, 10);
        statusId = parseInt(statusId, 10);

        // Validate
        if (
            !tenantId || !unitId || !statusId ||
            tenantId <= 0 || unitId <= 0 || statusId <= 0
        ) {
            return "Please fill in all required fields.";
        }

        return '';
    };




      const assignUnitHandler = async (e) => {

        await handleFormSubmit({
          e,
          validateForm: validateAssignForm,
          execute,
          request: () => tenantService.assignUnit(formData),
          setFormError,
          setLoadingBtn,
          resetForm: () => setFormData(EMPTY_FORM),
          onSuccess: () => setLoadingBtn(false),
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
            <form onSubmit={assignUnitHandler}>

                <div className="row">
                    <Select
                        name="tenantId"
                        labelName="FullNames"
                        value={formData.tenantId || 0}
                        onChange={handleSelect}
                        options={
                        tenantError
                            ? [{ value: 0, label: 'Error Fetching Tenants', disabled: true }]
                            : tenantLoading
                            ? [{ value: 0, label: 'Loading Tenants...', disabled: true }]
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
                        name="statusId"
                        labelName="Status"
                        value={formData.statusId || 0}
                        onChange={handleSelect}
                        options={
                        tenantStatusError
                            ? [{ value: 0, label: "Error Fetching Status", disabled: true }]
                            : tenantStatusLoading
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
                                paymentMethodError
                                    ? [{ value: 0, label: "Error Fetching Payment Methods", disabled: true }]
                                    : paymentMethodLoading
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
                    disabled={loadingBtn}
                />

            </form>

        </div>

            
    </div>
  </>
  )
}

export default AssignUnit