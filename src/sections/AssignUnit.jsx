import React, { useState, useEffect } from 'react';
import "../css/assignUnit.css"
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Select from '../components/Select';
import { addData } from '../helpers/addData';
import { getData } from '../helpers/getData';


const AssignUnit = () => {
    const [select, setSelect] = useState('');
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        tenantId: 0,
        unitId: 0
    });


    useEffect(() => {
        getData({
            endpoint: 'Tenant',
            setData: setTenants,
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